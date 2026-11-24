"use strict";
const fs=require("node:fs");
const path=require("node:path");
const POSITION_ROLE={position_1:"Carry",position_2:"Mid",position_3:"Offlane",position_4:"Support 4",position_5:"Support 5"};
function arg(name,fallback){const prefix="--"+name+"=";const found=process.argv.find(x=>x.startsWith(prefix));return found?found.slice(prefix.length):fallback}
function buildSnapshot(inputDir){
 const heroes={};
 for(const file of fs.readdirSync(inputDir).filter(name=>name.endsWith("-normalized.json")).sort()){
  const full=path.join(inputDir,file);
  let row;try{row=JSON.parse(fs.readFileSync(full,"utf8"))}catch(error){throw new Error("JSON inválido en "+file+": "+error.message)}
  const role=POSITION_ROLE[String(row.position||"").toLowerCase()];
  if(!role||!row.hero||!row.heroId||!row.items||typeof row.items!=="object")continue;
  if(row.position!==("POSITION_"+Object.keys(POSITION_ROLE).find(k=>POSITION_ROLE[k]===role).split("_")[1]))continue;
  const rawPath=full.replace(/-normalized\\.json$/,".json");let rawMeta={};if(fs.existsSync(rawPath)){try{rawMeta=JSON.parse(fs.readFileSync(rawPath,"utf8"))}catch{rawMeta={}}}const key=rawMeta.heroInternalName||row.heroInternalName||("hero_id_"+Number(row.heroId));
  if(!heroes[key])heroes[key]={id:Number(row.heroId),name:row.hero,positions:{}};
  // One exact role per normalized file. Never infer missing positions from another role.
  heroes[key].positions[role]={...row,role,source:row.source||"STRATZ",patch:row.patch||"unverified"};
 }
 const entries=Object.values(heroes);
 return{schemaVersion:1,source:"STRATZ GraphQL normalized position audit",generatedAt:new Date().toISOString(),patchScope:"unverified",heroCount:entries.length,profileCount:entries.reduce((n,h)=>n+Object.keys(h.positions).length,0),roles:Object.values(POSITION_ROLE),heroes};
}
if(require.main===module){
 const input=path.resolve(arg("input","data/stratz-batch")),output=path.resolve(arg("output","stratz-hero-positions.json"));
 if(!fs.existsSync(input))throw new Error("No existe la carpeta de auditoría: "+input);
 const snapshot=buildSnapshot(input);
 fs.writeFileSync(output,JSON.stringify(snapshot,null,2)+"\n");
 console.log("Snapshot STRATZ: "+snapshot.heroCount+" héroes · "+snapshot.profileCount+" perfiles por posición · "+output);
}
module.exports={POSITION_ROLE,buildSnapshot};
