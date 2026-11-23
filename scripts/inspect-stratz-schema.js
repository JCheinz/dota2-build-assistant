"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");

const query = `
query MercadoInteligenteSchema {
  __schema {
    queryType { name }
    types {
      kind
      name
      fields {
        name
        args {
          name
          type {
            kind
            name
            ofType { kind name ofType { kind name ofType { kind name } } }
          }
        }
        type {
          kind
          name
          ofType { kind name ofType { kind name ofType { kind name } } }
        }
      }
    }
  }
}`;

function flatten(type) {
  return type?.name || flatten(type?.ofType) || null;
}

async function main() {
  const data = await createClient().graphql(query);
  const types = data.__schema.types || [];
  const typeByName = new Map(types.map(type => [type.name, type]));
  const queryType = typeByName.get(data.__schema.queryType.name);
  const heroStatsField = queryType?.fields?.find(field => field.name === "heroStats");
  const heroStatsTypeName = flatten(heroStatsField?.type);
  const heroStatsType = typeByName.get(heroStatsTypeName);

  const candidates = (heroStatsType?.fields || [])
    .filter(field => /item|talent|abilit|skill|build|hero/i.test(field.name))
    .map(field => {
      const returnType = flatten(field.type);
      const nested = typeByName.get(returnType);
      return {
        name: field.name,
        args: (field.args || []).map(arg => ({
          name: arg.name,
          type: flatten(arg.type)
        })),
        returnType,
        fields: (nested?.fields || []).map(child => child.name)
      };
    });

  const result = {
    source: "STRATZ GraphQL schema introspection",
    inspectedAt: new Date().toISOString(),
    queryType: data.__schema.queryType.name,
    heroStatsType: heroStatsTypeName,
    candidates
  };

  fs.mkdirSync(path.resolve("data"), { recursive: true });
  fs.writeFileSync(
    path.resolve("data/stratz-schema-audit.json"),
    JSON.stringify(result, null, 2) + "\n"
  );
  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
