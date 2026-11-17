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
  'function renderHeroInventory(state,hero=null,role="")',
  'class="hero-inventory-slots"',
  "renderHeroInventory(live,me,role)",
  'data-remove-owned=',
  'data-remove-component=',
  "Inventario del héroe",
  "Inventario principal"
];
for (const marker of inventoryMarkers) {
  if (!appHtml.includes(marker)) throw new Error("Falta la interfaz de inventario: " + marker);
}
if (!appHtml.includes(".hero-inventory-slot.filled")) {
  throw new Error("Los espacios ocupados del inventario deben tener estilo visual");
}
console.log("OK: inventario visual de seis espacios, objetos extra y componentes removibles");


(()=>{
// Auditoría transversal del seguimiento de compras para cualquier héroe/posición.
const purchaseStart = appHtml.indexOf("function renderHeroInventory(state,hero=null,role=\"\"){");
const purchaseEnd = appHtml.indexOf("\nconst heroPlans =", purchaseStart);
if (purchaseStart < 0 || purchaseEnd < 0) {
  throw new Error("No se encontró el bloque común de inventario y tarjetas de objetos");
}
const purchaseRenderSource = appHtml.slice(purchaseStart, purchaseEnd);
const purchaseContext = {
  esc: value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch])),
  getLiveState: () => ({ owned: [], components: [] }),
  getHeroPlan: () => ({core:[["Arcane Boots","core"],["Aether Lens","core"]]}),
  renderItemIcon: name => '<i data-icon="' + String(name) + '"></i>'
};
vm.createContext(purchaseContext);
vm.runInContext(purchaseRenderSource, purchaseContext);
const arbitraryItems = [
  { name: "Objeto de héroe sin ruta individual", why: "Prueba genérica" },
  { name: "Respuesta situacional generada por amenaza", why: "Prueba contextual" },
  { name: "Componente no listado previamente", why: "Prueba de componente" }
];
const renderedArbitrary = purchaseContext.renderItemCards(arbitraryItems);
for (const x of arbitraryItems) {
  if (!renderedArbitrary.includes('data-buy-item="' + x.name + '"')) {
    throw new Error("Una recomendación genérica no permite marcar compra: " + x.name);
  }
}
const arbitraryInventory = purchaseContext.renderHeroInventory({
  owned: arbitraryItems.map(x => x.name),
  components: ["Componente no listado previamente"]
});
for (const name of arbitraryItems.map(x => x.name)) {
  if (!arbitraryInventory.includes(name)) {
    throw new Error("El inventario no muestra un objeto arbitrario: " + name);
  }
}
if ((!arbitraryInventory.includes('data-remove-owned=') && !arbitraryInventory.includes('data-sell-owned='))
    || !arbitraryInventory.includes('data-remove-component=')) {
  throw new Error("El inventario debe permitir retirar tanto objetos como componentes");
}
const coreOrderedInventory = purchaseContext.renderHeroInventory({owned:["Arcane Boots","Magic Wand","Bottle","Black King Bar","Blink Dagger","Glimmer Cape","Aether Lens","Aeon Disk","Kaya","Dagon","Aghanim’s Shard","Aghanim’s Scepter","Linken’s Sphere"],components:[],zones:{}},{name:"npc_dota_hero_pugna"},"Mid");
const mainArea=coreOrderedInventory.split("Mochila · objetos para rotar")[0];
if(!mainArea.includes("Arcane Boots")||!mainArea.includes("Aether Lens"))throw new Error("Los objetos core de Pugna deben priorizarse en los seis espacios principales");
const iconStart=appHtml.indexOf("function renderItemIcon(name){");
const iconEnd=appHtml.indexOf("\nfunction renderHeroInventory",iconStart);
const iconSource=appHtml.slice(iconStart,iconEnd);
if(!iconSource.includes("onerror=")||!iconSource.includes("item-icon-fallback"))throw new Error("Los iconos fallidos deben mostrar un fallback visual");


