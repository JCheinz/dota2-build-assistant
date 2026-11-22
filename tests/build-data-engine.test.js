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
 // Formato real actual de OpenDota: fases *_items y claves numéricas de item_id.
 engine.clear();
 const actualShapeStorage=(()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}})();
 const actualShape=async url=>{
  if(url.endsWith("/constants/items"))return{ok:true,json:async()=>items};
  if(url.includes("/hero/2/builds?"))return{ok:false,status:403};
  if(url.endsWith("/heroes/2/itemPopularity"))return{ok:true,json:async()=>({
   start_game_items:{"3":18},
   early_game_items:{"2":72,"3":44},
   mid_game_items:{"1":61},
   late_game_items:{"1":25}
  })};
  throw new Error("Unexpected URL "+url);
 };
 const actualOpen=await engine.loadHeroBuild({heroId:2,heroName:"Axe",role:"Offlane",patch:"7.42",fetch:actualShape,storage:actualShapeStorage});
 assert.equal(actualOpen.source,"OpenDota");
 assert.deepEqual(actualOpen.items.map(x=>x.name),["Magic Wand","Phase Boots","Magic Wand","Blink Dagger","Blink Dagger"]);
 assert.deepEqual(actualOpen.items.map(x=>x.stage),["Inicio","Línea","Línea","Core"]);

 engine.clear();
 const staleStorage=(()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}})();
 const stale=async url=>{
  if(url.endsWith("/constants/items"))return{ok:true,json:async()=>items};
  if(url.includes("/hero/2/builds?"))return{ok:true,json:async()=>[{num_matches:150,updated_at:"2026-11-17T23:59:00Z",build_data:{anchor_items:[{raw_item_id:2,avg_minute:6,rel_pr:.8,rel_count:100}]}}]};
  if(url.endsWith("/heroes/2/itemPopularity"))return{ok:true,json:async()=>({early_game:{phase_boots:20}})};
  throw new Error("Unexpected URL "+url);
 };
 const staleResult=await engine.loadHeroBuild({heroId:2,heroName:"Axe",role:"Offlane",patch:"7.42",patchReleaseDate:"2026-11-18",fetch:stale,storage:staleStorage});
 assert.equal(staleResult.source,"OpenDota","Una build con datos anteriores al lanzamiento 7.42 no debe reemplazar la ruta actual.");
 console.log("Build data engine: D2PT role build, patch timestamp gate, sample validation, cache and OpenDota fallback passed.");
})().catch(error=>{console.error(error);process.exitCode=1});
