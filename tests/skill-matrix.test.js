const fs = require("node:fs");
const vm = require("node:vm");
const html = fs.readFileSync("index.html", "utf8");
const specializations = fs.readFileSync("specializations.js", "utf8");

const start = html.indexOf("function renderSpecializationGuide(g){");
const end = html.indexOf("\nfunction renderHeroPlan(", start);
if (start < 0 || end < 0) throw new Error("No se encontró renderSpecializationGuide");
const renderSource = html.slice(start, end);

const context = {
  window: {},
  esc: value => String(value ?? "").replace(/[&<>"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[ch])),
};
vm.createContext(context);
vm.runInContext(specializations, context);
vm.runInContext(renderSource, context);

const pugnaProfiles = ["Mid", "Support 4", "Support 5"];
for (const role of pugnaProfiles) {
  const guide = context.window.DOTA_HERO_SPECIALIZATIONS["pugna|" + role]?.guide;
  if (!guide) throw new Error("Falta guía individual Pugna " + role);
  const talentLevels = (guide.talentChoices || []).map(t => Number(t.level));
  const talentEntries = guide.skillBuild.filter(x => x.code === "T").map(x => Number(x.level));
  if (talentEntries.some(level => !talentLevels.includes(level))) {
    throw new Error("Hay un evento de talento sin metadatos en Pugna " + role);
  }
  if (talentLevels.includes(10)) {
    const levelTen = guide.skillBuild.find(x => Number(x.level) === 10);
    if (!levelTen || levelTen.code !== "T") {
      throw new Error("El talento de nivel 10 no coincide con skillBuild de Pugna " + role);
    }
  }
  const output = context.renderSpecializationGuide(guide);
  if (!output.includes("Orden de habilidades por nivel")) throw new Error("Falta matriz Pugna " + role);
  if (!output.includes("Nether Blast")) throw new Error("Falta habilidad de Pugna " + role);
}

const techies = context.window.DOTA_HERO_SPECIALIZATIONS["techies|Support 4"]?.guide;
if (!techies) throw new Error("Falta la especialización Techies Support 4");
if (techies.metadata?.patch !== "7.41f" || techies.metadata?.role !== "Support 4") {
  throw new Error("Techies debe identificar parche y posición");
}
if (!Array.isArray(techies.innateAbilities) || !techies.innateAbilities.some(x => x.name === "M.A.D.")) {
  throw new Error("Falta M.A.D. como habilidad innata independiente");
}
if (techies.skillBuild.some(x => x.code === "M.A.D." || x.code === "INNATE")) {
  throw new Error("La habilidad innata no debe consumir un punto de progresión");
}
for (const entry of techies.skillBuild) {
  if (!techies.skillIcons[entry.code]) throw new Error("Techies usa una habilidad sin icono: " + entry.code);
}
const talentTiers = (techies.talentChoices || []).map(x => Number(x.level));
if (talentTiers.join(",") !== "10,15,20,25") {
  throw new Error("Techies debe mostrar los tiers de talento del parche en niveles 10/15/20/25");
}
if (techies.skillBuild.some(x => x.code === "T")) {
  throw new Error("No se deben confundir niveles de desbloqueo con eventos de selección de talento");
}
const techiesOutput = context.renderSpecializationGuide(techies);
for (const value of ["M.A.D.", "Habilidades innatas", "Blast Off!", "Reactive Tazer", "Proximity Mines", "−2 s de recarga de Proximity Mines", "−0,8 s de activación de Proximity Mines"]) {
  if (!techiesOutput.includes(value)) throw new Error("La guía Techies no muestra " + value);
}


const techies5 = context.window.DOTA_HERO_SPECIALIZATIONS["techies|Support 5"]?.guide;
if (!techies5) throw new Error("Falta la especialización Techies Support 5");
if (techies5.metadata?.patch !== "7.41f" || techies5.metadata?.role !== "Support 5") {
  throw new Error("Techies Support 5 debe identificar parche y posición");
}
if (!Array.isArray(techies5.innateAbilities) || !techies5.innateAbilities.some(x => x.name === "M.A.D.")) {
  throw new Error("Techies Support 5 debe mostrar M.A.D. como innata");
}
for (const entry of techies5.skillBuild) {
  if (!techies5.skillIcons[entry.code]) throw new Error("Techies Support 5 usa una habilidad sin icono: " + entry.code);
}
if ((techies5.talentChoices || []).map(x => Number(x.level)).join(",") !== "10,15,20,25") {
  throw new Error("Techies Support 5 debe incluir los cuatro tiers de talentos");
}
if (techies5.skillBuild.some(x => x.code === "T")) {
  throw new Error("Techies Support 5 no debe inventar eventos de talento incompatibles con los tiers");
}
if (techies5.skillPriority === techies.skillPriority || techies5.positioning === techies.positioning) {
  throw new Error("Techies Support 5 debe tener prioridad y posicionamiento independientes de Support 4");
}
const techies5Output = context.renderSpecializationGuide(techies5);
for (const value of ["Techies Support 5", "M.A.D.", "Blast Off!", "Reactive Tazer", "−0,8 s de activación de Proximity Mines"]) {
  if (!techies5Output.includes(value)) throw new Error("La guía Techies Support 5 no muestra " + value);
}



const crystalMaiden5 = context.window.DOTA_HERO_SPECIALIZATIONS["crystal_maiden|Support 5"]?.guide;
if (!crystalMaiden5) throw new Error("Falta la especialización Crystal Maiden Support 5");
if (crystalMaiden5.metadata?.patch !== "7.41f" || crystalMaiden5.metadata?.role !== "Support 5") {
  throw new Error("Crystal Maiden Support 5 debe identificar parche y posición");
}
if (!Array.isArray(crystalMaiden5.innateAbilities) || !crystalMaiden5.innateAbilities.some(x => x.name === "Glacial Guard")) {
  throw new Error("Crystal Maiden debe mostrar Glacial Guard como habilidad innata");
}
if (crystalMaiden5.skillBuild.some(x => x.code === "T")) {
  throw new Error("Los tiers de talento no deben duplicarse como eventos de habilidad");
}
for (const entry of crystalMaiden5.skillBuild) {
  if (!crystalMaiden5.skillIcons[entry.code]) throw new Error("Crystal Maiden usa una habilidad sin icono: " + entry.code);
}
if ((crystalMaiden5.talentChoices || []).map(x => Number(x.level)).join(",") !== "10,15,20,25") {
  throw new Error("Crystal Maiden Support 5 debe incluir los cuatro tiers de talentos");
}
const cmOutput = context.renderSpecializationGuide(crystalMaiden5);
for (const value of ["Crystal Maiden Support 5", "Glacial Guard", "Frostbite", "Arcane Aura", "Crystal Nova", "Freezing Field", "+200 salud", "+1 s de duración de Frostbite"]) {
  if (!cmOutput.includes(value)) throw new Error("La guía Crystal Maiden Support 5 no muestra " + value);
}
if (!html.includes('heroPlans["npc_dota_hero_crystal_maiden|Support 5"]')) {
  throw new Error("Falta la ruta de objetos independiente de Crystal Maiden Support 5");
}
for (const item of ["Tango", "Blood Grenade", "Magic Wand", "Tranquil Boots", "Blink Dagger", "Glimmer Cape"]) {
  if (!html.includes('["' + item + '"')) throw new Error("Falta el objeto de referencia para Crystal Maiden: " + item);
}
if (cmOutput.includes("M.A.D.") || cmOutput.includes("Blast Off!")) {
  throw new Error("Crystal Maiden no debe heredar contenido específico de Techies");
}

const pugnaHelperStart = html.indexOf("function buildPugnaMidAllySynergy");
const genericHelperStart = html.indexOf("function buildAllySynergy");
const threatHelperStart = html.indexOf("function buildThreatPriority", genericHelperStart);
if (pugnaHelperStart < 0 || genericHelperStart < 0 || threatHelperStart < 0) {
  throw new Error("No se encontraron los generadores de sinergia");
}
const pugnaSynergyCopy = html.slice(pugnaHelperStart, genericHelperStart);
const genericSynergyCopy = html.slice(genericHelperStart, threatHelperStart);
if (genericSynergyCopy.includes("Nether Blast")) {
  throw new Error("El generador genérico no debe contener texto exclusivo de Pugna");
}
if (!pugnaSynergyCopy.includes('ownId==="pugna"&&role==="Mid"') || !pugnaSynergyCopy.includes("Nether Blast")) {
  throw new Error("La sinergia específica de Pugna Mid debe permanecer aislada y condicionada");
}
if (html.includes("Versión 3.27 · Pugna Mid")) {
  throw new Error("El pie del informe no debe presentar Pugna como único perfil");
}

const fixture = {
  title: "Fixture sintética — no representa un héroe real",
  metadata: {
    heroKey: "fixture_hero",
    role: "Support 4",
    patch: "fixture-patch",
    source: ["https://example.invalid/source"],
    confidence: "verified"
  },
  innateAbilities: [
    { name: "Innate Fixture", description: "Descripción sintética de habilidad innata." }
  ],
  maxLevel: 30,
  skillIcons: {
    ABILITY_ALPHA: { name: "Habilidad Alfa", slug: "fixture_alpha" },
    ABILITY_BETA: { name: "Habilidad Beta", slug: "fixture_beta" },
    ULTIMATE_OMEGA: { name: "Habilidad Omega", slug: "fixture_omega" }
  },
  skillBuild: [
    { level: 1, code: "ABILITY_ALPHA" },
    { level: 2, code: "ABILITY_BETA" },
    { level: 3, code: "ABILITY_ALPHA" },
    { level: 4, code: "ULTIMATE_OMEGA" },
    { level: 30, code: "ABILITY_BETA" }
  ],
  talentChoices: [],
  talents: [],
  combos: [],
  mechanics: "",
  positioning: "",
  caveats: ""
};
const fixtureOutput = context.renderSpecializationGuide(fixture);
for (const name of ["Habilidad Alfa", "Habilidad Beta", "Habilidad Omega"]) {
  if (!fixtureOutput.includes(name)) throw new Error("La matriz dinámica omitió " + name);
}
if (!fixtureOutput.includes("grid-template-columns:150px repeat(30,41px)")) {
  throw new Error("La matriz no generó columnas dinámicas desde los niveles esperados");
}
for (const value of ["Datos de guía:", "fixture-patch", "Support 4", "Innate Fixture", "Descripción sintética de habilidad innata."]) {
  if (!fixtureOutput.includes(value)) throw new Error("El renderizador omitió metadatos/habilidad innata: " + value);
}
if (fixtureOutput.indexOf("Innate Fixture") > fixtureOutput.indexOf("Orden de habilidades por nivel")) {
  throw new Error("Las habilidades innatas deben aparecer separadas antes de la matriz de progresión");
}
const legacyOutput = context.renderSpecializationGuide(context.window.DOTA_HERO_SPECIALIZATIONS["pugna|Mid"].guide);
if (legacyOutput.includes("Datos de guía:") || legacyOutput.includes("Habilidades innatas")) {
  throw new Error("Los perfiles Pugna antiguos deben seguir funcionando sin bloques nuevos");
}
console.log("OK: Pugna x3 + matriz sintética 30 niveles + metadatos + innatas + compatibilidad legacy");

// Regresiones de ruta de objetos Crystal Maiden Support 5.
const iconStart=html.indexOf("const ITEM_IMG=");
const iconEnd=html.indexOf("function renderItemCards",iconStart);
if(iconStart<0||iconEnd<0)throw new Error("No se encontró el catálogo de iconos");
vm.runInContext(html.slice(iconStart,iconEnd),context);
for(const [name,slug] of [
 ["Tango","tango"],["Iron Branch","branches"],["Blood Grenade","blood_grenade"],
 ["Enchanted Mango","enchanted_mango"],["Sentry Ward","ward_sentry"],["Magic Stick","magic_stick"],
 ["Wind Lace","wind_lace"],["Tranquil Boots","tranquil_boots"],["Infused Raindrops","infused_raindrop"]
]){
 const icon=context.renderItemIcon(name);
 if(!icon.includes("/"+slug+".png"))throw new Error("Falta icono oficial de "+name);
}
const purchaseStart=html.indexOf("const itemRecipes=");
const purchaseEnd=html.indexOf("\nfunction pugnaFinalBuild",purchaseStart);
if(purchaseStart<0||purchaseEnd<0)throw new Error("No se encontró el motor de próxima compra");
vm.runInContext(html.slice(purchaseStart,purchaseEnd),context);
const cmRoute=[
 {name:"Tango",heroSpecific:true,heroKey:"npc_dota_hero_crystal_maiden|Support 5",stage:"Inicio",why:"Consumible"},
 {name:"Blink Dagger",heroSpecific:true,heroKey:"npc_dota_hero_crystal_maiden|Support 5",stage:"Medio",why:"Reposicionamiento"},
 {name:"Glimmer Cape",heroSpecific:true,heroKey:"npc_dota_hero_crystal_maiden|Support 5",stage:"Medio",why:"Salvación"},
 {name:"Aghanim’s Shard",heroSpecific:true,heroKey:"npc_dota_hero_crystal_maiden|Support 5",stage:"Medio",why:"Mejora"}
];
const noGold=context.getNextPurchase(cmRoute,{gold:0,minute:20,owned:[],components:[]});
if(!noGold.done||!noGold.message.includes("Ingresá el oro"))throw new Error("No debe recomendar una compra sin conocer el oro disponible");
const early=context.getNextPurchase(cmRoute,{gold:300,minute:8,owned:[],components:[]});
if(!early.done||!early.message.includes("fase inicial"))throw new Error("La compra automática del núcleo no debe adelantarse a la fase de línea");
const mid=context.getNextPurchase(cmRoute,{gold:300,minute:20,owned:[],components:[]});
if(mid.done||mid.name!=="Blink Dagger"||mid.kind!=="goal")throw new Error("Crystal Maiden debe priorizar su primer objetivo de núcleo desde fase media");
const afterBlink=context.getNextPurchase(cmRoute,{gold:300,minute:20,owned:["Blink Dagger"],components:[]});
if(afterBlink.name!=="Glimmer Cape")throw new Error("La ruta debe avanzar al siguiente objetivo tras marcar Blink Dagger como comprado");
if(!html.includes("Núcleo orientativo")||!html.includes("crystalPlan.situational"))throw new Error("El informe debe renderizar núcleo y compras situacionales aunque no entren en las primeras siete compras");
console.log("OK: iconos CM + visibilidad de núcleo/situacionales + próxima compra condicionada por oro, fase e inventario");



// La primera columna de la matriz debe permanecer fija para TODAS las especializaciones.
const matrixCssStart = html.indexOf(".skill-matrix-scroll{");
const matrixCssEnd = html.indexOf("</style>", matrixCssStart);
const matrixCss = html.slice(matrixCssStart, matrixCssEnd);
if (!matrixCss.includes("position:sticky;left:0;z-index:3")) {
  throw new Error("La columna de etiquetas de habilidades debe permanecer fija al desplazar la matriz");
}
if (!matrixCss.includes(".skill-matrix-head>b{z-index:4")) {
  throw new Error("La etiqueta HABILIDAD debe quedar por encima de las celdas al desplazar horizontalmente");
}
if (matrixCss.includes(".skill-matrix{min-width:1180px;border:1px solid #3b4a5e;border-radius:12px;overflow:hidden")) {
  throw new Error("El contenedor de matriz no debe recortar la columna sticky");
}
const allProfiles = Object.entries(context.window.DOTA_HERO_SPECIALIZATIONS || {});
let checkedMatrices = 0;
for (const [profileKey, profile] of allProfiles) {
  const guide = profile && profile.guide;
  if (!guide || !Array.isArray(guide.skillBuild) || !Object.keys(guide.skillIcons || {}).length) continue;
  const output = context.renderSpecializationGuide(guide);
  if (!output.includes('class="skill-matrix-scroll"') ||
      !output.includes('class="skill-matrix-row skill-matrix-head"') ||
      !output.includes('class="skill-row-label"')) {
    throw new Error("La matriz no aplica la columna fija al perfil " + profileKey);
  }
  checkedMatrices++;
}
if (!checkedMatrices) throw new Error("No se encontraron matrices de héroes para validar el comportamiento universal");
console.log("OK: columna de etiquetas sticky aplicada a " + checkedMatrices + " matrices de especialización");


// Crystal Maiden Support 4 debe tener guía independiente de habilidades y talentos.
const crystalMaiden4 = context.window.DOTA_HERO_SPECIALIZATIONS["crystal_maiden|Support 4"]?.guide;
if (!crystalMaiden4) throw new Error("Falta la especialización Crystal Maiden Support 4");
if (crystalMaiden4.metadata?.patch !== "7.41f" || crystalMaiden4.metadata?.role !== "Support 4") {
  throw new Error("Crystal Maiden Support 4 debe identificar parche y posición");
}
if (!crystalMaiden4.metadata.source.some(x => x.includes("soft-support"))) {
  throw new Error("Crystal Maiden Support 4 debe citar fuentes específicas de soft support");
}
if (crystalMaiden4.metadata.source.some(x => x.includes("hard_support"))) {
  throw new Error("Crystal Maiden Support 4 no debe atribuir fuentes exclusivas de hard support");
}
if ((crystalMaiden4.talentChoices || []).map(x => Number(x.level)).join(",") !== "10,15,20,25") {
  throw new Error("Crystal Maiden Support 4 debe incluir los cuatro tiers de talentos");
}
const expectedCM4 = [[1,"W"],[2,"E"],[3,"W"],[4,"Q"],[5,"W"],[6,"R"],[7,"W"],[8,"Q"],[9,"E"],[10,"E"],[12,"E"],[13,"R"],[14,"Q"],[15,"Q"],[17,"R"]];
for (const [level, code] of expectedCM4) {
  if (!crystalMaiden4.skillBuild.some(x => Number(x.level) === level && x.code === code)) {
    throw new Error("Crystal Maiden Support 4: orden de habilidades incorrecto en nivel " + level);
  }
}
const cm4Output = context.renderSpecializationGuide(crystalMaiden4);
for (const value of ["Orden de habilidades por nivel", "Árbol de talentos", "Frostbite", "Arcane Aura", "Crystal Nova", "Freezing Field", "+200 salud", "+100 alcance de lanzamiento de Frostbite", "+50 daño de Freezing Field", "+1 s de duración de Frostbite"]) {
  if (!cm4Output.includes(value)) throw new Error("Crystal Maiden Support 4 no muestra " + value);
}
if (crystalMaiden4 === crystalMaiden5 || crystalMaiden4.metadata.role === crystalMaiden5.metadata.role) {
  throw new Error("Crystal Maiden Support 4 debe ser un perfil independiente de Support 5");
}
console.log("OK: Crystal Maiden Support 4 — matriz por nivel y cuatro tiers de talentos");

// Auditoría transversal: contrato común de los siete perfiles integrados.
const expectedProfiles = [
  "pugna|Mid", "pugna|Support 4", "pugna|Support 5",
  "techies|Support 4", "techies|Support 5",
  "crystal_maiden|Support 4", "crystal_maiden|Support 5"
];
const registeredProfiles = Object.keys(context.window.DOTA_HERO_SPECIALIZATIONS).sort();
if (expectedProfiles.slice().sort().join("|") !== registeredProfiles.join("|")) {
  throw new Error("La cobertura de especializaciones cambió: revisar altas/bajas de perfiles antes de integrar");
}
for (const profileKey of expectedProfiles) {
  const guide = context.window.DOTA_HERO_SPECIALIZATIONS[profileKey]?.guide;
  if (!guide) throw new Error("Falta la guía " + profileKey);
  if (!Array.isArray(guide.skillBuild) || !guide.skillBuild.length) {
    throw new Error("Falta la progresión de habilidades en " + profileKey);
  }
  if (!guide.skillIcons || !Object.keys(guide.skillIcons).length) {
    throw new Error("Faltan iconos/metadatos de habilidades en " + profileKey);
  }
  const seenLevels = new Set();
  for (const event of guide.skillBuild) {
    const level = Number(event.level);
    if (!Number.isInteger(level) || level < 1 || level > 30) {
      throw new Error("Nivel de progresión inválido en " + profileKey + ": " + event.level);
    }
    if (seenLevels.has(level)) {
      throw new Error("Hay más de un evento de progresión en nivel " + level + " para " + profileKey);
    }
    seenLevels.add(level);
    if (!event.code || !["A", "T"].includes(event.code) && !guide.skillIcons[event.code]) {
      throw new Error("Evento sin habilidad/icono válido en " + profileKey + " nivel " + level);
    }
  }
  const tiers = (guide.talentChoices || []).map(t => Number(t.level));
  if (tiers.join(",") !== "10,15,20,25") {
    throw new Error("El árbol de " + profileKey + " debe tener exactamente los tiers 10/15/20/25");
  }
  for (const tier of guide.talentChoices) {
    for (const side of ["left", "right"]) {
      if (!tier[side]?.name || !tier[side]?.reason) {
        throw new Error("Falta nombre o explicación de talento en " + profileKey + " nivel " + tier.level);
      }
    }
  }
  const rendered = context.renderSpecializationGuide(guide);
  if (!rendered.includes("Árbol de talentos") || !rendered.includes("Nivel 25")) {
    throw new Error("No se renderiza el árbol completo de " + profileKey);
  }
  for (const tier of guide.talentChoices) {
    if (!rendered.includes(tier.left.name) || !rendered.includes(tier.right.name)) {
      throw new Error("No se muestran ambas elecciones del nivel " + tier.level + " en " + profileKey);
    }
  }
  if (guide.metadata && (guide.metadata.role !== profileKey.split("|")[1] || guide.metadata.patch !== "7.41f")) {
    throw new Error("Metadata de rol/parche inconsistente en " + profileKey);
  }
}
console.log("OK: auditoría transversal de siete perfiles — progresión, iconos, cuatro tiers y render del árbol");


// Flujo de compras: los objetos recomendados se pueden marcar desde su propia tarjeta.
const appHtml = fs.readFileSync("index.html", "utf8");
for (const marker of [
  'data-buy-item=',
  'data-buy-component=',
  'item-buy-toggle',
  'bought-chip',
  'Carga manual opcional de objetos comprados',
  'Tocá cualquier objeto recomendado cuando lo compres',
  "input.checked=!input.checked;analyze({scroll:false})"
]) {
  if (!appHtml.includes(marker)) throw new Error("Falta el flujo de compra directa: " + marker);
}
if (!appHtml.includes(".item-buy-toggle.bought")) {
  throw new Error("Los objetos comprados deben tener un estado visual diferenciado");
}
console.log("OK: compra directa desde recomendaciones, deshacer compra y carga manual opcional");


// Inventario visual del héroe: refleja compras y permite retirarlas del estado.
const inventoryMarkers = [
  "function renderHeroInventory(state)",
  'class="hero-inventory-slots"',
  "renderHeroInventory(live)",
  'data-remove-owned=',
  'data-remove-component=',
  "Inventario del héroe",
  "espacios principales"
];
for (const marker of inventoryMarkers) {
  if (!appHtml.includes(marker)) throw new Error("Falta la interfaz de inventario: " + marker);
}
if (!appHtml.includes(".hero-inventory-slot.filled")) {
  throw new Error("Los espacios ocupados del inventario deben tener estilo visual");
}
console.log("OK: inventario visual de seis espacios, objetos extra y componentes removibles");
