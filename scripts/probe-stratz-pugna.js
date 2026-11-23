"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");
const { POSITIONS, SELECTIONS, buildProbeQuery } = require("./stratz-query-plan");
const { normalizeStratzHeroPosition } = require("./stratz-normalize");
const ITEM_CONSTANTS_URL = "https://raw.githubusercontent.com/odota/dotaconstants/master/build/items.json";

const schemaPath = path.resolve("data/stratz-schema-audit.json");
const HERO = { name: "Pugna", id: 45 };
function arg(name, fallback) {
  const prefix = "--" + name + "=";
  const item = process.argv.find(x => x.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
}
function outputDate() { return new Date().toISOString(); }\nasync function main() {
  if (!fs.existsSync(schemaPath)) throw new Error("Falta auditoría de esquema; ejecutar primero npm run stratz:inspect.");
  const position = arg("position", "POSITION_1");
  const patch = arg("patch", "unverified");
  if (!POSITIONS.includes(position)) throw new Error("Posición inválida. Valores: " + POSITIONS.join(", "));
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const plan = buildProbeQuery(schema, position);
  const response = await createClient().graphql(plan.query, { heroId: HERO.id });
  const raw = response.heroStats || {};
  const data = {};
  const malformed = [];
  for (const entry of SELECTIONS) {
    const value = raw[entry.alias];
    if (!Array.isArray(value)) malformed.push(entry.alias);
    else data[entry.alias] = value;
  }
  if (malformed.length) throw new Error("Respuesta STRATZ incompleta para " + position + ": " + malformed.join(", "));
  const counts = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.length]));
  const output = {
    hero: HERO.name,
    heroId: HERO.id,
    position,
    source: "STRATZ GraphQL",
    queriedAt: new Date().toISOString(),
    schemaAudit: schema.inspectedAt,
    queryPlan: plan.included,
    counts,
    data
  };
  fs.mkdirSync(path.resolve("data"), { recursive: true });
  const outputPath = path.resolve("data", "stratz-pugna-" + position.toLowerCase() + ".json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
  console.log(JSON.stringify({ output: outputPath, hero: HERO.name, position, counts }, null, 2));
  const anyData = Object.values(data).some(value => value.length > 0);
  if (!anyData) throw new Error("STRATZ no devolvió registros para Pugna / " + position + ".");
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { HERO, main };
