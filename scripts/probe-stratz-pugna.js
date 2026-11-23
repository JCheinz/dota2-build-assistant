"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");

const schemaPath = path.resolve("data/stratz-schema-audit.json");
const HERO = { name: "Pugna", id: 45, position: "POSITION_2" };

const selections = [
  { alias: "startingItems", field: "itemStartingPurchase", args: "heroId: $heroId, positionIds: [$position]", fields: ["itemId", "instance", "wasGiven", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "earlyItems", field: "itemFullPurchase", args: "heroId: $heroId, minTime: 1, maxTime: 15, positionIds: [$position]", fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "midItems", field: "itemFullPurchase", args: "heroId: $heroId, minTime: 16, maxTime: 30, positionIds: [$position]", fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "lateItems", field: "itemFullPurchase", args: "heroId: $heroId, minTime: 31, maxTime: 75, positionIds: [$position]", fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "boots", field: "itemBootPurchase", args: "heroId: $heroId, positionIds: [$position]", fields: ["itemId", "instance", "time", "timeAverage", "matchCount", "winCount", "winAverage", "position"] },
  { alias: "neutralItems", field: "itemNeutral", args: "heroId: $heroId, positionIds: [$position]", fields: ["itemId", "matchCount", "winCount", "equippedMatchCount", "equippedMatchWinCount", "position"] },
  { alias: "talents", field: "talent", args: "heroId: $heroId, positionIds: [$position]", fields: ["abilityId", "matchCount", "winCount", "time", "winsAverage", "timeAverage", "position"] },
  { alias: "abilityMinLevel", field: "abilityMinLevel", args: "heroId: $heroId, positionIds: [$position]", fields: ["abilityId", "level", "matchCount", "winCount", "position"] },
  { alias: "abilityMaxLevel", field: "abilityMaxLevel", args: "heroId: $heroId, positionIds: [$position]", fields: ["abilityId", "level", "matchCount", "winCount", "position"] }
];

async function main() {
  if (!fs.existsSync(schemaPath)) throw new Error("Falta auditoría de esquema.");
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const included = [];
  const queryFields = [];

  for (const entry of selections) {
    const candidate = schema.candidates.find(x => x.name === entry.field);
    if (!candidate) continue;
    const heroArg = candidate.args.find(x => x.name === "heroId");
    const positionArg = candidate.args.find(x => x.name === "positionIds");
    if (!heroArg || !positionArg) continue;
    const available = entry.fields.filter(name => candidate.fields.some(x => (typeof x === "string" ? x : x.name) === name));
    if (!available.length) continue;
    queryFields.push(entry.alias + ":" + entry.field + "(" + entry.args + "){" + available.join(" ") + "}");
    included.push({ alias: entry.alias, field: entry.field, selected: available });
  }

  if (!queryFields.length) throw new Error("El esquema no ofrece campos consultables para Pugna y su posición.");
  const heroType = schema.candidates.find(x => x.name === included[0].field).args.find(x => x.name === "heroId").type.replace(/!$/, "");
  const query = `query PugnaPositionAudit($heroId: ${heroType}!, $position: MatchPlayerPositionType!) {
    heroStats { ${queryFields.join("\n")} }
  }`;

  const response = await createClient().graphql(query, { heroId: HERO.id, position: HERO.position });
  const data = response.heroStats || {};
  const counts = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value.length : null]));
  const hasAnyData = Object.values(data).some(value => Array.isArray(value) && value.length > 0);
  const output = {
    hero: HERO.name,
    heroId: HERO.id,
    position: HERO.position,
    source: "STRATZ GraphQL",
    queriedAt: new Date().toISOString(),
    schemaAudit: schema.inspectedAt,
    queryPlan: included,
    counts,
    data,
    hasAnyData
  };

  fs.mkdirSync(path.resolve("data"), { recursive: true });
  fs.writeFileSync(path.resolve("data/stratz-pugna-probe.json"), JSON.stringify(output, null, 2) + "\n");
  console.log(JSON.stringify(output, null, 2));
  if (!hasAnyData) throw new Error("STRATZ no devolvió registros para Pugna en " + HERO.position + "; no se generaron recomendaciones.");
  if (!data.abilityMinLevel?.length && !data.abilityMaxLevel?.length) {
    throw new Error("No hay registros de habilidades por nivel; Pugna aún no puede considerarse validada.");
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