// Todas las rutas individuales de objetos usan el mismo renderizador interactivo.
const heroPlansStart = appHtml.indexOf("const heroPlans = {");
const universalStart = appHtml.indexOf("const universalItems=[", heroPlansStart);
if (heroPlansStart < 0 || universalStart < 0) {
  throw new Error("No se encontró el catálogo común de rutas");
}
const planContext = { item: (name, why) => ({ name, why }) };
vm.createContext(planContext);
vm.runInContext(appHtml.slice(heroPlansStart, universalStart), planContext);
const planEntries = vm.runInContext('Object.entries(heroPlans)', planContext);
if (!planEntries.length) throw new Error("No hay rutas individuales para auditar");
for (const [profile, plan] of planEntries) {
  for (const [stage, items] of [["early", plan.early], ["core", plan.core], ["situational", plan.situational]]) {
    for (const item of items || []) {
      const html = purchaseContext.renderItemCards([item]);
      if (!html.includes('data-buy-item="' + item[0] + '"')) {
        throw new Error("La ruta " + profile + " (" + stage + ") no genera un objeto comprable: " + item[0]);
      }
    }
  }
}

// Las recomendaciones sin checkbox previo deben crear su estado antes de recalcular.
const reportClickStart = appHtml.indexOf("$('report').addEventListener('click',e=>{");
const reportClickEnd = appHtml.indexOf("\n});", reportClickStart);
if (reportClickStart < 0 || reportClickEnd < 0) {
  throw new Error("No se encontró el controlador delegado de compras");
}
const reportClickSource = appHtml.slice(reportClickStart, reportClickEnd);
for (const marker of [
  "closest('[data-buy-item]')",
  "querySelectorAll('.owned-item')",
  "appendChild(label)",
  "input.checked=!input.checked",
  "analyze({scroll:false})",
  "closest('[data-buy-component]')",
  "closest('[data-remove-owned]')",
  "closest('[data-remove-component]')"
]) {
  if (!reportClickSource.includes(marker)) {
    throw new Error("El flujo delegado no cubre " + marker);
  }
}
console.log("OK: auditoría universal de compras — rutas individuales, recomendaciones dinámicas, inventario y componentes");


const universalContext = { item: (name, why) => ({ name, why }) };
vm.createContext(universalContext);
const universalEnd = appHtml.indexOf("\nfunction renderDynamicStateControls(){", universalStart);
vm.runInContext(appHtml.slice(universalStart, universalEnd), universalContext);
const universalRoles = ["Carry", "Mid", "Offlane", "Support 4", "Support 5"];
const universalCatalog = vm.runInContext("universalItems", universalContext);
for (const role of universalRoles) {
  if (!universalCatalog.some(item => item.roles.includes(role))) {
    throw new Error("El catálogo común no contempla el rol " + role);
  }
}
console.log("OK: catálogo común de compras cubre Carry, Mid, Offlane, Support 4 y Support 5");

})();


