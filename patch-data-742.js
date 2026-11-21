(function(){
 "use strict";
 const removedItems=new Set(["Javelin","Helm of the Overlord","Khanda"]);
 const itemChanges={
  "Quarterstaff":{status:"returned",cost:900,components:[],stats:"+10 daño · +10 velocidad de ataque"},
  "Bloodslinger":{status:"new",cost:925,components:["Sage's Mask","Mantle of Intelligence ×2","Blood Grenade","Receta"],stats:"+100 vida · +8 inteligencia · +1.25 regeneración de maná"},
  "Caduceus":{status:"new",cost:5400,components:["Force Staff","Phylactery","Receta"],stats:"+8 fuerza · +8 agilidad · +20 inteligencia · +175 vida · +6 regeneración de vida · +3 regeneración de maná"},
  "Ristul's Devotion":{status:"new",cost:3800,components:["Vladmir's Offering","Splintmail","Voodoo Mask"],stats:"+8 armadura · +1 regeneración de maná"},
  "Sabatons of Mordiggian":{status:"new",cost:5950,components:["Phase Boots","Armlet of Mordiggian","Receta"],stats:"+45/55 velocidad de movimiento · +40 daño · +30 velocidad de ataque · +10 armadura · +5 regeneración de vida"},
  "Skypiercer":{status:"new",cost:6000,components:["Heaven's Halberd","Sange","Talisman of Evasion","Receta"],stats:"+35 fuerza · +5 armadura · +5 regeneración de vida · +25% resistencia a ralentización · +20% restauración de vida · +25% evasión"},
  "Starforge":{status:"new",cost:6000,components:["Meteor Hammer","Ultimate Orb","Receta"],stats:"+24 fuerza · +24 agilidad · +40 inteligencia · +6% amplificación de hechizos · +20% amplificación de regeneración de maná"}
 };
 const recipeOverrides={
  "Maelstrom":[{name:"Mithril Hammer",cost:1600},{name:"Receta de Maelstrom",cost:900},{name:"Gloves of Haste",cost:450}],
  "Monkey King Bar":[{name:"Demon Edge",cost:2200},{name:"Blitz Knuckles",cost:1000},{name:"Quarterstaff",cost:900},{name:"Receta de Monkey King Bar",cost:900}]
 };
 function applyRecipeCompatibility(recipes){for(const [name,parts] of Object.entries(recipeOverrides))recipes[name]=parts.map(x=>({...x}));return recipes;}
 window.DOTA_PATCH_742={patch:"7.42",releaseDate:"2026-11-18",removedItems,itemChanges,applyRecipeCompatibility,isCurrent:true};
})();