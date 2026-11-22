"use strict";
const {parseGuideIndex,parseGuidePage}=require("./statsdota-guide-sync");
const BASE="https://statsdota.com/en/guides",RAW="https://raw.githubusercontent.com/odota/dotaconstants/master/build";
(async()=>{
 const [indexResponse,heroesResponse,abilitiesResponse]=await Promise.all([
  fetch(BASE,{headers:{"User-Agent":"Mozilla/5.0 Dota2BuildAssistant audit"}}),
  fetch(RAW+"/heroes.json"),fetch(RAW+"/hero_abilities.json")
 ]);
 const [indexHtml,heroesRaw,heroAbilities]=await Promise.all([indexResponse.text(),heroesResponse.json(),abilitiesResponse.json()]);
 const heroes=Array.isArray(heroesRaw)?heroesRaw:Object.values(heroesRaw||{});
 const links=parseGuideIndex(indexHtml,heroes);
 console.log(JSON.stringify({source:"StatsDota guide index",status:indexResponse.status,heroes:heroes.length,guideLinks:links.length,sample:links.slice(0,8).map(x=>({name:x.hero.localized_name,slug:x.slug}))}));
 for(const scheme of ["http://","https://"]){
  try{
   const url="https://r.jina.ai/"+scheme+"dota2protracker.com/api/hero/96/builds?position=pos%203";
   const response=await fetch(url,{headers:{"Accept":"application/json"}});
   const body=await response.text();
   let data=null,rows=[];try{data=JSON.parse(body);const raw=data&&data.data&&data.data.content;if(typeof raw==="string"){const parsed=JSON.parse(raw);rows=Array.isArray(parsed)?parsed:Array.isArray(parsed&&parsed.builds)?parsed.builds:[]}}catch(_){}
   const first=rows.find(x=>x&&x.build_data)||null;
   const engine=require("../build-data-engine.js");
   const mapped=first?engine.mapD2ptSkillGuide(first,"npc_dota_hero_centaur",heroAbilities,{heroName:"Centaur Warrunner",heroSlug:"centaur-warrunner",role:"Offlane",patch:"7.42",matches:first.num_matches}):null;
   console.log(JSON.stringify({source:"Jina proxy for Dota2ProTracker",scheme,status:response.status,bytes:body.length,isJson:!!data,buildCount:rows.length,heroId:first?.hero_id,position:first?.position,matches:first?.num_matches,abilityOrders:first?.build_data?.abilities_new?.length||0,talentRows:first?.build_data?.talents?.length||0,mappedLevels:mapped?.skillBuild?.length||0,mappedSequence:mapped?.skillOrder?.slice(0,10)||[],mappedTalents:mapped?.talentChoices?.map(t=>({level:t.level,chosen:t.chosen}))||[],preview:body.slice(0,220)}));
  }catch(error){console.log(JSON.stringify({source:"Jina proxy for Dota2ProTracker",scheme,error:String(error)}))}
 }
 const checks=["centaur-warrunner","enigma","pugna","crystal-maiden","techies"];
 const d2ptChecks=[{hero:"Centaur Warrunner",id:96,position:3},{hero:"Pugna",id:45,position:2},{hero:"Enigma",id:33,position:3}];
 for(const item of d2ptChecks){
  try{
   const url="https://dota2protracker.com/api/hero/"+item.id+"/builds?position=pos%20"+item.position;
   const response=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0 Dota2BuildAssistant audit","Accept":"application/json"}});
   const body=await response.text();
   let data=null;try{data=JSON.parse(body)}catch(_){}
   const rows=Array.isArray(data)?data:Array.isArray(data?.builds)?data.builds:[];
   const first=rows.find(x=>x&&x.build_data)||null;
   console.log(JSON.stringify({source:"Dota2ProTracker",hero:item.hero,position:item.position,status:response.status,bytes:body.length,isJson:!!data,buildCount:rows.length,firstBuildKeys:first?Object.keys(first.build_data||{}):[],abilityOrders:first?.build_data?.abilities_new?.length||0,talentRows:first?.build_data?.talents?.length||0,bodyPreview:data?undefined:body.slice(0,240)}));
  }catch(error){console.log(JSON.stringify({source:"Dota2ProTracker",hero:item.hero,error:String(error)}))}
 }
 for(const slug of checks){
  try{
   const response=await fetch(BASE+"/"+slug,{headers:{"User-Agent":"Mozilla/5.0 Dota2BuildAssistant audit"}});
   const html=await response.text();
   const link=links.find(x=>x.slug===slug);
   const guide=link?parseGuidePage(html,link.hero,heroAbilities,BASE+"/"+slug):null;
   console.log(JSON.stringify({slug,status:response.status,bytes:html.length,role:guide?.role||null,patch:guide?.patch||null,matches:guide?.matches||0,abilityOrder:guide?.abilityOrder?.slice(0,15)||[],guideStatus:guide?.status||"unmapped"}));
  }catch(error){console.log(JSON.stringify({slug,error:String(error)}))}
 }
})().catch(error=>{console.error(error);process.exitCode=1});
