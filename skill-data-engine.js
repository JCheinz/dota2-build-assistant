(function(root){"use strict";
const DEFAULT_BASE="https://api.opendota.com/api",STATIC_BASE="https://raw.githubusercontent.com/odota/dotaconstants/master/build",ENDPOINTS={abilities:"/constants/abilities",heroAbilities:"/constants/hero_abilities",heroes:"/constants/heroes"},STATIC_FILES={abilities:"/abilities.json",heroAbilities:"/hero_abilities.json",heroes:"/heroes.json"},memoryCache=new Map();
function firstDefined(o,keys){for(const k of keys)if(o&&o[k]!==undefined&&o[k]!==null)return o[k];return null}
function asArray(v){return Array.isArray(v)?v:v==null?[]:[v]}
function parseLevelValues(v){if(v==null||v==="")return[];if(Array.isArray(v))return v.flatMap(parseLevelValues);if(typeof v==="number")return[v];return String(v).split("/").map(x=>x.trim()).filter(Boolean).map(x=>{const n=Number(x);return Number.isFinite(n)?n:x})}
function attributeValue(attrs,patterns){const m=asArray(attrs).find(a=>patterns.some(p=>p.test(String(a&&a.key||"").toLowerCase())));return m?m.value:null}
function normalizeAbility(name,raw){const s=raw&&typeof raw==="object"?raw:{},attributes=asArray(firstDefined(s,["attrib","attributes"])),manaCost=firstDefined(s,["mc","mana_cost","manaCost"]),cooldown=firstDefined(s,["cd","cooldown"]),damage=firstDefined(s,["dmg","damage"]),radius=firstDefined(s,["radius","aoe","area_of_effect"])??attributeValue(attributes,[/radius/,/area_of_effect/,/aoe/]),castRange=firstDefined(s,["cast_range","castRange"])??attributeValue(attributes,[/cast_range/,/cast range/]);return{id:name,name,displayName:firstDefined(s,["dname","display_name","name"])||name,description:firstDefined(s,["desc","description"])||"",lore:firstDefined(s,["lore"])||"",notes:asArray(firstDefined(s,["notes"])),manaCost,manaCostValues:parseLevelValues(manaCost),cooldown,cooldownValues:parseLevelValues(cooldown),damage,damageValues:parseLevelValues(damage),damageType:firstDefined(s,["dmg_type","damage_type"]),castRange,castRangeValues:parseLevelValues(castRange),radius,radiusValues:parseLevelValues(radius),behavior:firstDefined(s,["behavior"]),targetTeam:firstDefined(s,["target_team","targetTeam"]),targetType:firstDefined(s,["target_type","targetType"]),targetFlags:firstDefined(s,["target_flags","targetFlags"]),bkbPierce:firstDefined(s,["bkbpierce","bkb_pierce"]),dispellable:firstDefined(s,["dispellable"]),innate:firstDefined(s,["is_innate","innate"]),image:firstDefined(s,["img","image"]),attributes,raw:s}}
function normalizeHeroAbilityMap(map,abilities){const out={};for(const[hero,e]of Object.entries(map||{})){const slots=e&&Array.isArray(e.abilities)?e.abilities:[],talents=e&&Array.isArray(e.talents)?e.talents:[];out[hero]={hero,abilities:slots.filter(Boolean).map(name=>({id:name,data:abilities[name]||null,missingMetadata:!abilities[name]})),talents:talents.map(t=>{const name=t&&t.name||t;return{name,level:t&&t.level||null,slot:t&&t.name?t:null,data:abilities[name]||null,missingMetadata:!abilities[name]}}),facets:asArray(e&&e.facets)}}return out}
function buildDataset(payload,metadata){const source=payload.abilities||{},abilities={};for(const[name,raw]of Object.entries(source))abilities[name]=normalizeAbility(name,raw);const heroAbilities=normalizeHeroAbilityMap(payload.heroAbilities||{},abilities),heroes=Array.isArray(payload.heroes)?payload.heroes:Object.values(payload.heroes||{});return{schemaVersion:2,source:metadata&&metadata.source||"OpenDota constants",patch:metadata&&metadata.patch||null,fetchedAt:metadata&&metadata.fetchedAt||new Date().toISOString(),counts:{abilities:Object.keys(abilities).length,heroes:Object.keys(heroAbilities).length,heroCatalog:heroes.length},abilities,heroAbilities,heroes}}
async function fetchJson(url,fetchImpl,timeoutMs=45000){const controller=typeof AbortController!=="undefined"?new AbortController():null;const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;try{const r=await fetchImpl(url,{headers:{Accept:"application/json"},...(controller?{signal:controller.signal}:{})});if(!r||!r.ok)throw new Error("HTTP "+(r&&r.status||"desconocido"));return await r.json()}finally{if(timer)clearTimeout(timer)}}
async function fetchResource(name,base,fetchImpl){const urls=[STATIC_BASE+STATIC_FILES[name],base+ENDPOINTS[name]];let last=null;for(const url of urls){try{const data=await fetchJson(url,fetchImpl);if(data&&typeof data==="object")return{data,source:url.startsWith(STATIC_BASE)?"dotaconstants GitHub estático":"OpenDota API"};throw new Error("Respuesta vacía")}catch(error){last=error}}throw last||new Error("Sin fuente para "+name)}
async function load(options){const o=options||{},fetchImpl=o.fetch||root.fetch;if(typeof fetchImpl!=="function")throw new Error("Este entorno no dispone de fetch.");const base=(o.baseUrl||DEFAULT_BASE).replace(/\/$/,"");if(!o.force&&memoryCache.has(base))return memoryCache.get(base);const[a,h,heroes]=await Promise.all([fetchResource("abilities",base,fetchImpl),fetchResource("heroAbilities",base,fetchImpl),fetchResource("heroes",base,fetchImpl)]);const data=buildDataset({abilities:a.data,heroAbilities:h.data,heroes:Object.values(heroes.data||{})},{source:"dotaconstants estático / OpenDota API",patch:o.patch||null});data.sourcesUsed={abilities:a.source,heroAbilities:h.source,heroes:heroes.source};memoryCache.set(base,data);return data}
function buildFallbackGuide(dataset,heroKey,heroName,role,patch){
 const hero=dataset&&dataset.heroAbilities&&dataset.heroAbilities[heroKey];
 if(!hero)return null;
 const innate=[],learnable=[];
 for(const slot of hero.abilities||[]){
  const id=slot&&slot.id,data=slot&&slot.data;
  if(!id||id==="generic_hidden"||id.startsWith("special_bonus_")||!data)continue;
  const entry={id,name:data.displayName||id.replace(/^[^_]+_/,"").replaceAll("_"," "),slug:id,description:data.description||""};
  if(data.innate===true||data.raw&&data.raw.is_innate===true)innate.push(entry);
  else learnable.push(entry);
 }
 if(learnable.length<4)return null;
 const main=learnable.slice(0,3),ult=learnable[learnable.length-1],extras=learnable.slice(3,-1);
 const skillIcons={Q:{name:main[0].name,slug:main[0].slug},W:{name:main[1].name,slug:main[1].slug},E:{name:main[2].name,slug:main[2].slug},R:{name:ult.name,slug:ult.slug}};
 extras.forEach((x,i)=>skillIcons["S"+(i+1)]={name:x.name,slug:x.slug});
 const skillBuild=[
  {level:1,code:"Q"},{level:2,code:"W"},{level:3,code:"Q"},{level:4,code:"E"},
  {level:5,code:"Q"},{level:6,code:"R"},{level:7,code:"Q"},{level:8,code:"W"},
  {level:9,code:"W"},{level:11,code:"W"},{level:12,code:"R"},
  {level:13,code:"E"},{level:14,code:"E"},{level:16,code:"E"},{level:18,code:"R"},
  ...[17,19,21,22,23,24].map(level=>({level,code:"A"}))
 ];
 const talentNames=(hero.talents||[]).map(t=>({id:t.name,level:Number(t.level)||1,data:dataset.abilities&&dataset.abilities[t.name]}));
 const talentChoices=[1,2,3,4].map(tier=>{
  const pair=talentNames.filter(t=>t.level===tier);
  if(pair.length<2)return null;
  const name=t=>t.data?.displayName||t.data?.raw?.dname||t.id.replace(/^special_bonus_/,"").replaceAll("_"," ");
  const reason=t=>t.data?.description||t.data?.raw?.desc||"La descripción oficial del talento define su efecto; elegí según la amenaza y la necesidad concreta de la partida.";
  return{level:tier*5+5,left:{name:name(pair[0]),reason:reason(pair[0])},right:{name:name(pair[1]),reason:reason(pair[1])}};
 }).filter(Boolean);
 if(talentChoices.length!==4)return null;
 const roleNote=role==="Carry"?"Como Carry, priorizá la habilidad que te permita asegurar farmeo y escalar sin perder la capacidad de pelear.":
  role==="Mid"?"Como Mid, ajustá los primeros puntos a la presión de línea, el control de runas y las ventanas de rotación.":
  role==="Offlane"?"Como Offlane, adelantá la herramienta que te permita sobrevivir, iniciar o controlar el espacio según el dúo rival.":
  role==="Support 4"?"Como Support 4, priorizá la herramienta que habilite rotaciones, control y presión junto al iniciador.":
  "Como Support 5, priorizá la herramienta que proteja al aliado, aporte control y permita disputar visión con recursos limitados.";
 return{
  title:heroName+" "+role+" · progresión base de habilidades y talentos",
  skillIcons,skillBuild,skillOrder:skillBuild.map(x=>skillIcons[x.code]?.name||x.code),talentChoices,
  innateAbilities:innate.map(x=>({name:x.name,description:x.description||"Habilidad innata identificada en el catálogo oficial."})),
  skillPriority:"BASE PROVISIONAL · La matriz muestra una progresión estructural Q/W/E/R para que no falten habilidades ni niveles. No representa una muestra estadística ni una recomendación validada de jugadores de alto MMR. "+roleNote+" Cambiá el orden si la línea, el draft o la habilidad de mayor impacto lo requieren.",
  combos:[],
  positioning:roleNote,
  mechanics:"Nombres, asignación de habilidades, descripciones y talentos obtenidos del catálogo de dotaconstants/OpenDota. No se agregan interacciones no verificadas.",
  caveats:"Esta es una guía de cobertura de datos, no una guía individual terminada al nivel de Pugna. Las cuatro parejas de talentos son las del catálogo; no se inventan tasas de elección. La progresión Q/W/E/R es una plantilla provisional hasta disponer de datos fiables por héroe y posición.",
  metadata:{patch:patch||dataset.patch||"catálogo actual",role,source:["dotaconstants · catálogo de habilidades y talentos"],confidence:"base provisional",matches:0,guideType:"fallback"}
 };
}
function getHeroSkills(d,k){return d&&d.heroAbilities&&d.heroAbilities[k]||null}
function findAbility(d,k){return d&&d.abilities&&d.abilities[k]||null}
function getCoverage(d){const hs=Object.values(d&&d.heroAbilities||{}),abilitySlots=hs.reduce((n,h)=>n+h.abilities.length,0),talentSlots=hs.reduce((n,h)=>n+h.talents.length,0),missingAbilities=hs.reduce((n,h)=>n+h.abilities.filter(x=>x.missingMetadata).length,0),missingTalents=hs.reduce((n,h)=>n+h.talents.filter(x=>x.missingMetadata).length,0),totalSlots=abilitySlots+talentSlots,missing=missingAbilities+missingTalents,skillReady=hs.filter(h=>h.abilities.filter(x=>x.id&&x.id!=="generic_hidden"&&!x.id.startsWith("special_bonus_")&&x.data&&!x.data.innate).length>=4).length,talentReady=hs.filter(h=>[1,2,3,4].every(t=>h.talents.filter(x=>Number(x.level)===t).length>=2)).length,fullReady=hs.filter(h=>h.abilities.filter(x=>x.id&&x.id!=="generic_hidden"&&!x.id.startsWith("special_bonus_")&&x.data&&!x.data.innate).length>=4&&[1,2,3,4].every(t=>h.talents.filter(x=>Number(x.level)===t).length>=2)).length;return{heroes:hs.length,abilitySlots,talentSlots,missingAbilityMetadata:missingAbilities,missingTalentMetadata:missing,totalSlots,missingMetadataSlots:missing,metadataCoverage:totalSlots?Math.round((totalSlots-missing)/totalSlots*10000)/100:0,skillReady,talentReady,fullReady}}
function createFallbackGuide(heroKey,heroName,role,patch,baseUrl){const base=(baseUrl&&baseUrl.endsWith("/")?baseUrl.slice(0,-1):(baseUrl||DEFAULT_BASE));const dataset=memoryCache.get(base);return dataset?buildFallbackGuide(dataset,heroKey,heroName,role,patch):null}
const api={version:"2.1.0",sources:ENDPOINTS,load,buildDataset,normalizeAbility,parseLevelValues,getHeroSkills,findAbility,getCoverage,createFallbackGuide};if(typeof module!=="undefined"&&module.exports)module.exports=api;root.DotaSkillDataEngine=api;
})(typeof globalThis!=="undefined"?globalThis:this);