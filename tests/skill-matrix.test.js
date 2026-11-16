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
