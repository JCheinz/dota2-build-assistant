"use strict";
const assert=require("node:assert/strict");
const engine=require("../build-data-engine.js");
const items={blink:{id:1,dname:"Blink Dagger",cost:2250},phase_boots:{id:2,dname:"Phase Boots",cost:1500},magic_wand:{id:3,dname:"Magic Wand",cost:450}};
const storage=(()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}})();
(async()=>{
 engine.clear();
 const calls=[];
 const d2pt=async url=>{
  calls.push(url);
  if(url.endsWith("/constants/items"))return{ok:true,json:async()=>items};
  if(url.includes("/hero/2/builds?position=pos%203"))return{ok:true,json:async()=>[{hero_id:2,position:"pos 3",num_matches:120,num_wins:66,win_rate:.55,updated_at:"2026-11-21T08:00:00Z",build_data:{anchor_items:[{raw_item_id:2,avg_minute:6.5,rel_pr:.9,rel_count:110},{raw_item_id:1,avg_minute:15.2,rel_pr:.7,rel_count:84}]}}]};
  throw new Error("Unexpected URL "+url);
 };
 const live=await engine.loadHeroBuild({heroId:2,heroName:"Axe",role:"Offlane",patch:"7.42",patchReleaseDate:"2026-11-18",fetch:d2pt,storage});
 assert.equal(live.source,"Dota2ProTracker");
 assert.equal(live.scope,"posición");
 assert.equal(live.matches,120);
 assert.equal(live.quality,"alta");
 assert.deepEqual(live.items.map(x=>x.name),["Phase Boots","Blink Dagger"]);
 assert.equal(live.plan.early[0][0],"Phase Boots");
 assert.equal(live.plan.core[0][0],"Blink Dagger");
 const cached=await engine.loadHeroBuild({heroId:2,heroName:"Axe",role:"Offlane",patch:"7.42",patchReleaseDate:"2026-11-18",fetch:async()=>{throw new Error("Should use cache")},storage});
 assert.equal(cached.cached,true);
 engine.clear();
 const fallbackStorage=(()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}})();
 const fallback=async url=>{
  if(url.endsWith("/constants/items"))return{ok:true,json:async()=>items};
  if(url.includes("/hero/2/builds?"))return{ok:false,status:403};
  if(url.endsWith("/heroes/2/itemPopularity"))return{ok:true,json:async()=>({early_game:{phase_boots:70,magic_wand:40},mid_game:{blink:55}})};
  throw new Error("Unexpected URL "+url);
 };
 const open=await engine.loadHeroBuild({heroId:2,heroName:"Axe",role:"Offlane",patch:"7.42",fetch:fallback,storage:fallbackStorage});
 assert.equal(open.source,"OpenDota");
 assert.equal(open.scope,"todas las posiciones");
 assert.ok(open.warning.includes("no separa por posición"));
 assert.deepEqual(open.items.map(x=>x.name),["Phase Boots","Magic Wand","Blink Dagger"]);
 console.log("Build data engine: Dota2ProTracker role build, current patch gate, cache and OpenDota fallback passed.");
})().catch(error=>{console.error(error);process.exitCode=1});
