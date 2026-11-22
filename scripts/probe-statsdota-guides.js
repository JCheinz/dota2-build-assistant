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
 const checks=["centaur-warrunner","enigma","pugna","crystal-maiden","techies"];
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
