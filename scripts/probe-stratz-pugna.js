"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");

const schemaPath = path.resolve("data/stratz-schema-audit.json");
const HERO = { name: "Pugna", id: 45 };
const POSITIONS = ["POSITION_1", "POSITION_2", "POSITION_3", "POSITION_4", "POSITION_5"];

const selections = [
  { alias: "startingItems", field: "itemStartingPurchase", args: "heroId: $heroId", fields: ["itemId", "instance", "wasGiven", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "earlyItems", field: "itemFullPurchase", args: "heroId: $heroId, minTime: 1, maxTime: 15, matchLimit: 0", fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "midItems", field: "itemFullPurchase", args: "heroId: $heroId, minTime: 16, maxTime: 30, matchLimit: 0", fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "lateItems", field: "itemFullPurchase", args: "heroId: $heroId, minTime: 31, maxTime: 75, matchLimit: 0", fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "boots", field: "itemBootPurchase", args: "heroId: $heroId", fields: ["itemId", "instance", "time", "timeAverage", "matchCount", "winCount", "winAverage", "position"] },
  { alias: "neutralItems", field: "itemNeutral", args: "heroId: $heroId", fields: ["itemId", "matchCount", "winCount", "equippedMatchCount", "equippedMatchWinCount", "position"] },
  { alias: "talents", field: "talent", args: "heroId: $heroId", fields: ["abilityId", "matchCount", "winCount", "time", "winsAverage", "timeAverage", "position"] },
  { alias: "abilityMinLevel", field: "abilityMinLevel", args: "heroId: $heroId", fields: ["abilityId", "level", "matchCount", "winCount", "position"] },
  { alias: "abilityMaxLevel", field: "abilityMaxLevel", args: "heroId: $heroId", fields: ["abilityId", "level", "matchCount", "winCount", "position"] }
];

async function main() {
  if (!fs.existsSync(schemaPath)) throw new Error("Falta auditoría de esquema.");
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const included = [];
  const queryFields = [];

  for (const position of POSITIONS) {
    for (const entry of selections) {
      const candidate = schema.candidates.find(x => x.name === entry.field);
      if (!candidate) continue;
      if (!candidate.args.some(x => x.name === "heroId")) continue;
      if (!candidate.args.some(x => x.name === "positionIds")) continue;
      const available = entry.fields.filter(name => candidate.fields.some(x => (typeof x === "string" ? x : x.name) === name));
      if (!available.length) continue;
      const alias = position.toLowerCase() + "_" + entry.alias;
      const args = entry.args + ", positionIds: [" + position + "]";
      queryFields.push(alias + ":" + entry.field + "(" + args + "){" + available.join(" ") + "}");
      included.push({ position, alias, field: entry.field, selected: available });
    }
  }

  if (!queryFields.length) throw new Error("El esquema no ofrece campos consultables para Pugna.");
  const query = `query PugnaAllPositionsAudit($heroId: Short!) { heroStats { ${queryFields.join("\n")} } }`;
  const response = await createClient().graphql(query, { heroId: HERO.id });
  const raw = response.heroStats || {};
  const byPosition = {};
  for (const position of POSITIONS) {
    const prefix = position.toLowerCase() + "_";
    byPosition[position] = {};
    for (const [key, value] of Object.entries(raw)) {
      if (!key.startsWith(prefix)) continue;
      const name = key.slice(prefix.length);
      byPosition[position][name] = value;
    }
  }
  const counts = Object.fromEntries(Object.entries(byPosition).map(([position, values]) => [
    position,
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Array.isArray(value) ? value.length : null]))
  ]));
  const output = {
    hero: HERO.name,
    heroId: HERO.id,
    positions: POSITIONS,
    source: "STRATZ GraphQL",
    queriedAt: new Date().toISOString(),
    schemaAudit: schema.inspectedAt,
    queryPlan: included,
    counts,
    data: byPosition
  };
  fs.mkdirSync(path.resolve("data"), { recursive: true });
  fs.writeFileSync(path.resolve("data/stratz-pugna-probe.json"), JSON.stringify(output, null, 2) + "\n");
  console.log(JSON.stringify(output, null, 2));

  const anyData = Object.values(byPosition).some(group => Object.values(group).some(value => Array.isArray(value) && value.length));
  if (!anyData) throw new Error("STRATZ no devolvió registros para Pugna en ninguna posición.");
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
