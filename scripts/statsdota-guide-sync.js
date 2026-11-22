"use strict";
function decodeHtml(value){
 return String(value||"").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;|&rsquo;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)));
}
function stripHtml(value){
 return decodeHtml(String(value||"").replace(/<script\b[\s\S]*?<\/script>/gi," ").replace(/<style\b[\s\S]*?<\/style>/gi," ").replace(/<[^>]*>/g," ")).replace(/\s+/g," ").trim();
}
function normalizeName(value){
 return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
}
function appRole(value){
 const role=String(value||"").trim().toLowerCase();
 if(role==="carry")return"Carry";
 if(role==="mid")return"Mid";
 if(role==="offlane")return"Offlane";
 if(role==="soft support")return"Support 4";
 if(role==="hard support"||role==="hard-support")return"Support 5";
 return null;
}
function parseGuideIndex(html,heroes){
 const byName=new Map((heroes||[]).map(h=>[normalizeName(h.localized_name),h]));
 const links=new Map(),re=/<a\b[^>]*href=["'](?:https?:\/\/(?:www\.)?statsdota\.com)?\/en\/guides\/([^"'?#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
 for(const match of String(html||"").matchAll(re)){
  const slug=match[1],title=stripHtml(match[2]);
  const hero=byName.get(normalizeName(title));
  if(hero&&!links.has(hero.name))links.set(hero.name,{hero,slug,title});
 }
 return [...links.values()];
}
function parseGuidePage(html,hero,heroAbilities,sourceUrl){
 const source=String(html||""),lower=source.toLowerCase(),start=lower.indexOf("skill order");
 if(start<0)return null;
 const end=lower.indexOf("frequently asked questions",start),section=source.slice(start,end>start?end:start+18000);
 const slots=heroAbilities&&heroAbilities[hero.name]&&heroAbilities[hero.name].abilities||[];
 const known=new Set(slots);
 const abilityOrder=[...section.matchAll(/alt=["']([^"']+)["']/gi)].map(m=>decodeHtml(m[1])).filter(name=>known.has(name));
 const plain=stripHtml(source);
 const name=hero.localized_name;
 const positionsStart=plain.toLowerCase().indexOf("positions"),positionsText=positionsStart>=0?plain.slice(positionsStart,positionsStart+260):"";
 const positionCounts=[...positionsText.matchAll(/(Carry|Mid|Offlane|Soft Support|Hard Support|Support)\\s+(\\d+)\\s+games/gi)].map(m=>({label:m[1],role:appRole(m[1]),games:Number(m[2])})).sort((a,b)=>b.games-a.games);
 let role=positionCounts[0]?.role||null,roleGames=positionCounts[0]?.games||0;
 if(!role){
  const phrase=name+" is played",i=plain.toLowerCase().indexOf(phrase.toLowerCase()),roleText=i>=0?plain.slice(i+phrase.length,i+phrase.length+100):"";
  const roleMatch=roleText.match(/^\\s+(?:in|as)\\s+(Carry|Mid|Offlane|Soft Support|Support|Hard Support)/i);
  role=roleMatch?appRole(roleMatch[1]):null;
 }
 const sample=plain.match(/Based on\s+(\d+)\s+winning matches/i);
 const patchMatch=plain.match(/How to play[^\n]{0,160}?guide\s+([0-9]+(?:\.[0-9]+)?[a-z]?)/i)||plain.match(/guide\s+([0-9]+(?:\.[0-9]+)?[a-z]?)/i);
 const updatedMatch=plain.match(/updated\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
 const updatedAt=updatedMatch?new Date(updatedMatch[1]).toISOString():null;
 return{hero:hero.name,heroName:name,role,roleGames,positionCounts,patch:patchMatch?patchMatch[1]:null,matches:sample?Number(sample[1]):0,updatedAt,abilityOrder,sourceUrl,rankScope:"Immortal / profesionales",status:abilityOrder.length>=6&&role&&roleGames>=10?"ready":"incomplete"};
}
module.exports={decodeHtml,stripHtml,normalizeName,appRole,parseGuideIndex,parseGuidePage};
