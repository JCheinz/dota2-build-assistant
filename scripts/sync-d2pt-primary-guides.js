"use strict";
const fs=require("node:fs");
const path=require("node:path");
const engine=require("../build-data-engine");
const ROLES=new Set(["Carry","Mid","Offlane","Support 4","Support 5"]);
const PATCH="7.42",PATCH_RELEASE="2026-11-18";
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const arg=(name,fallback)=>{const p="--"+name+"=";const v=process.argv.find(x=>x.startsWith(p));return v?v.slice(p.length):fallback};
function rowsOf(raw){return Array.isArray(raw)?raw:Array.isArray(raw&&raw.builds)?raw.builds:[]}
function updatedAt(row){const v=row&&row.updated_at;if(!v)return null;const n=Number(v),d=new Date(Number.isFinite(n)&&n>1e9&&n<1e12?n*1000:v);return Number.isNaN(d.getTime())?null:d.toISOString()}
async function fetchJson(url){const r=await fetch(url,{headers:{Accept:"application/json","User-Agent":"Dota2BuildAssistant-primary-guide-sync"}});if(!r.ok)throw new Error("HTTP "+r.status+" · "+url);return r.json()}
async function main(){
 const input=arg("input",path.resolve(__dirname,"..","statsdota-guides.json"));
 const output=arg("output",path.resolve(__dirname,"..","d2pt-primary-guides.json"));
 const snapshot=JSON.parse(fs.readFileSync(input,"utf8"));
 const [heroesRaw,heroAbilities]=await Promise.all([
  fetchJson("https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json"),
  fetchJson("https://raw.githubusercontent.com/odota/dotaconstants/master/build/hero_abilities.json")
 ]);
 const heroes=(Array.isArray(heroesRaw)?heroesRaw:Object.values(heroesRaw||{})).filter(h=>h&&h.id&&h.name);
 const byKey=new Map(heroes.map(h=>[h.name,h]));
 const incomplete=Array.isArray(snapshot.incomplete)?snapshot.incomplete:[];
 const tasks=incomplete.map(row=>({row,hero:byKey.get(row.hero)})).filter(x=>x.hero&&ROLES.has(x.row.role));
 const skipped=incomplete.filter(row=>!ROLES.has(row.role)||!byKey.has(row.hero)).map(row=>({hero:row.hero,role:row.role||null,reason:"No se pudo determinar una posición principal sin adivinar."}));
 const existing={};
 const prior=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,"utf8")):null;
 if(prior&&prior.guides)Object.assign(existing,prior.guides);
 const results=[],minimumDelay=Number(arg("delay-ms","3500")),maxRetries=Number(arg("retries","4"));
 let lastRequest=0,rateLimitedStop=false;
 console.log("D2PT: "+tasks.length+" guías incompletas elegibles · una consulta por héroe · concurrencia 1 · espera mínima "+minimumDelay+" ms.");
 for(let i=0;i<tasks.length;i++){
  const {row,hero}=tasks[i],role=row.role,position=({Carry:1,Mid:2,Offlane:3,"Support 4":4,"Support 5":5})[role];
  const url="https://dota2protracker.com/api/hero/"+hero.id+"/builds?position=pos%20"+position;
  let raw=null,error=null;
  for(let attempt=0;attempt<=maxRetries;attempt++){
   const wait=Math.max(0,minimumDelay-(Date.now()-lastRequest));
   if(wait)await sleep(wait);
   lastRequest=Date.now();
   try{raw=await engine.fetchD2ptJson(url,fetch);error=null;break}
   catch(e){
    error=e;
    const is429=/429|rate.?limit|temporarily limited/i.test(String(e&&e.message||e));
    if(attempt>=maxRetries)break;
    const backoff=is429?Math.min(180000,90000*Math.pow(2,attempt)):Math.min(45000,5000*Math.pow(2,attempt));
    console.warn("Retry "+(attempt+1)+"/"+maxRetries+" "+hero.localized_name+" "+role+": "+e.message+" · espera "+backoff+" ms");
    await sleep(backoff);
   }
  }
  if(error){const limited=/429|rate.?limit|temporarily limited/i.test(String(error.message||error));results.push({hero:hero.name,heroName:hero.localized_name,heroId:hero.id,role,position,status:limited?"rate-limited":"error",reason:String(error.message).slice(0,350)});console.warn("No se pudo obtener "+hero.localized_name+": "+error.message);if(limited){rateLimitedStop=true;console.warn("Circuit breaker: D2PT sigue limitando peticiones; se detiene la cola para no insistir sobre el servicio.");break}continue}
  const candidates=rowsOf(raw).filter(x=>x&&x.build_data&&typeof x.build_data==="object").sort((a,b)=>Number(b.num_matches||b.build_data?.num_matches||0)-Number(a.num_matches||a.build_data?.num_matches||0));
  const build=candidates[0];
  if(!build){results.push({hero:hero.name,heroName:hero.localized_name,heroId:hero.id,role,position,status:"missing",reason:"D2PT no devolvió build para la posición principal."});continue}
  const matches=Number(build.num_matches||build.build_data?.num_matches||0),updated=updatedAt(build);
  if(matches<20||!updated||new Date(updated)<new Date(PATCH_RELEASE)){
   results.push({hero:hero.name,heroName:hero.localized_name,heroId:hero.id,role,position,status:"stale-or-small-sample",matches,updatedAt:updated,reason:"Muestra menor a 20 o sin actualización verificable en 7.42."});continue;
  }
  const guide=engine.mapD2ptSkillGuide(build,hero.name,heroAbilities,{heroName:hero.localized_name,heroSlug:hero.name.replace(/^npc_dota_hero_/,""),role,patch:PATCH,matches});
  if(!guide||!Array.isArray(guide.skillBuild)||guide.skillBuild.filter(x=>x.code!=="A").length<6||!Array.isArray(guide.talentChoices)||guide.talentChoices.length!==4){
   results.push({hero:hero.name,heroName:hero.localized_name,heroId:hero.id,role,position,status:"incomplete",matches,updatedAt:updated,reason:"La fuente no aportó al menos seis puntos de habilidad y cuatro tiers de talentos."});continue;
  }
  const record={hero:hero.name,heroName:hero.localized_name,heroId:hero.id,role,position,status:"ready",source:"Dota2ProTracker",patch:PATCH,matches,updatedAt:updated,sourceUrl:"https://dota2protracker.com/hero/"+hero.id,guide};
  existing[hero.name]=record;results.push({hero:hero.name,heroName:hero.localized_name,role,status:"ready",matches,updatedAt:updated});
  console.log("OK "+(i+1)+"/"+tasks.length+" "+hero.localized_name+" · "+role+" · "+matches+" partidas");
 }
 const ready=Object.values(existing).filter(x=>x&&x.status==="ready");
 const counts={};for(const r of results)counts[r.status]=(counts[r.status]||0)+1;
 const report={schemaVersion:1,source:"Dota2ProTracker · una posición principal por héroe",patch:PATCH,patchReleaseDate:PATCH_RELEASE,generatedAt:new Date().toISOString(),requestedMissingGuides:incomplete.length,eligibleRequests:tasks.length,requestPolicy:{concurrency:1,minimumDelayMs:minimumDelay,retries:maxRetries,backoff:"exponencial; 30s inicial para HTTP 429"},readyCount:ready.length,counts,skipped,results,guides:existing};
 fs.writeFileSync(output,JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({output,requestedMissingGuides:incomplete.length,eligibleRequests:tasks.length,readyCount:ready.length,counts,skipped:skipped.length},null,2));
 if(tasks.length===0)throw new Error("No se pudo identificar la posición principal de ninguna guía incompleta; revisar snapshot StatsDota.");
}
main().catch(error=>{console.error(error);process.exitCode=1});
