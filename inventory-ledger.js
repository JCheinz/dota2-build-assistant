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
  try{const raw=storage&&storage.getItem&&storage.getItem(storageKey);if(raw){const parsed=JSON.parse(raw);if(parsed&&Array.isArray(parsed.inventory)&&Array.isArray(parsed.history))state={inventory:parsed.inventory,components:Array.isArray(parsed.components)?parsed.components:[],history:parsed.history,sequence:Number(parsed.sequence)||0};}}catch(_){}
  const event=(action,name,meta={})=>({id:++state.sequence,action,name,minute:Number.isFinite(Number(meta.minute))?Math.max(0,Number(meta.minute)):null,kind:meta.kind||"item",quantity:Math.max(1,Number(meta.quantity)||1),at:meta.at||new Date().toISOString(),note:meta.note||""});
  const find=(list,name)=>list.find(x=>keyOf(x.name)===keyOf(name));
  function recordPurchase(name,meta={}){
   name=cleanName(name);if(!name)return {recorded:false,reason:"invalid"};
   const existing=find(state.inventory,name);
   if(existing){existing.quantity=Math.max(existing.quantity||1,Number(meta.quantity)||1);persist();return {recorded:false,reason:"already-owned",item:{...existing}};}
   const item={name,quantity:Math.max(1,Number(meta.quantity)||1),kind:meta.kind||(CONSUMABLES.has(name)?"consumable":"item"),zone:meta.zone||"main"};
   state.inventory.push(item);state.history.unshift(event("purchase",name,{...meta,kind:item.kind}));
   persist();return {recorded:true,item:{...item}};
  }
  function recordComponent(name,meta={}){
   name=cleanName(name);if(!name)return {recorded:false};
   state.components.push({name,quantity:1});
   state.history.unshift(event("component-purchase",name,{...meta,kind:"component"}));persist();return {recorded:true};
  }
  function removeInventory(name,reason="removed",meta={}){
   const i=state.inventory.findIndex(x=>keyOf(x.name)===keyOf(name));if(i<0)return {removed:false};
   const [item]=state.inventory.splice(i,1);state.history.unshift(event(reason,item.name,{...meta,kind:item.kind,quantity:item.quantity}));persist();return {removed:true,item:{...item}};
  }
  function useConsumable(name,meta={}){
   const item=find(state.inventory,name);if(!item||item.kind!=="consumable")return {used:false,reason:"not-active-consumable"};
   const result=removeInventory(name,"consumable-used",meta);return {used:result.removed,item:result.item};
  }
  function upgrade(finalName,consumedNames=[],meta={}){
   const consumed=[];
   for(const name of consumedNames){const item=removeInventory(name,"component-consumed",{...meta,note:"Consumido para "+finalName});if(item.removed){consumed.push(name);continue;}if(removeComponent(name,{silent:true})){consumed.push(name);state.history.unshift(event("component-consumed",name,{...meta,kind:"component",note:"Consumido para "+finalName}));}}
   const added=recordPurchase(finalName,{...meta,kind:"item",note:"Mejora completada"});
   state.history.unshift(event("upgrade",finalName,{...meta,note:"Componentes consumidos: "+consumed.join(", ")}));persist();
   return {upgraded:true,consumed,added:added.recorded};
  }
  function recordSale(name,meta={}){return removeInventory(name,"sold",meta);}
  function removeComponent(name,meta={}){const i=state.components.findIndex(x=>keyOf(x.name)===keyOf(name));if(i<0)return false;const [item]=state.components.splice(i,1);if(!meta.silent)state.history.unshift(event("component-removed",item.name,{...meta,kind:"component"}));persist();return true;}
  function clearInventory(){state.inventory=[];state.components=[];persist();}
  function clearHistory(){state.history=[];persist();}
  function reset(){state={inventory:[],components:[],history:[],sequence:0};persist();}
  function addComponents(names,meta={}){for(const name of names||[])recordComponent(name,meta);}
  function snapshot(){return clone();}
  function filterRecommendations(items,ownedNames=[]){
   const owned=new Set(ownedNames.map(keyOf));const seen=new Set();
   return (items||[]).filter(item=>{const name=cleanName(typeof item==="string"?item:Array.isArray(item)?item[0]:item&&item.name);if(!name)return false;const key=keyOf(name);if(owned.has(key)||seen.has(key))return false;seen.add(key);return true;});
  }
  return {recordPurchase,recordComponent,removeInventory,useConsumable,upgrade,recordSale,removeComponent,clearInventory,clearHistory,reset,addComponents,snapshot,filterRecommendations,isConsumable:name=>CONSUMABLES.has(cleanName(name))};
 }
 return {create,isConsumable:name=>CONSUMABLES.has(cleanName(name))};
});
