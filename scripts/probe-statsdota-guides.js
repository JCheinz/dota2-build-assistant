"use strict";
const urls=[
 "https://statsdota.com/en/guides/centaur-warrunner",
 "https://statsdota.com/en/guides/enigma",
 "https://statsdota.com/en/guides/pugna"
];
(async()=>{
 for(const url of urls){
  try{
   const response=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0 Dota2BuildAssistant guide audit","Accept":"text/html"}});
   const html=await response.text();
   const start=html.toLowerCase().indexOf("skill order");
   const end=html.toLowerCase().indexOf("frequently asked questions",Math.max(0,start));
   const section=start>=0?html.slice(start,end>start?end:start+12000):"";
   const alts=[...section.matchAll(/alt=["']([^"']+)["']/gi)].map(m=>m[1]).filter(x=>/^[a-z0-9_]+$/i.test(x));
   const srcs=[...section.matchAll(/(?:src|data-src)=["'][^"']*\/([a-z0-9_]+)\.png/gi)].map(m=>m[1]);
   console.log(JSON.stringify({url,status:response.status,bytes:html.length,skillSectionFound:start>=0,sectionBytes:section.length,altAbilities:alts.slice(0,20),srcAbilities:srcs.slice(0,20),containsCentaur:html.includes("centaur_hoof_stomp"),containsEnigma:html.includes("enigma_demonic_conversion")}));
  }catch(error){console.log(JSON.stringify({url,error:String(error)}))}
 }
})().catch(error=>{console.error(error);process.exitCode=1});
