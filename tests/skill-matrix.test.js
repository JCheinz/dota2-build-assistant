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
