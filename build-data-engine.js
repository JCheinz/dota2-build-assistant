(function(root){
"use strict";
const OPENDOTA="https://api.opendota.com/api";
const D2PT="https://dota2protracker.com/api";
const DOTACONSTANTS="https://raw.githubusercontent.com/odota/dotaconstants/master/build";
const CACHE_KEY="dota-build-live-data-v6";
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
async function fetchD2ptProxyJson(url,fetchImpl){
 const response=await fetchImpl(url,{cache:"no-store",headers:{Accept:"application/json, text/plain"}});
 if(!response||!response.ok)throw new Error("HTTP "+(response&&response.status||"desconocido"));
 let raw;
 if(typeof response.text==="function"){
  const text=await response.text();
  try{raw=JSON.parse(text)}catch(error){
   const status=text.match(/\\b(429|403|502)\\b/);
   if(status)throw new Error("HTTP "+status[1]);
   const starts=[text.indexOf("{"),text.indexOf("[")].filter(x=>x>=0);const start=starts.length?Math.min(...starts):-1;
   if(start>=0){try{raw=JSON.parse(text.slice(start))}catch(_){throw error}}else throw error;
  }
 }else raw=await response.json();
 if(Array.isArray(raw)||Array.isArray(raw&&raw.builds))return raw;
 const body=raw&&raw.data&&raw.data.content;
 if(typeof body==="string"){
  const parsed=JSON.parse(body);
  if(Array.isArray(parsed)||Array.isArray(parsed&&parsed.builds))return parsed;
 }
 throw new Error("Jina no devolvió el JSON esperado de Dota2ProTracker.");
}
async function fetchD2ptJson(url,fetchImpl){
 const target=url.replace(/^http:\/\//,"https://");
 const proxyUrls=[
  "https://r.jina.ai/http://"+target.split("://").slice(1).join("://"),
  "https://r.jina.ai/https://"+target.split("://").slice(1).join("://")
 ];
 let proxyError=null;
 for(const proxyUrl of proxyUrls){
  try{
   return await fetchD2ptProxyJson(proxyUrl,fetchImpl);
  }catch(error){proxyError=error;if(/HTTP 429/.test(String(error&&error.message||error)))throw new Error("Dota2ProTracker temporalmente limitado por HTTP 429; reintentar con espera antes de probar otra ruta.");}
 }
 try{return await fetchJson(target,fetchImpl,12000)}
 catch(directError){throw new Error("Dota2ProTracker vía proxy: "+(proxyError&&proxyError.message||"sin respuesta")+" · acceso directo: "+directError.message)}
}
function readCache(storage,key){
 try{const raw=storage&&storage.getItem(key);if(!raw)return null;const v=JSON.parse(raw);return v&&v.savedAt&&Date.now()-v.savedAt<CACHE_TTL?v.data:null}catch(_){return null}
}
function writeCache(storage,key,data){
 try{if(storage)storage.setItem(key,JSON.stringify({savedAt:Date.now(),data}))}catch(_){}
}
function normalizeItemConstants(data){
 const byId={},byName={};
 for(const[key,value]of Object.entries(data||{})){
  if(!value||typeof value!=="object")continue;
  const id=asNumber(value.id,-1),display=value.dname||value.display_name||value.name||key;
  if(id>=0)byId[id]={key,name:display,cost:asNumber(value.cost,0)};
  byName[key]={key,name:display,id,cost:asNumber(value.cost,0)};
 }
 if(!Object.keys(byId).length)throw new Error("Catálogo de objetos vacío o inválido.");
 return{byId,byName};
}
async function loadItemConstants(fetchImpl,baseUrl){
 if(itemConstantsPromise)return itemConstantsPromise;
 itemConstantsPromise=(async()=>{
  let lastError=null;
  for(const url of [baseUrl+"/constants/items",DOTACONSTANTS+"/items.json"]){
   try{return normalizeItemConstants(await fetchJson(url,fetchImpl,20000))}
   catch(error){lastError=error}
  }
  throw lastError||new Error("No se pudo cargar el catálogo de objetos.");
 })().catch(error=>{itemConstantsPromise=null;throw error});
 return itemConstantsPromise;
}
function mapD2ptItems(build,constants){
 const raw=build&&build.build_data||{},items=(Array.isArray(raw.anchor_items)&&raw.anchor_items.length?raw.anchor_items:(Array.isArray(raw.anchor_items2)?raw.anchor_items2:[])).filter(row=>row&&typeof row==="object"&&!Array.isArray(row));
 const seen=new Set();
 return items.sort((a,b)=>asNumber(a.avg_minute)-asNumber(b.avg_minute)).map(row=>{
  const id=asNumber(row.raw_item_id??String(row.key||"").split("::")[0],-1),meta=constants&&constants.byId?constants.byId[id]:null;
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
 // OpenDota entrega actualmente start_game_items/early_game_items/etc.
 // Se conservan también los nombres antiguos y mapas por nombre para compatibilidad.
 const phases=[["start_game_items","start_game","Inicio"],["early_game_items","early_game","Línea"],["mid_game_items","mid_game","Core"],["late_game_items","late_game","Avanzada"]],out=[];
 for(const[key,legacyKey,stage]of phases){
  const group=payload&&(payload[key]??payload[legacyKey])||{};
  const rows=(Array.isArray(group)?group:Object.entries(group).map(([item,count])=>({item_id:item,item,count}))).filter(row=>row&&typeof row==="object");
  const mapped=rows.map(row=>{
   const rawId=asNumber(row.item_id??row.id,-1);
   const rawName=String(row.item||row.name||row.key||"").replace(/^item_/,"");
   const meta=(rawId>=0&&constants.byId[rawId])||constants.byName[rawName];
   if(!meta)return null;
   return{name:meta.name,count:asNumber(row.count??row.purchases??row.games??row.value,0),stage,minute:null,cost:meta.cost};
  }).filter(Boolean).sort((a,b)=>b.count-a.count).slice(0,12);
  out.push(...mapped);
 }
 return out;
}
let heroAbilityConstantsPromise=null;
async function loadHeroAbilityConstants(fetchImpl,baseUrl){
 if(heroAbilityConstantsPromise)return heroAbilityConstantsPromise;
 heroAbilityConstantsPromise=(async()=>{
  let lastError=null;
  for(const url of [baseUrl+"/constants/hero_abilities",DOTACONSTANTS+"/hero_abilities.json"]){
   try{return await fetchJson(url,fetchImpl,20000)}
   catch(error){lastError=error}
  }
  throw lastError||new Error("No se pudo cargar la asignación de habilidades.");
 })().catch(error=>{heroAbilityConstantsPromise=null;throw error});
 return heroAbilityConstantsPromise;
}
const ABILITY_LEVELS=[1,2,3,4,5,6,7,8,9,11,12,13,14,16,18];
const TALENT_LEVELS=[10,15,20,25];
function pct(v){const n=Number(v);return Number.isFinite(n)?Math.round(n*100):null}
function mapD2ptSkillGuide(build,heroKey,heroAbilities,meta){
 const bd=build&&build.build_data||{},orders=Array.isArray(bd.abilities_new)?bd.abilities_new:[];
 if(!orders.length||!Array.isArray(orders[0])||!Array.isArray(orders[0][0]))return null;
 const abilityRows=Array.isArray(bd.abilities)?bd.abilities:[];
 const byId={},byName={},rowById={};
 for(const row of abilityRows){
  if(!row)continue;
  const id=asNumber(row.ability_id??row.id,-1),name=String(row.name||row.internal_name||"");
  if(id>=0&&name){byId[id]=name;byName[name]=id;rowById[id]=row;}
 }
 const hero=heroAbilities&&heroAbilities[heroKey]||{},slots=Array.isArray(hero.abilities)?hero.abilities:[];
 const basicNames=slots.slice(0,3).filter(x=>x&&x!=="generic_hidden");
 const prefix=orders[0][0].map(x=>asNumber(x,-1)).filter(x=>x>=0);
 if(prefix.length<6)return null;
 let ult=prefix[5];
 if(prefix.filter(x=>x===ult).length>3)ult=null;
 const codeById={},skillIcons={},codeNames={};
 ["Q","W","E"].forEach((code,i)=>{
  const name=basicNames[i];
  if(!name)return;
  const id=byName[name];
  if(id===undefined)return;
  codeById[id]=code;codeNames[code]=name;
  skillIcons[code]={name:name.replace(/^[^_]+_/,"").replaceAll("_"," "),slug:name};
 });
 if(ult!==null){
  const name=byId[ult]||slots[5]||"Ultimate";
  codeById[ult]="R";codeNames.R=name;
  skillIcons.R={name:name.replace(/^[^_]+_/,"").replaceAll("_"," "),slug:name};
 }
 let extra=0;
 const codeFor=id=>{
  if(codeById[id])return codeById[id];
  const row=rowById[id],name=byId[id]||"Habilidad "+id;
  if(row&&(row.isTalent||row.isInnate))return null;
  const code="S"+(++extra);
  codeById[id]=code;codeNames[code]=name;
  skillIcons[code]={name:row&&row.displayName||name.replace(/^[^_]+_/,"").replaceAll("_"," "),slug:name};
  return code;
 };
 const skillBuild=[],points={},firstSeen={};
 prefix.forEach((id,i)=>{
  const level=ABILITY_LEVELS[i],code=codeFor(id);
  if(code)skillBuild.push({level,code});
  points[id]=(points[id]||0)+1;
  if(firstSeen[id]===undefined)firstSeen[id]=level;
 });
 const priority=Object.keys(points).map(Number).sort((a,b)=>points[b]-points[a]||firstSeen[a]-firstSeen[b]);
 // Add every non-hidden, non-innate basic ability, including one absent from the first ten points.
 for(const name of basicNames){
  const id=byName[name];
  if(id!==undefined&&id!==ult&&!priority.includes(id)){priority.push(id);points[id]=0;}
 }
 for(const row of abilityRows){
  const id=asNumber(row&&row.ability_id,-1);
  if(id>=0&&!row.isTalent&&!row.isInnate&&id!==ult&&!priority.includes(id)){
   const name=byId[id]||"";
   if(name&&!name.startsWith("special_bonus_")){priority.push(id);points[id]=0;}
  }
 }
 const used=new Set(skillBuild.map(x=>x.level));
 const remaining=ABILITY_LEVELS.filter(level=>!used.has(level));
 for(const level of remaining){
  let chosen=null;
  if(ult!==null){
   const have=points[ult]||0;
   if((have===1&&level>=12)||(have===2&&level>=18))chosen=ult;
  }
  if(chosen===null){
   chosen=priority.find(id=>(id===ult?(points[id]||0)<3:(points[id]||0)<4))??null;
  }
  if(chosen===null)continue;
  const code=codeFor(chosen);
  if(code)skillBuild.push({level,code});
  points[chosen]=(points[chosen]||0)+1;
 }
 // Dota grants attribute bonuses at levels without an ability/talent point.
 for(const level of [17,19,21,22,23,24])skillBuild.push({level,code:"A"});
 const talentRows=Array.isArray(bd.talents)?bd.talents:(Array.isArray(bd.ability_talents)?bd.ability_talents:[]);
 const talentChoices=talentRows.filter(t=>TALENT_LEVELS.includes(asNumber((t&&t.lvl)??(t&&t.level),-1))).map(t=>{
  const level=asNumber(t.lvl??t.level,0),left=t.left||null,right=t.right||null;
  const option=(x,side)=>x?{
   name:x.displayName||x.display_name||x.name||"Talento "+side,
   reason:"Elegido en "+(pct(x.pick_rate??x.pr)??"—")+"% de las partidas · "+(pct(x.win_rate)??"—")+"% de victorias en esa opción."
  }:null;
  const l=option(left,"izquierdo"),r=option(right,"derecho");
  if(!l||!r)return null;
  const choice=t.choice==="lt"?"left":t.choice==="rt"?"right":(Number((left.pick_rate??left.pr)??0)>=Number((right.pick_rate??right.pr)??0)?"left":"right");
  const chosen=choice==="left"?l:r,chosenRate=pct((choice==="left"?left:right).pick_rate??(choice==="left"?left:right).pr);
  return{level,left:l,right:r,chosen:choice,reason:"Más elegido: "+chosen.name+" ("+(chosenRate??"—")+"%). "+chosen.reason};
 }).filter(Boolean);
 const stat=orders[0][1]||{},alt=orders[1]||null;
 const matches=asNumber(build.num_matches??bd.num_matches,0),updatedAt=safeDate(build.updated_at);
 const orderNames=prefix.map(id=>{const name=byId[id]||"habilidad "+id;return byName[name]!==undefined?name.replace(/^[^_]+_/,"").replaceAll("_"," "):name;});
 const skillPriority="Secuencia de Dota2ProTracker para "+(meta.role||"esta posición")+". Muestra: "+(matches?matches.toLocaleString("es-AR")+" partidas":"sin tamaño informado")+". La secuencia principal aparece en "+(pct(stat.pr)??"—")+"% de la muestra"+(stat.win_rate!=null?" · "+pct(stat.win_rate)+"% de victorias":"")+". Orden observado (primeros 10 puntos): "+orderNames.join(" → ")+(alt&&Array.isArray(alt[0])?" · Alternativa: "+alt[0].slice(0,6).map(id=>(byId[id]||"habilidad "+id).replace(/^[^_]+_/,"").replaceAll("_"," ")).join(" → ")+" ("+(pct(alt[1]&&alt[1].pr)??"—")+"%).":"")+". Adaptá los puntos iniciales a la línea; la tendencia estadística no sustituye la situación de partida.";
 const metadata={patch:meta.patch||"no confirmado",role:meta.role||"",source:["Dota2ProTracker · secuencia y talentos por posición","OpenDota · identificación de habilidades y metadatos"],confidence:matches>=100?"alta":matches>=30?"media":"baja",matches,updatedAt:updatedAt||null,crossCheckUrl:"https://statsdota.com/en/guides/"+String(meta.heroSlug||heroKey.replace("npc_dota_hero_","")).replaceAll("_","-")};
 return{title:(meta.heroName||"Héroe")+" "+(meta.role||"")+" · guía estadística por posición",skillIcons,skillBuild:skillBuild.sort((a,b)=>a.level-b.level),talentChoices,skillPriority,metadata,skillOrder:orderNames,combos:[],positioning:"Los datos describen elecciones estadísticas de jugadores de alto nivel. Ajustá el primer punto a la amenaza de línea y coordiná las habilidades con tu equipo.",mechanics:"Los nombres y metadatos de habilidades se resuelven con OpenDota. La secuencia y las elecciones de talentos provienen de la build más jugada de Dota2ProTracker.",caveats:"No se inventan talentos ni habilidades ausentes en la muestra. La confianza depende del número de partidas. StatsDota se ofrece como referencia independiente para contrastar la guía actual; no se mezcla su muestra con la de Dota2ProTracker."};
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
 return{title:heroName+" · "+role+" · build estadística dinámica",early:early.slice(0,5),core:core.slice(0,6),situational:situational.slice(0,6),source:meta.source,patch:meta.patch||null,matches:meta.matches||null,winRate:meta.winRate??null,note:(meta.source==="Dota2ProTracker"?"Dota2ProTracker · referencia de alto MMR (7.000+ MMR/pro)":meta.source)+" · parche "+(meta.patch||"no confirmado")+(meta.matches?" · "+meta.matches.toLocaleString("es-AR")+" partidas":"")+(meta.winRate!=null?" · "+(meta.winRate*100).toFixed(1)+"% victorias":"")+". Datos estadísticos: orientan la frecuencia y el orden; el draft y el inventario deciden la compra."};
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
   fetchD2ptJson(d2ptBase+"/hero/"+heroId+"/builds?position=pos%20"+position,fetchImpl),
   loadItemConstants(fetchImpl,base)
  ]);
  constants=items;
  let heroAbilityConstants={};
  try{heroAbilityConstants=await loadHeroAbilityConstants(fetchImpl,base)}catch(_){heroAbilityConstants={}}
  const rows=(Array.isArray(raw)?raw:Array.isArray(raw&&raw.builds)?raw.builds:[]).filter(row=>row&&typeof row==="object"&&!Array.isArray(row)&&row.build_data&&typeof row.build_data==="object"&&!Array.isArray(row.build_data));
  const build=rows.slice().sort((a,b)=>asNumber(b.num_matches??b.build_data?.num_matches)-asNumber(a.num_matches??a.build_data?.num_matches))[0];
  if(build&&build.build_data){
   const data=mapD2ptItems(build,constants);
   const updatedAt=safeDate(build.updated_at||raw.updated_at);
   const patchIsFresh=!o.patchReleaseDate||(!!updatedAt&&new Date(updatedAt)>=new Date(o.patchReleaseDate));
   const matches=asNumber(build&&build.num_matches||build&&build.build_data&&build.build_data.num_matches,0);
   if(data.length&&patchIsFresh&&matches>=20){
    const winRate=Number.isFinite(Number(build.win_rate??build.build_data.win_rate))?Number(build.win_rate??build.build_data.win_rate):null;
    const itemsForPlan=data.map(x=>({...x,stage:x.minute<12?"early":x.minute<28?"mid":"late"}));
    const heroKey=String(o.heroKey||"npc_dota_hero_"+String(o.heroName||"").toLowerCase().replaceAll(" ","_"));
    const guide=mapD2ptSkillGuide(build,heroKey,heroAbilityConstants,{heroName:o.heroName||"Héroe",heroSlug:heroKey.replace("npc_dota_hero_",""),role,patch,matches});
    const result={heroId,role,position,patch,source:"Dota2ProTracker",sourceUrl:"https://dota2protracker.com/hero/"+heroId,updatedAt,matches,winRate,items:data,guide,plan:buildPlan(o.heroName||"Héroe",role,itemsForPlan,{source:"Dota2ProTracker",patch,matches,winRate}),quality:matches>=100?"alta":matches>=30?"media":"baja",scope:"posición",rankScope:"7.000+ MMR/pro"};
    memory.set(key,result);writeCache(storage,CACHE_KEY+":"+key,result);return result;
   }
   d2ptError=new Error("Dota2ProTracker no tiene al menos 20 partidas recientes y actualizadas para "+patch+" en esta posición.");
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
function clear(){memory.clear();itemConstantsPromise=null;heroAbilityConstantsPromise=null}
const api={version:"1.6.0",rolePosition,loadHeroBuild,get,clear,mapD2ptSkillGuide,fetchD2ptJson,cacheTtl:CACHE_TTL};
if(typeof module!=="undefined"&&module.exports)module.exports=api;
root.DotaBuildDataEngine=api;
})(typeof globalThis!=="undefined"?globalThis:this);
