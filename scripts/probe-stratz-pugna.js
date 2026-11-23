"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");

const schemaPath = path.resolve("data/stratz-schema-audit.json");

function graphType(type) {
  return String(type || "").replace(/\s+/g, "");
}

async function main() {
  if (!fs.existsSync(schemaPath)) {
    throw new Error("Primero ejecutá npm run stratz:inspect para verificar el esquema real.");
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const required = [
    {
      name: "itemFullPurchase",
      args: ["heroId", "minTime", "maxTime"],
      fields: ["matchCount", "winCount", "winsAverage", "itemId"]
    },
    {
      name: "talent",
      args: ["heroId"],
      fields: ["matchCount", "winCount", "abilityId"]
    }
  ];

  for (const need of required) {
    const found = schema.candidates.find(candidate => candidate.name === need.name);
    if (!found) {
      throw new Error("El esquema actual no confirma " + need.name + ". No se envían consultas especulativas.");
    }
    for (const arg of need.args) {
      if (!found.args.some(candidate => candidate.name === arg)) {
        throw new Error(need.name + " no confirma argumento " + arg);
      }
    }
    for (const field of need.fields) {
      if (!found.fields.includes(field)) {
        throw new Error(need.name + " no confirma campo de respuesta " + field);
      }
    }
  }

  const item = schema.candidates.find(candidate => candidate.name === "itemFullPurchase");
  const talent = schema.candidates.find(candidate => candidate.name === "talent");
  const argType = (field, name) => graphType(field.args.find(arg => arg.name === name).type);
  const heroType = argType(item, "heroId");

  if (heroType !== argType(talent, "heroId")) {
    throw new Error("El tipo de heroId no coincide entre consultas.");
  }

  // STRATZ schema requires heroId (Short!) for both fields.
  const minType = argType(item, "minTime");
  const maxType = argType(item, "maxTime");
  const query = `
    query PugnaBuildAudit($heroId: ${heroType}!, $minTime: ${minType}, $maxTime: ${maxType}) {
      heroStats {
        items: itemFullPurchase(heroId: $heroId, minTime: $minTime, maxTime: $maxTime) {
          matchCount
          winCount
          winsAverage
          itemId
        }
        talents: talent(heroId: $heroId) {
          matchCount
          winCount
          abilityId
        }
      }
    }
  `;

  const data = await createClient().graphql(query, {
    heroId: 45,
    minTime: 0,
    maxTime: 999
  });

  const output = {
    hero: "Pugna",
    heroId: 45,
    source: "STRATZ GraphQL",
    queriedAt: new Date().toISOString(),
    schemaAudit: schema.inspectedAt,
    data: data.heroStats || data
  };

  fs.mkdirSync(path.resolve("data"), { recursive: true });
  fs.writeFileSync(
    path.resolve("data/stratz-pugna-probe.json"),
    JSON.stringify(output, null, 2) + "\n"
  );
  console.log(JSON.stringify(output, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
