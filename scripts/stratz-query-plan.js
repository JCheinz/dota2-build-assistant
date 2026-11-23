"use strict";

const POSITIONS = ["POSITION_1", "POSITION_2", "POSITION_3", "POSITION_4", "POSITION_5"];
const SELECTIONS = [
  { alias: "startingItems", field: "itemStartingPurchase", args: { heroId: "$heroId", positionIds: "POSITION" }, fields: ["itemId", "instance", "wasGiven", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "earlyItems", field: "itemFullPurchase", args: { heroId: "$heroId", minTime: "1", maxTime: "15", matchLimit: "0", positionIds: "POSITION" }, fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "midItems", field: "itemFullPurchase", args: { heroId: "$heroId", minTime: "16", maxTime: "30", matchLimit: "0", positionIds: "POSITION" }, fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "lateItems", field: "itemFullPurchase", args: { heroId: "$heroId", minTime: "31", maxTime: "75", matchLimit: "0", positionIds: "POSITION" }, fields: ["itemId", "instance", "time", "matchCount", "winCount", "winsAverage", "position"] },
  { alias: "boots", field: "itemBootPurchase", args: { heroId: "$heroId", positionIds: "POSITION" }, fields: ["itemId", "instance", "time", "timeAverage", "matchCount", "winCount", "winAverage", "position"] },
  { alias: "neutralItems", field: "itemNeutral", args: { heroId: "$heroId", positionIds: "POSITION" }, fields: ["itemId", "matchCount", "winCount", "equippedMatchCount", "equippedMatchWinCount", "position"] },
  { alias: "talents", field: "talent", args: { heroId: "$heroId", positionIds: "POSITION" }, fields: ["abilityId", "matchCount", "winCount", "time", "winsAverage", "timeAverage", "position"] },
  { alias: "abilityMinLevel", field: "abilityMinLevel", args: { heroId: "$heroId", positionIds: "POSITION" }, fields: ["abilityId", "level", "matchCount", "winCount", "position"] },
  { alias: "abilityMaxLevel", field: "abilityMaxLevel", args: { heroId: "$heroId", positionIds: "POSITION" }, fields: ["abilityId", "level", "matchCount", "winCount", "position"] }
];

function buildProbeQuery(schema, position) {
  if (!POSITIONS.includes(position)) throw new Error("Posición STRATZ inválida: " + position);
  if (!schema || !Array.isArray(schema.candidates)) throw new Error("Auditoría de esquema STRATZ inválida.");
  const queryFields = [], included = [], missing = [];
  for (const entry of SELECTIONS) {
    const candidate = schema.candidates.find(x => x.name === entry.field);
    if (!candidate) { missing.push(entry.alias + ":field"); continue; }
    const argsAvailable = new Set((candidate.args || []).map(x => x.name));
    const args = [];
    for (const [name, value] of Object.entries(entry.args)) {
      if (!argsAvailable.has(name)) missing.push(entry.alias + ":arg:" + name);
      else args.push(name + ": " + (value === "POSITION" ? "[" + position + "]" : value));
    }
    const fieldsAvailable = new Set((candidate.fields || []).map(x => typeof x === "string" ? x : x.name));
    const selected = entry.fields.filter(name => fieldsAvailable.has(name));
    for (const name of entry.fields) if (!fieldsAvailable.has(name)) missing.push(entry.alias + ":field:" + name);
    if (selected.length) {
      queryFields.push(entry.alias + ":" + entry.field + "(" + args.join(", ") + "){" + selected.join(" ") + "}");
      included.push({ position, alias: entry.alias, field: entry.field, args: argsAvailable.size, selected });
    }
  }
  if (missing.length) throw new Error("Esquema STRATZ incompleto para " + position + "; faltan " + missing.join(", "));
  if (queryFields.length !== SELECTIONS.length) throw new Error("Plan STRATZ incompleto: " + queryFields.length + "/" + SELECTIONS.length);
  return {
    position,
    query: "query PugnaPositionAudit($heroId: Short!) { heroStats { " + queryFields.join("\n") + " } }",
    included
  };
}

module.exports = { POSITIONS, SELECTIONS, buildProbeQuery };
