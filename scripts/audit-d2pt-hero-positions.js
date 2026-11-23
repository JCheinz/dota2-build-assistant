"use strict";
const fs=require("node:fs");
const path=require("node:path");
const engine=require("../build-data-engine");
const HEROES_URL="https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json";
const HERO_ABILITIES_URL="https://raw.githubusercontent.com/odota/dotaconstants/master/build/hero_abilities.json";
const PATCH="7.42",PATCH_RELEASE="2026-11-18";
const ROLES=[["Carry",1],["Mid",2],["Offlane",3],["Support 4",4],["Support 5",5]];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function fetchJson(url,attempts=3){
 let last;
 for(let i=0;i<attempts;i++){
  try{const r=await fetch(url,{headers:{Accept:"application/json","User-Agent":"Dota2BuildAssistant guide coverage audit"}});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}
  catch(e){last=e;if(i+1<attempts)await sleep(500*(i+1))}
 }
 throw last;
}
function rowsOf(raw){return Array.isArray(raw)?raw:Array.isArray(raw&&raw.builds)?raw.builds:[]}
function updatedAt(row){const v=row&&row.updated_at;if(!v)return null;const n=Number(v),d=new Date(Number.isFinite(n)&&n>1e9&&n<1e12?n*1000:v);return Number.isNaN(d.getTime())?null:d.toISOString()}
async function worker(queue,fn,concurrency){const results=[];let cursor=0;await Promise.all(Array.from({length:concurrency},async()=>{while(true){const i=cursor++;if(i>=queue.length)return;results[i]=await fn(queue[i],i)}}));return results}
async function main(){
 const output=process.argv.find(x=>x.startsWith("--output="))?.slice(9)||path.resolve(__dirname,"..","d2pt-hero-position-audit.json");
 const [heroesRaw,heroAbilities]=await Promise.all([fetchJson(HEROES_URL),fetchJson(HERO_ABILITIES_URL)]);
 const heroes=(Array.isArray(heroesRaw)?heroesRaw:Object.values(heroesRaw||{})).filter(h=>h&&h.id&&h.name&&h.localized_name);
 const tasks=heroes.flatMap(hero=>ROLES.map(([role,position])=>({hero,role,position})));
 console.log("Auditing "+heroes.length+" heroes × "+ROLES.length+" positions = "+tasks.length+" combinations.");
 const results=await worker(tasks,async(task,index)=>{
  const {hero,role,position}=task,url="https://dota2protracker.com/api/hero/"+hero.id+"/builds?position=pos%20"+position;
  try{
   const raw=await engine.fetchD2ptJson(url,fetch);
   const candidates=rowsOf(raw).filter(x=>x&&x.build_data&&typeof x.build_data==="object").sort((a,b)=>Number(b.num_matches||b.build_data?.num_matches||0)-Number(a.num_matches||a.build_data?.num_matches||0));
   const build=candidates[0];
   if(!build)return{hero:hero.localized_name,heroKey:hero.name,heroId:hero.id,role,position,status:"missing",reason:"D2PT no devolvió una build para esta posición."};
   const matches=Number(build.num_matches||build.build_data?.num_matches||0),updated=updatedAt(build);
   if(matches<20)return{hero:hero.localized_name,heroKey:hero.name,heroId:hero.id,role,position,status:"insufficient-sample",matches,updatedAt:updated,reason:"Menos de 20 partidas."};
   if(!updated||new Date(updated)<new Date(PATCH_RELEASE))return{hero:hero.localized_name,heroKey:hero.name,heroId:hero.id,role,position,status:"stale",matches,updatedAt:updated,reason:"Build sin actualización verificable posterior al lanzamiento del parche "+PATCH+"."};
   const guide=engine.mapD2ptSkillGuide(build,hero.name,heroAbilities,{heroName:hero.localized_name,heroSlug:hero.name.replace(/^npc_dota_hero_/,""),role,patch:PATCH,matches});
   if(!guide)return{hero:hero.localized_name,heroKey:hero.name,heroId:hero.id,role,position,status:"incomplete",matches,updatedAt:updated,reason:"La build no contiene una secuencia de habilidades interpretable."};
   return{hero:hero.localized_name,heroKey:hero.name,heroId:hero.id,role,position,status:"ready",matches,updatedAt:updated,quality:matches>=100?"alta":matches>=30?"media":"baja",skillBuild:guide.skillBuild,talentChoices:guide.talentChoices,skillIcons:guide.skillIcons,skillOrder:guide.skillOrder,source:"Dota2ProTracker",patch:PATCH,sourceUrl:url};
  }catch(error){return{hero:task.hero.localized_name,heroKey:task.hero.name,heroId:task.hero.id,role:task.role,position:task.position,status:"error",reason:String(error).slice(0,500)}}
 },4);
 const counts={};for(const r of results)counts[r.status]=(counts[r.status]||0)+1;
 const ready=results.filter(r=>r.status==="ready"),byRole={};
 for(const [role] of ROLES){const rows=results.filter(r=>r.role===role);byRole[role]={total:rows.length,ready:rows.filter(r=>r.status==="ready").length,insufficient:rows.filter(r=>r.status==="insufficient-sample").length,stale:rows.filter(r=>r.status==="stale").length,missing:rows.filter(r=>r.status==="missing").length,incomplete:rows.filter(r=>r.status==="incomplete").length,errors:rows.filter(r=>r.status==="error").length}}
 const report={schemaVersion:1,source:"Dota2ProTracker live hero/position audit",patch:PATCH,patchReleaseDate:PATCH_RELEASE,generatedAt:new Date().toISOString(),heroCount:heroes.length,positionCount:ROLES.length,combinationCount:tasks.length,readyCount:ready.length,counts,byRole,results};
 fs.writeFileSync(output,JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({output,heroCount:heroes.length,combinationCount:tasks.length,readyCount:ready.length,counts,byRole},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});