(()=> {
  // Completar un objeto consume solo los componentes de su receta.
  const recipeStart = appHtml.indexOf("const itemRecipes={");
  const recipeEnd = appHtml.indexOf("\nfunction getNextPurchase(", recipeStart);
  if (recipeStart < 0 || recipeEnd < 0) throw new Error("No se encontró el catálogo de recetas");
  const recipeSource = appHtml.slice(recipeStart, recipeEnd);
  const componentInputs = [
    "Boots of Speed", "Ring of Basilius", "Wizard Hat",
    "Receta de Arcane Boots", "Energy Booster", "Void Stone"
  ].map(value => ({ value, checked: true }));
  const recipeContext = {
    document: { querySelectorAll: selector => selector === ".owned-component" ? componentInputs : [] }
  };
  vm.createContext(recipeContext);
  vm.runInContext(recipeSource, recipeContext);
  vm.runInContext("consumeRecipeComponents('Arcane Boots')", recipeContext);
  for (const part of ["Boots of Speed","Ring of Basilius","Wizard Hat","Receta de Arcane Boots"]) {
    const input = componentInputs.find(x => x.value === part);
    if (input.checked) throw new Error("Arcane Boots no consumió " + part);
  }
  for (const part of ["Energy Booster","Void Stone"]) {
    const input = componentInputs.find(x => x.value === part);
    if (!input.checked) throw new Error("Se consumió un componente ajeno a Arcane Boots: " + part);
  }
  console.log("OK: completar Arcane Boots consume sus cuatro piezas y conserva las de otras recetas");

  if (!appHtml.includes("if(markingBought)consumeRecipeComponents(name)")) {
    throw new Error("La compra de un objeto completo no consume su receta");
  }
  if (!appHtml.includes("clearTrackedPurchases();updateRoleFit()")
      || !appHtml.includes("clearTrackedPurchases();renderDynamicStateControls()")) {
    throw new Error("El inventario no se reinicia al cambiar de héroe o posición");
  }
  console.log("OK: inventario aislado por héroe/posición al cambiar la configuración");
})();


(()=> {
  const inventoryStart=appHtml.indexOf("function renderHeroInventory(state,hero=null,role=\"\"){");
  const inventoryEnd=appHtml.indexOf("\nfunction renderItemCards(items){",inventoryStart);
  if(inventoryStart<0||inventoryEnd<0)throw new Error("No se encontró el inventario ampliado");
  const renderer=appHtml.slice(inventoryStart,inventoryEnd);
  for(const marker of [
    'renderSlots("main",6)',
    'renderSlots("backpack",3)',
    'assigned.reserve.map',
    'data-move-owned=',
    'data-sell-owned=',
    'data-remove-owned=',
    'state.zones||{}'
  ])if(!renderer.includes(marker))throw new Error("Inventario sin soporte para: "+marker);
  if(!appHtml.includes("zones[x.name]||"))throw new Error("No se preservan las zonas al reconstruir los controles");
  const clickStart=appHtml.indexOf("$('report').addEventListener('click'");
  const clickEnd=appHtml.indexOf("\n});",clickStart);
  const handler=appHtml.slice(clickStart,clickEnd);
  for(const marker of ["[data-move-owned]","[data-sell-owned]","[data-remove-owned]","input.dataset.inventoryZone=next","input.checked=false"]) {
    if(!handler.includes(marker))throw new Error("Falta acción de inventario: "+marker);
  }
  for(const marker of [".hero-backpack-slots",".inventory-reserve",".inventory-reserve-item"]) {
    if(!appHtml.includes(marker))throw new Error("Falta estilo de sector de inventario: "+marker);
  }
  console.log("OK: seis slots principales, tres de mochila, reserva ilimitada vendible y movimiento entre sectores");
})();


// Regression: phase-aware Pugna purchase selection and phase-aware automatic inventory order.
if (!html.includes('const phase=state.minute<12?"Inicio":state.minute<28?"Medio":"Avanzada"')) {
  throw new Error("El motor debe identificar las tres fases de compra");
}
if (!html.includes('phase==="Avanzada"&&["Avanzada","Cierre"].includes(x.stage)')) {
  throw new Error("Pugna debe ponderar objetos avanzados/cierre desde minuto 28");
}
if (!html.includes('const phaseNames=plan?(phase==="Inicio"?plan.early:phase==="Medio"?[...(plan.core||[]),...(plan.early||[])]:[...(plan.situational||[]),...(plan.core||[])])')) {
  throw new Error("El inventario automático debe ordenar por etapa y plan del héroe");
}
if (!html.includes('slice(0,2).toUpperCase()')) {
  throw new Error("El fallback de iconos debe identificar el objeto y no mostrar una espada genérica");
}
for (const item of ["Robe of the Magi","Staff of Wizardry","Energy Booster","Void Stone","Ring of Health","Ultimate Orb","Receta de Battle Fury"]) {
  if (!html.includes("'"+item+"'")) throw new Error("Falta asociación de icono para "+item);
}


