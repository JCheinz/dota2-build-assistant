(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 if(root)root.DOTA_INVENTORY_LEDGER=api;
})(typeof globalThis!=="undefined"?globalThis:null,function(){
 const CONSUMABLES=new Set(["Tango","Healing Salve","Clarity","Enchanted Mango","Faerie Fire","Blood Grenade","Smoke of Deceit","Sentry Ward","Observer Ward","Dust of Appearance","Infused Raindrops","Town Portal Scroll"]);
 const cleanName=value=>String(value||"").trim();
 const keyOf=value=>cleanName(value).toLocaleLowerCase("en");
 function create(options={}){
  const storageKey=options.storageKey||"dota2-build-inventory-ledger-v352";
  const storage=options.storage||null;
  let state={inventory:[],components:[],history:[],sequence:0};
  const clone=()=>JSON.parse(JSON.stringify(state));
  const persist=()=>{try{if(storage&&typeof storage.setItem==="function")storage.setItem(storageKey,JSON.stringify(state));}catch(_){}};
  try{const raw=storage&&storage.getItem&&storage.getItem(storageKey);if(raw){const parsed=JSON.parse(raw);if(parsed&&Array.isArray(parsed.inventory)&&Array.isArray(parsed.history)){state={inventory:parsed.inventory.map(item=>({...item,placement:item.placement==="manual"?"manual":"auto",zone:item.placement==="manual"&&["main","backpack","reserve"].includes(item.zone)?item.zone:"auto"})),components:Array.isArray(parsed.components)?parsed.components:[],history:parsed.history,sequence:Number(parsed.sequence)||0};
   // Migración transparente: las versiones anteriores guardaban las piezas
   // solo en el seguimiento de recetas, no como objetos que ocupan un slot.
   const trackedComponents=new Map();for(const component of state.components){const name=cleanName(component.name);if(name)trackedComponents.set(keyOf(name),{name,quantity:(trackedComponents.get(keyOf(name))?.quantity||0)+Math.max(1,Number(component.quantity)||1)});}
   for(const component of trackedComponents.values()){const present=state.inventory.filter(item=>item.kind==="component"&&keyOf(item.name)===keyOf(component.name)).length;for(let i=present;i<component.quantity;i++)state.inventory.push({name:component.name,quantity:1,kind:"component",zone:"auto",placement:"auto",purchaseMinute:null});}
  }}}catch(_){}
  const event=(action,name,meta={})=>({id:++state.sequence,action,name,minute:Number.isFinite(Number(meta.minute))?Math.max(0,Number(meta.minute)):null,kind:meta.kind||"item",quantity:Math.max(1,Number(meta.quantity)||1),at:meta.at||new Date().toISOString(),note:meta.note||""});
  const find=(list,name)=>list.find(x=>keyOf(x.name)===keyOf(name));
  function recordPurchase(name,meta={}){
   name=cleanName(name);if(!name)return {recorded:false,reason:"invalid"};
   const existing=find(state.inventory,name);
   if(existing){existing.quantity=Math.max(existing.quantity||1,Number(meta.quantity)||1);persist();return {recorded:false,reason:"already-owned",item:{...existing}};}
   const item={name,quantity:Math.max(1,Number(meta.quantity)||1),kind:meta.kind||(CONSUMABLES.has(name)?"consumable":"item"),zone:meta.placement==="manual"&&["main","backpack","reserve"].includes(meta.zone)?meta.zone:"auto",placement:meta.placement==="manual"?"manual":"auto",purchaseMinute:Number.isFinite(Number(meta.minute))?Math.max(0,Number(meta.minute)):null};
   state.inventory.push(item);state.history.unshift(event("purchase",name,{...meta,kind:item.kind}));
   persist();return {recorded:true,item:{...item}};
  }
  function recordComponent(name,meta={}){
   name=cleanName(name);if(!name)return {recorded:false};
   const minute=Number.isFinite(Number(meta.minute))?Math.max(0,Number(meta.minute)):null;
   state.components.push({name,quantity:1});
   // Una pieza de receta también es un objeto físico: debe ocupar un espacio
   // del inventario y poder rotar igual que cualquier otro objeto comprado.
   state.inventory.push({name,quantity:1,kind:"component",zone:"auto",placement:"auto",purchaseMinute:minute});
   state.history.unshift(event("component-purchase",name,{...meta,kind:"component"}));persist();return {recorded:true};
  }
  function removeInventory(name,reason="removed",meta={}){
   let i=state.inventory.findIndex(x=>keyOf(x.name)===keyOf(name)&&(reason!=="component-consumed"||x.kind==="component"));
   if(i<0&&reason==="component-consumed")i=state.inventory.findIndex(x=>keyOf(x.name)===keyOf(name));
   if(i<0)return {removed:false};
   const [item]=state.inventory.splice(i,1);state.history.unshift(event(reason,item.name,{...meta,kind:item.kind,quantity:item.quantity}));persist();return {removed:true,item:{...item}};
  }
  function useConsumable(name,meta={}){
   const item=find(state.inventory,name);if(!item||item.kind!=="consumable")return {used:false,reason:"not-active-consumable"};
   const result=removeInventory(name,"consumable-used",meta);return {used:result.removed,item:result.item};
  }
  function upgrade(finalName,consumedNames=[],meta={}){
   const consumed=[];
   for(const name of consumedNames){const item=removeInventory(name,"component-consumed",{...meta,note:"Consumido para "+finalName});if(item.removed){removeComponent(name,{silent:true});consumed.push(name);continue;}if(removeComponent(name,{silent:true})){consumed.push(name);state.history.unshift(event("component-consumed",name,{...meta,kind:"component",note:"Consumido para "+finalName}));}}
   const added=recordPurchase(finalName,{...meta,kind:"item",note:"Mejora completada"});
   state.history.unshift(event("upgrade",finalName,{...meta,note:"Componentes consumidos: "+consumed.join(", ")}));persist();
   return {upgraded:true,consumed,added:added.recorded};
  }
  function recordSale(name,meta={}){
   const result=removeInventory(name,"sold",meta);
   if(result.removed&&result.item.kind==="component")removeComponent(name,{silent:true});
   return result;
  }
  function setZone(name,zone){const item=find(state.inventory,name);if(!item||!["main","backpack","reserve"].includes(zone))return false;item.zone=zone;item.placement="manual";persist();return true;}
  function setAutomatic(name){const item=find(state.inventory,name);if(!item)return false;item.zone="auto";item.placement="auto";persist();return true;}
  function removeComponent(name,meta={}){
   const i=state.components.findIndex(x=>keyOf(x.name)===keyOf(name));if(i<0)return false;
   const [item]=state.components.splice(i,1);
   if(!meta.silent){
    const physical=state.inventory.findIndex(x=>keyOf(x.name)===keyOf(name)&&x.kind==="component");
    if(physical>=0)state.inventory.splice(physical,1);
    state.history.unshift(event("component-removed",item.name,{...meta,kind:"component"}));
   }
   persist();return true;
  }
  function clearInventory(){state.inventory=[];state.components=[];persist();}
  function clearHistory(){state.history=[];persist();}
  function reset(){state={inventory:[],components:[],history:[],sequence:0};persist();}
  function addComponents(names,meta={}){for(const name of names||[])recordComponent(name,meta);}
  function snapshot(){return clone();}
  function arrange(inventory,options={}){
   const minute=Math.max(0,Number(options.minute)||0),key=name=>keyOf(name);
   const priorityRank=new Map((options.priorityNames||[]).map((name,index)=>[key(name),index]));
   const core=new Set((options.coreNames||[]).map(key)),components=new Set((options.componentNames||[]).map(key));
   const early=new Set((options.earlyNames||[]).map(key)),tactical=new Set((options.tacticalNames||[]).map(key));
   const sellCandidates=new Set((options.reserveNames||[]).map(key));
   const manual={main:[],backpack:[],reserve:[]},automatic=[],automaticReserve=[];
   (inventory||[]).forEach((item,index)=>{
    const zone=item&&item.placement==="manual"&&["main","backpack","reserve"].includes(item.zone)?item.zone:null;
    if(zone)manual[zone].push({...item,_index:index});
    else if(sellCandidates.has(key(item.name))&&!priorityRank.has(key(item.name))&&!core.has(key(item.name))&&!tactical.has(key(item.name)))automaticReserve.push({...item,_index:index});
    else automatic.push({...item,_index:index});
   });
   const score=item=>{
    const name=key(item.name),rank=priorityRank.get(name);
    let value=rank!==undefined?10000-rank*100:0;
    if(core.has(name)&&rank===undefined)value+=350;
    if(components.has(name)&&rank===undefined)value+=500;
    if(tactical.has(name)&&rank===undefined)value+=250;
    if(early.has(name)&&minute>=12)value-=650;
    if(CONSUMABLES.has(item.name)){
     value+=minute<5?120:-850;
     if(tactical.has(name))value+=1000;
    }
    if(item.purchaseMinute!=null)value+=Math.min(30,Math.max(0,Number(item.purchaseMinute)||0))*0.2;
    return value;
   };
   automatic.sort((a,b)=>score(b)-score(a)||a._index-b._index);
   const result={main:manual.main.slice(0,6),backpack:manual.backpack.slice(0,3),reserve:[...manual.reserve,...automaticReserve]};
   const overflow=[...manual.main.slice(6),...manual.backpack.slice(3),...automatic];
   for(const item of overflow){
    if(result.main.length<6)result.main.push(item);
    else if(result.backpack.length<3)result.backpack.push(item);
    else result.reserve.push(item);
   }
   for(const zone of ["main","backpack","reserve"])result[zone]=result[zone].map(({_index,...item})=>item);
   return result;
  }
  function filterRecommendations(items,ownedNames=[]){
   const owned=new Set(ownedNames.map(keyOf));const seen=new Set();
   return (items||[]).filter(item=>{const name=cleanName(typeof item==="string"?item:Array.isArray(item)?item[0]:item&&item.name);if(!name)return false;const key=keyOf(name);if(owned.has(key)||seen.has(key))return false;seen.add(key);return true;});
  }
  return {recordPurchase,recordComponent,removeInventory,useConsumable,upgrade,recordSale,setZone,setAutomatic,removeComponent,clearInventory,clearHistory,reset,addComponents,snapshot,arrange,filterRecommendations,isConsumable:name=>CONSUMABLES.has(cleanName(name))};
 }
 return {create,isConsumable:name=>CONSUMABLES.has(cleanName(name))};
});
