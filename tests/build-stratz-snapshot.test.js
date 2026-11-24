"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {buildSnapshot}=require("../scripts/build-stratz-snapshot");
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"stratz-snapshot-"));
try{
 const base={hero:"Razor",heroId:15,position:"POSITION_1",source:"STRATZ",patch:"unverified",items:{starting:[{name:"Tango",matchCount:100}],early:[],core:[],late:[],situational:[],neutral:[]},skillBuild:[],talents:[]};
 fs.writeFileSync(path.join(dir,"razor-position_1-normalized.json"),JSON.stringify(base));
 fs.writeFileSync(path.join(dir,"razor-position_1.json"),JSON.stringify({heroInternalName:"npc_dota_hero_razor"}));
 const mid={...base,position:"POSITION_2",items:{...base.items,starting:[{name:"Bottle",matchCount:80}]}};
 fs.writeFileSync(path.join(dir,"razor-position_2-normalized.json"),JSON.stringify(mid));
 fs.writeFileSync(path.join(dir,"razor-position_2.json"),JSON.stringify({heroInternalName:"npc_dota_hero_razor"}));
 const snapshot=buildSnapshot(dir);
 assert.equal(snapshot.heroCount,1);
 assert.equal(snapshot.profileCount,2);
 assert.equal(snapshot.heroes.npc_dota_hero_razor.positions.Carry.items.starting[0].name,"Tango");
 assert.equal(snapshot.heroes.npc_dota_hero_razor.positions.Mid.items.starting[0].name,"Bottle");
 assert.equal(snapshot.heroes.npc_dota_hero_razor.positions.Offlane,undefined,"Missing positions must remain absent, not inherit another role.");
 console.log("STRATZ snapshot builder tests passed.");
}finally{fs.rmSync(dir,{recursive:true,force:true})}