// Regression: problem selector values must map to Pugna situational counters, and late progression must continue beyond the first core list.
for (const marker of ['problem==="issue:initiation"','problem==="issue:magic"','problem==="issue:control"','problem==="issue:illusions"','problem==="issue:invisibility"','problem.startsWith("enemy:")']) {
 if (!html.includes(marker)) throw new Error("Falta respuesta contextual para "+marker);
}
for (const marker of ['"Kaya and Sange"','"Yasha and Kaya"','"Shiva’s Guard"','"Gem of True Sight"']) {
 if (!html.includes(marker)) throw new Error("Falta progresión tardía: "+marker);
}
if (!html.includes('state.minute>=32&&state.owned.includes("Kaya")')) throw new Error("Kaya debe habilitar sus evoluciones al entrar en fase avanzada");
if (!html.includes('!owned.has(part.name)')) throw new Error("Las recetas deben reconocer objetos completos que ya están en el inventario como componentes");
if (!html.includes("const owned=[...document.querySelectorAll('.owned-item')].find(x=>x.value===part.name)")) throw new Error("Completar una evolución debe consumir el objeto base registrado");


(()=> {
  const start=appHtml.indexOf("function pugnaFinalBuild(");
  const end=appHtml.indexOf("\nfunction heroPositionFit",start);
  if(start<0||end<0)throw new Error("No se encontró el motor situacional de Pugna");
  const context={};vm.createContext(context);vm.runInContext(appHtml.slice(start,end),context);
  const run=(problem,minute=25,owned=[])=>vm.runInContext("pugnaFinalBuild([], {problem:"+JSON.stringify(problem)+",minute:"+minute+",owned:"+JSON.stringify(owned)+"})",context);
  const names=result=>result.map(x=>x.name);
  for(const [problem,item] of [["issue:initiation","Aeon Disk"],["issue:control","Black King Bar"],["issue:magic","Glimmer Cape"],["issue:illusions","Shiva’s Guard"],["issue:invisibility","Gem of True Sight"],["issue:mobility","Blink Dagger"],["issue:lane","Magic Wand"],["issue:teamfight","Glimmer Cape"]]){
    if(!names(run(problem)).includes(item))throw new Error("El problema "+problem+" no activa "+item);
  }
  const late=names(run("none",33,["Kaya"]));
  if(!late.includes("Kaya and Sange")||late.includes("Yasha and Kaya"))throw new Error("Pugna debe ofrecer únicamente Kaya and Sange como evolución de Kaya");
  const veryLate=names(run("none",36,[]));
  for(const item of ["Scythe of Vyse","Aghanim’s Scepter","Shiva’s Guard"])if(!veryLate.includes(item))throw new Error("Falta continuidad tardía: "+item);
  console.log("OK: pruebas funcionales de problemas seleccionados, evoluciones de Kaya y opciones de cierre Pugna");
})();


