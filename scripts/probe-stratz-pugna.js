"use strict";
const fs=require("node:fs"); const path=require("node:path"); const {createClient}=require("./stratz-api-client");
const schemaPath=path.resolve("data/stratz-schema-audit.json");
// Query without week, rank or role filters first to test STRATZ aggregate defaults.
const targets=[
 {name:"itemStartingPurchase",alias:"startingItems",fields:["itemId","matchCount","winCount","winsAverage","wasGiven"]},
 {name:"itemFullPurchase",alias:"purchasedItems",fields:["itemId","matchCount","winCount","winsAverage","time","position"]},
 {name:"itemBootPurchase",alias:"boots",fields:["itemId","matchCount","winCount","winAverage","timeAverage"]},
 {name:"itemNeutral",alias:"neutralItems",fields:["itemId","matchCount","winCount","equippedMatchCount","equippedMatchWinCount"]},
 {name:"talent",alias:"talents",fields:["abilityId","matchCount","winCount","time","winsAverage","timeAverage"]},
 {name:"abilityMinLevel",alias:"abilityMinLevel",fields:["abilityId","level","matchCount","winCount"]},
 {name:"abilityMaxLevel",alias:"abilityMaxLevel",fields:["abilityId","level","matchCount","winCount"]}
];
async function main(){
 if(!fs.existsSync(schemaPath)) throw new Error("Falta auditoría de esquema.");
 const schema=JSON.parse(fs.readFileSync(schemaPath,"utf8")); const heroId=45; const selections=[]; const included=[];
 for(const target of targets){const field=schema.candidates.find(x=>x.name===target.name); if(!field) continue;
  const heroArg=field.args.find(a=>a.name==="heroId"); if(!heroArg) continue;
  const available=target.fields.filter(name=>field.fields.some(x=>(typeof x==="string"?x:x.name)===name));
  if(!available.length) continue;
  const args=heroArg.required?`(heroId:$heroId)`:`(heroId:$heroId)`;
  selections.push(`${target.alias}:${target.name}${args}{${available.join(" ")}}`); included.push({field:target.name,alias:target.alias,selected:available});
 }
 if(!selections.length) throw new Error("El esquema no ofrece campos consultables para Pugna.");
 const heroArgType=schema.candidates.find(x=>x.name===included[0].field).args.find(a=>a.name==="heroId").type.replace(/!$/,"");
 const query=`query PugnaBuildAudit($heroId:${heroArgType}!){heroStats{${selections.join("\n")}}}`;
 const response=await createClient().graphql(query,{heroId}); const stats=response.heroStats;
 const output={hero:"Pugna",heroId,source:"STRATZ GraphQL",queriedAt:new Date().toISOString(),schemaAudit:schema.inspectedAt,queryPlan:included,data:stats,hasAnyData:!!stats&&Object.values(stats).some(v=>Array.isArray(v)?v.length>0:v!=null)};
 fs.mkdirSync(path.resolve("data"),{recursive:true}); fs.writeFileSync(path.resolve("data/stratz-pugna-probe.json"),JSON.stringify(output,null,2)+"\n"); console.log(JSON.stringify(output,null,2));
 if(!output.hasAnyData) console.warn("STRATZ respondió sin datos para heroId 45 con los filtros predeterminados; no se fabricaron recomendaciones.");
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
