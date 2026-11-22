"use strict";
const fs=require("node:fs"),path=require("node:path");
const {parseGuideIndex,parseGuidePage}=require("./statsdota-guide-sync");
const BASE="https://statsdota.com/en/guides";
const CURRENT_PATCH="7.42";
const CONSTANTS="https://raw.githubusercontent.com/odota/dotaconstants/master/build";
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function fetchText(url,attempts=3){
 let last;
 for(let attempt=0;attempt<attempts;attempt++){
  try{
   const response=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0 Dota2BuildAssistant/1.0","Accept":"text/html,application/json"}});
   if(!response.ok)throw new Error("HTTP "+response.status+" for "+url);
   return await response.text();
  }catch(error){last=error;if(attempt+1<attempts)await sleep(1500*(attempt+1))}
 }
 throw last||new Error("Fetch failed: "+url);
}
async function fetchJson(url){return JSON.parse(await fetchText(url))}
function arg(name,fallback){const prefix="--"+name+"=";const item=process.argv.find(x=>x.startsWith(prefix));return item?item.slice(prefix.length):fallback}
async function main(){
 const limit=Number(arg("limit","0"))||0,output=arg("output",path.resolve(__dirname,"..","statsdota-guides.json"));
 const [heroesRaw,heroAbilities,indexHtml]=await Promise.all([
  fetchJson(CONSTANTS+"/heroes.json"),
  fetchJson(CONSTANTS+"/hero_abilities.json"),
  fetchText(BASE)
 ]);
 const heroes=Array.isArray(heroesRaw)?heroesRaw:Object.values(heroesRaw||{});
 const links=parseGuideIndex(indexHtml,heroes);
 if(links.length<80)throw new Error("StatsDota guide index yielded only "+links.length+" hero links; refusing to replace snapshot.");
 const selected=limit?links.slice(0,limit):links;
 const guides={},incomplete=[],errors=[];
 for(let i=0;i<selected.length;i++){
  const link=selected[i],url=BASE+"/"+link.slug;
  if(i>0)await sleep(1150);
  try{
   const html=await fetchText(url);
   const guide=parseGuidePage(html,link.hero,heroAbilities,url);
   if(guide&&guide.status==="ready")guides[link.hero.name]=guide;
   else incomplete.push({hero:link.hero.name,slug:link.slug,reason:guide?"no reliable skill sequence or main role":"missing guide section"});
   if((i+1)%20===0)console.log("Fetched "+(i+1)+"/"+selected.length+" · guides with skill order: "+Object.keys(guides).length);
  }catch(error){errors.push({hero:link.hero.name,error:String(error)});console.warn("Skipped "+link.hero.localized_name+": "+String(error))}
 }
 const count=Object.keys(guides).length,currentPatchGuideCount=Object.values(guides).filter(g=>g.patch===CURRENT_PATCH).length;
 const min=limit?1:60;
 if(currentPatchGuideCount<min)throw new Error("Only "+currentPatchGuideCount+" current "+CURRENT_PATCH+" skill guides were parsed; minimum is "+min+". Existing snapshot was not replaced.");
 const snapshot={schemaVersion:1,source:"StatsDota public hero guides",currentPatch:CURRENT_PATCH,fetchedAt:new Date().toISOString(),indexUrl:BASE,guideCount:count,currentPatchGuideCount,heroesListed:links.length,guides,incomplete,errors};
 fs.writeFileSync(output,JSON.stringify(snapshot,null,2)+"\n");
 console.log(JSON.stringify({output,heroesListed:links.length,selected:selected.length,guideCount:count,incomplete:incomplete.length,errors:errors.length,patches:[...new Set(Object.values(guides).map(x=>x.patch).filter(Boolean))]},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});