// Regression: independent hero/item reset controls and Pugna anti-sustain.
if (!html.includes('Única evolución de Kaya contemplada para Pugna Mid')) throw new Error('Pugna debe ofrecer solo Kaya and Sange como evolución de Kaya');
if (!html.includes('boost("Spirit Vessel"') || !html.includes('has("alchemist")||has("huskar")')) throw new Error('Pugna debe priorizar Spirit Vessel ante sustain alto');
if (!html.includes('id="clearHeroes"') || !html.includes('id="clearItems"') || !html.includes('function clearHeroesOnly()') || !html.includes('function clearItemsOnly()')) throw new Error('Faltan controles independientes para borrar héroes e ítems');
if (!html.includes('clearHeroesOnly();clearItemsOnly()')) throw new Error('Restablecer todo debe seguir disponible como acción explícita');

 
// Core purchase progression and item evolution: Pugna Mid.
(()=>{
 const html=appHtml;
 const recipeStart=html.indexOf("const itemRecipes={");
 const nextStart=html.indexOf("function getNextPurchase(",recipeStart);
 const nextEnd=html.indexOf("\nfunction pugnaFinalBuild(",nextStart);
 if(recipeStart<0||nextStart<0||nextEnd<0)throw new Error("No se encontró motor de progresión Pugna");
 const ctx={};vm.createContext(ctx);
 vm.runInContext(html.slice(recipeStart,nextStart),ctx);
 vm.runInContext(html.slice(nextStart,nextEnd),ctx);
 const build=[
  {name:"Arcane Boots",heroSpecific:true,heroKey:"npc_dota_hero_pugna|Mid",stage:"Núcleo",why:"Maná"},
  {name:"Aether Lens",heroSpecific:true,heroKey:"npc_dota_hero_pugna|Mid",stage:"Núcleo",why:"Alcance"},
  {name:"Kaya",heroSpecific:true,heroKey:"npc_dota_hero_pugna|Mid",stage:"Avanzada",score:2.1,pugnaScore:2.1},
  {name:"Kaya and Sange",heroSpecific:true,heroKey:"npc_dota_hero_pugna|Mid",stage:"Cierre",score:5,pugnaScore:5,cost:4200},
  {name:"Spirit Vessel",heroSpecific:true,heroKey:"npc_dota_hero_pugna|Mid",stage:"Situacional",score:3.2,pugnaScore:3.2,cost:2780}
 ];
 const run=state=>ctx.getNextPurchase(build,{minute:state.minute??25,gold:state.gold??2000,owned:state.owned||[],components:state.components||[],problem:state.problem||"none"});
 const early=run({});
 if(early.target?.name!=="Arcane Boots")throw new Error("Pugna debe comenzar por Arcane Boots");
 const lens=run({owned:["Arcane Boots"]});
 if(lens.target?.name!=="Aether Lens")throw new Error("Tras Arcane Boots debe avanzar a Aether Lens");
 const urgentBuild=build.map(x=>x.name==="Spirit Vessel"?{...x,score:5.4,pugnaScore:5.4}:x);
 const urgent=ctx.getNextPurchase(urgentBuild,{minute:25,gold:2000,owned:[],components:[],problem:"enemy:alchemist"});
 if(urgent.target?.name!=="Spirit Vessel")throw new Error("Una amenaza de sustain seleccionada debe adelantar Spirit Vessel");
 const upgrade=run({minute:33,owned:["Arcane Boots","Aether Lens","Kaya"]});
 if(upgrade.target?.name!=="Kaya and Sange"||upgrade.name!=="Sange")throw new Error("Con Kaya adquirida, la mejora debe pedir Sange y proponer Kaya and Sange");
 const consumed=vm.runInContext('itemRecipes["Kaya and Sange"].filter(p=>p.name!=="Kaya")',ctx);
 if(consumed.length!==1||consumed[0].name!=="Sange")throw new Error("La receta de mejora debe reconocer Kaya como base ya adquirida y solicitar solo Sange");
 const finished=run({minute:33,owned:["Arcane Boots","Aether Lens","Kaya","Kaya and Sange"]});
 if(finished.name==="Kaya and Sange")throw new Error("La mejora completada no debe volver a recomendarse");
 console.log("OK: progresión del núcleo Pugna, prioridad situacional y evolución Kaya → Kaya and Sange");
})();

 
// Situational inventory priority follows the selected problem without overriding manually placed slots.
(()=>{
 const start=appHtml.indexOf("function renderHeroInventory(state,hero=null,role=\"\"){");
 const end=appHtml.indexOf("\nfunction renderItemCards(items){",start);
 if(start<0||end<0)throw new Error("No se encontró render de inventario");
 const source=appHtml.slice(start,end);
 for(const marker of ['"enemy:alchemist":"Spirit Vessel"','"issue:initiation":"Aeon Disk"','"issue:control":"Black King Bar"','"issue:magic":"Glimmer Cape"','if(situationalFirst&&owned.includes(situationalFirst))phaseNames.unshift','const manual=owned.filter(name=>["main","backpack","reserve"].includes(zones[name]))']) {
  if(!source.includes(marker))throw new Error("El orden situacional del inventario no contempla "+marker);
 }
 console.log("OK: prioridad situacional del inventario y preservación de ubicaciones manuales");
})();


