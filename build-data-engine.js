(function(root){
"use strict";
const OPENDOTA="https://api.opendota.com/api";
const D2PT="https://dota2protracker.com/api";
const CACHE_KEY="dota-build-live-data-v1";
const CACHE_TTL=6*60*60*1000;
const memory=new Map();
let itemConstantsPromise=null;
function rolePosition(role){return({"Carry":1,"Mid":2,"Offlane":3,"Support 4":4,"Support 5":5})[role]||null}
function asNumber(v,fallback=0){const n=Number(v);return Number.isFinite(n)?n:fallback}
function safeDate(v){if(!v)return null;const n=Number(v);const d=new Date(Number.isFinite(n)&&n>1000000000&&n<100000000000? n*1000:v);return Number.isNaN(d.getTime())?null:d.toISOString()}
async function fetchJson(url,fetchImpl,timeoutMs=11000){
 const controller=typeof AbortController!=="undefined"?new AbortController():null;
 const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
 try{
  const response=await fetchImpl(url,{cache:"no-store",headers:{Accept:"application/json"},...(controller?{signal:controller.signal}:{})});
  if(!response||!response.ok)throw new Error("HTTP "+(response&&response.status||"desconocido"));
  return await response.json();
 }finally{if(timer)clearTimeout(timer)}
}
function readCache(storage,key){
 try{const raw=storage&&storage.getItem(key);if(!raw)return null;const v=JSON.parse(raw);return v&&v.savedAt&&Date.now()-v.savedAt<CACHE_TTL?v.data:null}catch(_){return null}
}
function writeCache(storage,key,data){
 try{if(storage)storage.setItem(key,JSON.stringify({savedAt:Date.now(),data}))}catch(_){}
}
async function loadItemConstants(fetchImpl,baseUrl){
 if(itemConstantsPromise)return itemConstantsPromise;
 itemConstantsPromise=fetchJson(baseUrl+"/constants/items",fetchImpl).then(data=>{
  const byId={},byName={};
  for(const[key,value]of Object.entries(data||{})){
   const id=asNumber(value&&value.id,-1),display=value&&(value.dname||value.display_name||value.name)||key;
   if(id>=0)byId[id]={key,name:display,cost:asNumber(value.cost,0)};
   byName[key]={key,name:display,id,cost:asNumber(value&&value.cost,0)};
  }
  return{byId,byName};
 }).catch(error=>{itemConstantsPromise=null;throw error});
 return itemConstantsPromise;
}
function mapD2ptItems(build,constants){
 const raw=build&&build.build_data||{},items=Array.isArray(raw.anchor_items)?raw.anchor_items.slice():[];
 const seen=new Set();
 return items.sort((a,b)=>asNumber(a.avg_minute)-asNumber(b.avg_minute)).map(row=>{
  const id=asNumber(row.raw_item_id??String(row.key||"").split("::")[0],-1),meta=constants.byId[id];
  if(!meta)return null;
  const name=meta.name;
  if(!name||seen.has(name))return null;
  const count=asNumber(row.rel_count??row.count,0),pick=asNumber(row.rel_pr??row.pr,0);
  if(count<5&&pick<0.08)return null;
  seen.add(name);
  return{name,id,minute:Math.max(0,asNumber(row.avg_minute)),pickRate:pick,matchCount:count,winRate:Number.isFinite(Number(row.win_rate))?Number(row.win_rate):null,cost:meta.cost};
 }).filter(Boolean);
}
function phaseItems(payload,constants){
 const phases=[["start_game","Inicio"],["early_game","Línea"],["mid_game","Core"],["late_game","Avanzada"]],out=[];
 for(const[key,stage]of phases){
  const group=payload&&payload[key]||{};
  const rows=Array.isArray(group)?group:Object.entries(group).map(([item,count])=>({item,count}));
  const mapped=rows.map(row=>{
   const raw=String(row.item||row.name||row.key||"").replace(/^item_/,"");
   const meta=constants.byName[raw];
   if(!meta)return null;
   return{name:meta.name,count:asNumber(row.count??row.games??row.value,0),stage,minute:null,cost:meta.cost};
  }).filter(Boolean).sort((a,b)=>b.count-a.count).slice(0,12);
  out.push(...mapped);
 }
 return out;
}
function buildPlan(heroName,role,items,meta){
 const early=[],core=[],situational=[];
 for(const item of items){
  const row=[item.name,meta.source==="OpenDota"?"Popularidad reciente del héroe; OpenDota no separa esta muestra por posición.":("Frecuencia "+Math.round(item.pickRate*100)+"% · "+item.matchCount.toLocaleString("es-AR")+" registros"+(item.minute!=null?" · compra media "+item.minute.toFixed(1)+" min":"")+".")];
  const stage=item.stage||(item.minute<12?"early":item.minute<28?"core":"late");
  if(stage==="Inicio"||stage==="Línea"||stage==="early")early.push(row);
  else if(stage==="Core"||stage==="mid")core.push(row);
  else situational.push(row);
 }
 return{title:heroName+" · "+role+" · build estadística dinámica",early:early.slice(0,5),core:core.slice(0,6),situational:situational.slice(0,6),note:meta.source+" · parche "+(meta.patch||"no confirmado")+(meta.matches?" · "+meta.matches.toLocaleString("es-AR")+" partidas":"")+(meta.winRate!=null?" · "+(meta.winRate*100).toFixed(1)+"% victorias":"")+". Datos estadísticos: orientan la frecuencia y el orden; el draft y el inventario deciden la compra."};
}
async function loadHeroBuild(options){
 const o=options||{},fetchImpl=o.fetch||root.fetch,storage=o.storage||(root&&root.localStorage),heroId=asNumber(o.heroId,-1),role=String(o.role||""),position=rolePosition(role),patch=String(o.patch||"");
 if(typeof fetchImpl!=="function")throw new Error("Este entorno no dispone de fetch.");
 if(heroId<0||!position)throw new Error("Falta el héroe o la posición para consultar builds.");
 const key=heroId+"|"+position+"|"+patch;
 if(!o.force){const cached=memory.get(key)||readCache(storage,CACHE_KEY+":"+key);if(cached){memory.set(key,cached);return{...cached,cached:true}}}
 const base=(o.openDotaBase||OPENDOTA).replace(/\/$/,""),d2ptBase=(o.d2ptBase||D2PT).replace(/\/$/,"");
 let d2ptError=null,constants=null;
 try{
  const [raw,items]=await Promise.all([
   fetchJson(d2ptBase+"/hero/"+heroId+"/builds?position=pos%20"+position,fetchImpl),
   loadItemConstants(fetchImpl,base)
  ]);
  constants=items;
  const rows=Array.isArray(raw)?raw:Array.isArray(raw&&raw.builds)?raw.builds:[];
  const build=rows.slice().sort((a,b)=>asNumber(b.num_matches)-asNumber(a.num_matches))[0];
  if(build&&build.build_data){
   const data=mapD2ptItems(build,constants);
   const updatedAt=safeDate(build.updated_at||raw.updated_at);
   const patchIsFresh=!patch||!o.patchReleaseDate||!updatedAt||new Date(updatedAt)>=new Date(o.patchReleaseDate);
   if(data.length&&patchIsFresh){
    const matches=asNumber(build.num_matches||build.build_data.num_matches,0),winRate=Number.isFinite(Number(build.win_rate??build.build_data.win_rate))?Number(build.win_rate??build.build_data.win_rate):null;
    const itemsForPlan=data.map(x=>({...x,stage:x.minute<12?"early":x.minute<28?"mid":"late"}));
    const result={heroId,role,position,patch,source:"Dota2ProTracker",sourceUrl:"https://dota2protracker.com/hero/"+heroId,updatedAt,matches,winRate,items:data,plan:buildPlan(o.heroName||"Héroe",role,itemsForPlan,{source:"Dota2ProTracker",patch,matches,winRate}),quality:matches>=100?"alta":matches>=30?"media":"baja",scope:"posición"};
    memory.set(key,result);writeCache(storage,CACHE_KEY+":"+key,result);return result;
   }
   d2ptError=new Error("Dota2ProTracker no tiene una muestra suficiente o actualizada para "+patch+".");
  }else d2ptError=new Error("Dota2ProTracker no devolvió una build válida para esta posición.");
 }catch(error){d2ptError=error}
 try{
  if(!constants)constants=await loadItemConstants(fetchImpl,base);
  const popularity=await fetchJson(base+"/heroes/"+heroId+"/itemPopularity",fetchImpl);
  const items=phaseItems(popularity,constants);
  if(!items.length)throw new Error("OpenDota no devolvió compras parseadas para este héroe.");
  const result={heroId,role,position,patch,source:"OpenDota",sourceUrl:"https://www.opendota.com/heroes/"+heroId+"/itemPopularity",updatedAt:new Date().toISOString(),matches:null,winRate:null,items,plan:buildPlan(o.heroName||"Héroe",role,items,{source:"OpenDota",patch}),quality:"orientativa",scope:"todas las posiciones",warning:"OpenDota itemPopularity no separa por posición ni confirma el parche de cada partida. Se usa como respaldo, no como build específica de rol.",fallbackReason:d2ptError?d2ptError.message:null};
  memory.set(key,result);writeCache(storage,CACHE_KEY+":"+key,result);return result;
 }catch(error){
  if(d2ptError)throw new Error("Dota2ProTracker: "+d2ptError.message+" · OpenDota: "+error.message);
  throw error;
 }
}
function get(heroId,role,patch){
 const key=asNumber(heroId,-1)+"|"+rolePosition(role)+"|"+String(patch||"");
 return memory.get(key)||readCache(root&&root.localStorage,CACHE_KEY+":"+key)||null;
}
function clear(){memory.clear();itemConstantsPromise=null}
const api={version:"1.0.0",rolePosition,loadHeroBuild,get,clear,cacheTtl:CACHE_TTL};
if(typeof module!=="undefined"&&module.exports)module.exports=api;
root.DotaBuildDataEngine=api;
})(typeof globalThis!=="undefined"?globalThis:this);
