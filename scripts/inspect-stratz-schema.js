"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");
const query = `query MercadoInteligenteSchema { __schema { queryType { name } types { kind name enumValues { name } fields { name args { name type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } } }`;
function typeInfo(t) { if (!t) return null; if (t.kind === "NON_NULL") return typeInfo(t.ofType) + "!"; if (t.kind === "LIST") return "[" + typeInfo(t.ofType) + "]"; return t.name || null; }
function namedType(t) { return t?.name || namedType(t?.ofType) || null; }
async function main() {
 const data = await createClient().graphql(query); const types = data.__schema.types || []; const byName = new Map(types.map(t => [t.name,t]));
 const qt = byName.get(data.__schema.queryType.name); const hs = qt?.fields?.find(f => f.name === "heroStats"); const hsName = namedType(hs?.type); const hst = byName.get(hsName);
 const candidates = (hst?.fields || []).filter(f => /item|talent|abilit|skill|build|hero/i.test(f.name)).map(f => ({name:f.name,args:(f.args||[]).map(a=>({name:a.name,type:typeInfo(a.type),required:a.type?.kind==="NON_NULL"})),returnType:typeInfo(f.type),fields:(byName.get(namedType(f.type))?.fields||[]).map(c=>({name:c.name,type:typeInfo(c.type)}))}));
 const result={source:"STRATZ GraphQL schema introspection",inspectedAt:new Date().toISOString(),queryType:data.__schema.queryType.name,heroStatsType:hsName,heroStatsArgs:(hs?.args||[]).map(a=>({name:a.name,type:typeInfo(a.type),required:a.type?.kind==="NON_NULL"})),enums:Object.fromEntries(types.filter(t=>t.kind==="ENUM"&&/Position|Bracket/i.test(t.name)).map(t=>[t.name,(t.enumValues||[]).map(v=>v.name)])),candidates};
 fs.mkdirSync(path.resolve("data"),{recursive:true}); fs.writeFileSync(path.resolve("data/stratz-schema-audit.json"),JSON.stringify(result,null,2)+"\n"); console.log(JSON.stringify(result,null,2));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