// Progresión común para rutas individuales no cubiertas por excepciones históricas.
// Drow y Luna deben avanzar por su ruta core en orden; Anti-Mage conserva su ruta específica.
// Tras completar el núcleo, el mercado continúa con situacionales y permite adelantar una amenaza explícita.
(()=>{
 const purchaseStart=appHtml.indexOf("const itemRecipes={");
 const purchaseEnd=appHtml.indexOf("\nfunction pugnaFinalBuild",purchaseStart);
 if(purchaseStart<0||purchaseEnd<0)throw new Error("No se encontró el motor común de compras");
 const ctx={};vm.createContext(ctx);
 vm.runInContext(appHtml.slice(purchaseStart,purchaseEnd),ctx);
 const route=(hero,names)=>names.map((name,index)=>({
  name,heroSpecific:true,heroKey:hero+"|Carry",routeIndex:index,
  stage:index<2?"Inicio":"Medio",why:"Prueba de progresión"
 }));
 for(const [hero,names] of [
  ["npc_dota_hero_drow_ranger",["Power Treads","Dragon Lance","Hurricane Pike","Manta Style"]],
  ["npc_dota_hero_luna",["Power Treads","Manta Style","Black King Bar"]],
  ["npc_dota_hero_antimage",["Power Treads","Battle Fury","Yasha","Manta Style"]]
 ]){
  const items=route(hero,names).concat([{name:"Butterfly",stage:"Avanzada",score:5,why:"Situacional"}]);
  let owned=[];
  for(const expected of names){
   const next=ctx.getNextPurchase(items,{minute:20,gold:2000,owned,components:[],problem:"none"});
   if(next.target?.name!==expected)throw new Error(hero+": se esperaba "+expected+" y se recomendó "+(next.target?.name||next.name));
   owned=[...owned,expected];
  }
  const late=ctx.getNextPurchase(items,{minute:35,gold:2000,owned,components:[],problem:"none"});
  if(late.target?.name!=="Butterfly")throw new Error(hero+": agotó la ruta sin ofrecer la respuesta situacional restante");
 }
 const threatRoute=route("npc_dota_hero_drow_ranger",["Power Treads","Dragon Lance","Hurricane Pike"]);
 const threat=[...threatRoute,{name:"Aeon Disk",stage:"Avanzada",score:7.2,threatSpecific:true,why:"Respuesta urgente"}];
 const interrupted=ctx.getNextPurchase(threat,{minute:20,gold:2000,owned:[],components:[],problem:"enemy:axe"});
 if(interrupted.target?.name!=="Aeon Disk")throw new Error("Una amenaza explícita de alta prioridad debe poder adelantar el core");
 const passive=ctx.getNextPurchase(threat,{minute:20,gold:2000,owned:[],components:[],problem:"none"});
 if(passive.target?.name!=="Power Treads")throw new Error("La presencia de una amenaza sin problema seleccionado no debe romper el core");
 if(!appHtml.includes('const isAntiMage=build.some(x=>x.heroKey==="npc_dota_hero_antimage|Carry"||x.heroKey==="npc_dota_hero_antimage|Mid")'))throw new Error("La ruta especial de Anti-Mage debe identificarse por héroe y posición, no por nombres de objetos compartidos");
 console.log("OK: progresión común Drow/Luna/Anti-Mage, continuidad situacional y prioridad explícita");
 // El mercado nunca debe presentar como gratuito un objeto cuyo precio no está catalogado.
 const noRecipe=ctx.getNextPurchase([{name:"Objeto sin receta ni coste confirmado",heroSpecific:true,heroKey:"npc_dota_hero_drow_ranger|Carry",routeIndex:0,stage:"Medio",why:"Objetivo de prueba"}],{minute:20,gold:0,owned:[],components:[],problem:"none"});
 if(noRecipe.kind!=="goal"||noRecipe.cost!==null||noRecipe.affordable!==null)throw new Error("Un objeto sin receta/precio no debe aparecer como gratuito ni como comprable con cero oro");
 const knownCost=ctx.getNextPurchase([{name:"Objeto con coste",heroSpecific:true,heroKey:"npc_dota_hero_drow_ranger|Carry",routeIndex:0,stage:"Medio",cost:1800,why:"Objetivo de prueba"}],{minute:20,gold:500,owned:[],components:[],problem:"none"});
 if(knownCost.kind!=="goal"||knownCost.cost!==1800||knownCost.remaining!==1300||knownCost.affordable!==false)throw new Error("El mercado debe calcular correctamente el oro faltante para un objeto completo");
 const recipeProgress=ctx.getNextPurchase([{name:"Aether Lens",heroSpecific:true,heroKey:"npc_dota_hero_drow_ranger|Carry",routeIndex:0,stage:"Medio",why:"Receta"}],{minute:20,gold:600,owned:[],components:["Energy Booster"],problem:"none"});
 if(recipeProgress.kind!=="component"||recipeProgress.name!=="Void Stone"||recipeProgress.cost!==700||recipeProgress.remaining!==100||recipeProgress.affordable!==false)throw new Error("El mercado debe descontar componentes ya adquiridos y calcular el faltante del siguiente componente");
 const upgradeProgress=ctx.getNextPurchase([{name:"Kaya and Sange",heroSpecific:true,heroKey:"npc_dota_hero_drow_ranger|Carry",routeIndex:0,stage:"Medio",why:"Evolución"}],{minute:33,gold:1000,owned:["Kaya"],components:[],problem:"none"});
 if(upgradeProgress.kind!=="component"||upgradeProgress.name!=="Sange"||upgradeProgress.remaining!==1100)throw new Error("La evolución debe reconocer Kaya como objeto base y pedir solo Sange con su oro faltante");
 console.log("OK: mercado universal — precios desconocidos no se convierten en cero, componentes descontados y evolución incremental");
 // El motor debe conservar un pool completo aunque la interfaz visual limite sus tarjetas.
 const longRoute=Array.from({length:24},(_,i)=>({name:"Core item "+(i+1),heroSpecific:true,heroKey:"npc_dota_hero_fixture|Carry",routeIndex:i,stage:"Medio",score:3,why:"Ruta larga de regresión"}));
 const lateItems=[{name:"Situational alpha",stage:"Avanzada",score:3,why:"Situacional"},{name:"Situational beta",stage:"Avanzada",score:2,why:"Situacional"}];
 const fullPool=[...longRoute,...lateItems];
 let longOwned=[];
 for(let i=0;i<24;i++){
  const next=ctx.getNextPurchase(fullPool,{minute:24,gold:500,owned:longOwned,components:[],problem:"none"});
  if(next.target?.name!=="Core item "+(i+1))throw new Error("El mercado debe recorrer el objetivo "+(i+1)+" de una ruta de 24 objetos");
  longOwned.push("Core item "+(i+1));
 }
 const afterLongCore=ctx.getNextPurchase(fullPool,{minute:35,gold:500,owned:longOwned,components:[],problem:"none"});
 if(afterLongCore.target?.name!=="Situational alpha")throw new Error("El mercado debe continuar con situacionales después de completar una ruta larga");
 if(!appHtml.includes("marketPool:scores")||!appHtml.includes("...(adaptive.marketPool||[])"))throw new Error("El informe debe alimentar el mercado con el catálogo completo y no solo con las siete tarjetas visibles");
 console.log("OK: mercado sin límite de siete recomendaciones — 24 objetivos core y continuidad situacional");
})();

