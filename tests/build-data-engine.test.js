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
  if(url.endsWith("/constants/hero_abilities"))return{ok:true,json:async()=>({"npc_dota_hero_axe":{abilities:["axe_berserkers_call","axe_battle_hunger","axe_counter_helix","generic_hidden","generic_hidden","axe_culling_blade"],talents:[]}})};
  if(url.includes("/hero/2/builds?position=pos%203"))return{ok:true,json:async()=>[{hero_id:2,position:"pos 3",num_matches:120,num_wins:66,win_rate:.55,updated_at:"2026-11-21T08:00:00Z",build_data:{
   anchor_items:[{raw_item_id:2,avg_minute:6.5,rel_pr:.9,rel_count:110},{raw_item_id:1,avg_minute:15.2,rel_pr:.7,rel_count:84}],
   abilities:[{ability_id:10,name:"axe_berserkers_call"},{ability_id:11,name:"axe_battle_hunger"},{ability_id:12,name:"axe_counter_helix"},{ability_id:13,name:"axe_culling_blade"}],
   abilities_new:[[[10,11,12,12,12,13,12,10,10,10],{pr:.62,win_rate:.57,count:74}],[[10,11,10,12,12,13,12,12,10,10],{pr:.18,win_rate:.55,count:22}]],
   talents:[
    {lvl:10,choice:"rt",left:{name:"special_bonus_axe_left",displayName:"+8 Strength",pick_rate:.35,win_rate:.52},right:{name:"special_bonus_axe_right",displayName:"+8% Culling Blade Move Speed",pick_rate:.65,win_rate:.58}},
    {lvl:15,choice:"lt",left:{name:"special_bonus_axe_left15",displayName:"+20 Attack Speed",pick_rate:.7,win_rate:.56},right:{name:"special_bonus_axe_right15",displayName:"+8 Armor",pick_rate:.3,win_rate:.51}},
    {lvl:20,choice:"rt",left:{name:"special_bonus_axe_left20",displayName:"+100 Berserker's Call AoE",pick_rate:.4,win_rate:.54},right:{name:"special_bonus_axe_right20",displayName:"+30 Counter Helix Damage",pick_rate:.6,win_rate:.57}},
    {lvl:25,choice:"lt",left:{name:"special_bonus_axe_left25",displayName:"+100 Culling Blade Damage",pick_rate:.55,win_rate:.56},right:{name:"special_bonus_axe_right25",displayName:"+1.5s Call Duration",pick_rate:.45,win_rate:.55}}
   ]
  }}]};
  throw new Error("Unexpected URL "+url);
 };
 const live=await engine.loadHeroBuild({heroId:2,heroName:"Axe",heroKey:"npc_dota_hero_axe",role:"Offlane",patch:"7.42",patchReleaseDate:"2026-11-18",fetch:d2pt,storage});
 assert.equal(live.source,"Dota2ProTracker");
 assert.equal(live.scope,"posición");
 assert.equal(live.matches,120);
 assert.equal(live.quality,"alta");
 assert.deepEqual(live.items.map(x=>x.name),["Phase Boots","Blink Dagger"]);
 assert.equal(live.plan.early[0][0],"Phase Boots");
 assert.equal(live.plan.core[0][0],"Blink Dagger");
 assert.ok(live.guide,"D2PT debe generar guía de habilidades y talentos");
 assert.deepEqual(live.guide.skillBuild.filter(x=>x.level<=11).map(x=>x.code),["Q","W","E","E","E","R","E","Q","Q","Q"]);
 assert.equal(live.guide.skillBuild.find(x=>x.level===12).code,"R");
 assert.equal(live.guide.skillBuild.find(x=>x.level===18).code,"R");
 assert.deepEqual(live.guide.talentChoices.map(x=>x.level),[10,15,20,25]);
 assert.equal(live.guide.talentChoices[0].chosen,"right");
 assert.ok(live.guide.talentChoices[0].right.reason.includes("65%"));
 assert.equal(live.guide.metadata.matches,120);
 assert.equal(live.guide.metadata.patch,"7.42");
 assert.equal(live.guide.skillIcons.Q.slug,"axe_berserkers_call");
 assert.equal(live.guide.skillIcons.R.slug,"axe_culling_blade");
 assert.ok(live.guide.skillBuild.some(x=>x.level===17&&x.code==="A"));
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
 assert.deepEqual(actualOpen.items.map(x=>x.stage),["Inicio","Línea","Línea","Core","Avanzada"]);

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