// Recursive item-recipe regression suite (7.41f)
(() => {
 const recipeStart=appHtml.indexOf("const itemRecipes={");
 const recipeEnd=appHtml.indexOf("\nfunction getNextPurchase(",recipeStart);
 if(recipeStart<0||recipeEnd<0)throw new Error("No se encontró el motor de recetas para probar");
 const recipeContext={document:{querySelectorAll:()=>[]}};
 vm.createContext(recipeContext);
 vm.runInContext(appHtml.slice(recipeStart,recipeEnd),recipeContext);
 const recipes=vm.runInContext("itemRecipes",recipeContext);
 const missing=(name,owned=[],components=[])=>vm.runInContext(
  "getMissingRecipeParts("+JSON.stringify(name)+",new Set("+JSON.stringify(owned)+"),new Set("+JSON.stringify(components)+"))",
  recipeContext
 );
 const total=name=>(recipes[name]||[]).reduce((sum,part)=>sum+part.cost*(part.quantity||1),0);
 const expected={
  "Battle Fury":3900,"Yasha":2100,"Sange":2100,"Manta Style":4650,
  "Arcane Boots":1500,"Kaya and Sange":4200,"Yasha and Kaya":4200,
  "Sange and Yasha":4200,"Shiva’s Guard":4500,"Glimmer Cape":2150,
  "Force Staff":2200,"Black King Bar":4050,"Dragon Lance":2000,"Hurricane Pike":4550
 };
 for(const [name,cost] of Object.entries(expected)){
  if(total(name)!==cost)throw new Error(name+" debe sumar "+cost+" de oro, suma encontrada: "+total(name));
 }
 const mantaFromPieces=missing("Manta Style",[],["Blade of Alacrity","Band of Elvenskin","Receta de Yasha"]);
 const mantaNames=mantaFromPieces.map(x=>x.name).sort().join("|");
 if(mantaNames!=="Diadem|Receta de Manta Style")throw new Error("Manta debe reconocer la Yasha construida a partir de sus componentes: "+mantaNames);
 const mantaFromYasha=missing("Manta Style",["Yasha"],[]);
 if(mantaFromYasha.some(x=>x.name==="Yasha"||x.name==="Blade of Alacrity"))throw new Error("Manta no debe volver a pedir Yasha si ya está en el inventario");
 const kayaUpgrade=missing("Kaya and Sange",["Kaya"],["Sange"]);
 if(kayaUpgrade.length)throw new Error("Kaya + Sange deben completar los componentes de Kaya and Sange");
 const battleFury=missing("Battle Fury",["Perseverance"],["Quelling Blade","Receta de Battle Fury"]);
 if(battleFury.length!==1||battleFury[0].name!=="Broadsword"||battleFury[0].quantity!==2)throw new Error("Battle Fury debe representar las dos Broadswords como una cantidad de dos");
 const quantities=vm.runInContext("getRecipeComponentQuantities()",recipeContext);
 if(quantities.get("Broadsword")!==2)throw new Error("El selector de componentes debe comunicar que se necesitan dos Broadswords");
 const consumeFromCompleteYasha=vm.runInContext('getRecipePartsForConsumption("Manta Style",new Set(["Yasha"]),new Set())',recipeContext);
 if(!consumeFromCompleteYasha.includes("Yasha")||consumeFromCompleteYasha.includes("Blade of Alacrity"))throw new Error("Al completar Manta debe consumir Yasha como objeto completo, no sus subcomponentes");
 const consumeFromYashaParts=vm.runInContext('getRecipePartsForConsumption("Manta Style",new Set(),new Set(["Blade of Alacrity","Band of Elvenskin","Receta de Yasha"]))',recipeContext);
 if(!consumeFromYashaParts.includes("Blade of Alacrity")||!consumeFromYashaParts.includes("Receta de Yasha"))throw new Error("Al completar Manta debe consumir las piezas de Yasha si no se registró como objeto completo");
 console.log("OK: recetas 7.41f, expansión recursiva, cantidades duplicadas y consumo de componentes");
})();
