"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createClient } = require("./stratz-api-client");
const { POSITIONS, SELECTIONS, buildProbeQuery } = require("./stratz-query-plan");
const { normalizeStratzHeroPosition } = require("./stratz-normalize");

const HEROES_URL = "https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json";
const ITEMS_URL = "https://raw.githubusercontent.com/odota/dotaconstants/master/build/items.json";
const DATA_DIR = path.resolve("data/stratz-batch");
const SCHEMA_PATH = path.resolve("data/stratz-schema-audit.json");

function arg(name, fallback) {
  const prefix = "--" + name + "=";
  const found = process.argv.find(value => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}
function safeName(value) {
  return String(value || "hero").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("No se pudo descargar " + url + ": HTTP " + response.status);
  return response.json();
}
async function main() {
  const position = arg("position", "POSITION_1");
  const start = Number(arg("start", "0"));
  const limit = Number(arg("limit", "3"));
  const patch = arg("patch", "unverified");
  if (!POSITIONS.includes(position)) throw new Error("Posición inválida: " + position);
  if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit < 1 || limit > 127) {
    throw new Error("start/limit inválidos; limit debe estar entre 1 y 127.");
  }
  if (!fs.existsSync(SCHEMA_PATH)) throw new Error("Falta data/stratz-schema-audit.json; ejecutar npm run stratz:inspect.");
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  const heroesMap = await getJson(HEROES_URL);
  const heroes = Object.values(heroesMap).filter(h => h && Number.isInteger(Number(h.id)) && Number(h.id) > 0)
    .sort((a, b) => Number(a.id) - Number(b.id));
  const itemsById = await getJson(ITEMS_URL);
  const selected = heroes.slice(start, start + limit);
  if (!selected.length) throw new Error("El rango solicitado no contiene héroes. Catálogo: " + heroes.length);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const client = createClient();
  const progressPath = path.join(DATA_DIR, "progress-" + position.toLowerCase() + ".json");
  const progress = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : {
    source: "STRATZ GraphQL", position, patchScope: patch, catalogCount: heroes.length, completed: [], failed: []
  };
  console.log("Catálogo: " + heroes.length + " héroes; lote " + start + " a " + (start + selected.length - 1) + "; " + position);
  for (const hero of selected) {
    const heroId = Number(hero.id);
    const heroName = hero.localized_name || hero.name || ("Hero " + heroId);
    const slug = safeName(hero.name || heroName);
    const rawPath = path.join(DATA_DIR, slug + "-" + position.toLowerCase() + ".json");
    const normalizedPath = path.join(DATA_DIR, slug + "-" + position.toLowerCase() + "-normalized.json");
    if (fs.existsSync(rawPath) && fs.existsSync(normalizedPath)) {
      if (!progress.completed.includes(heroId)) progress.completed.push(heroId);
      console.log("SKIP " + heroName + " (" + heroId + "): ya existe evidencia raw y normalizada.");
      continue;
    }
    try {
      const plan = buildProbeQuery(schema, position);
      const response = await client.graphql(plan.query, { heroId });
      const raw = response.heroStats || {};
      const data = {};
      const malformed = [];
      for (const entry of SELECTIONS) {
        if (!Array.isArray(raw[entry.alias])) malformed.push(entry.alias);
        else data[entry.alias] = raw[entry.alias];
      }
      if (malformed.length) throw new Error("Respuesta incompleta: " + malformed.join(", "));
      if (!Object.values(data).some(rows => rows.length > 0)) throw new Error("STRATZ devolvió cero registros en los nueve grupos.");
      const queriedAt = new Date().toISOString();
      const evidence = {
        hero: heroName, heroInternalName: hero.name, heroId, position,
        source: "STRATZ GraphQL", queriedAt, patchScope: patch,
        schemaAudit: schema.inspectedAt, queryPlan: plan.included,
        counts: Object.fromEntries(Object.entries(data).map(([key, rows]) => [key, rows.length])),
        data
      };
      // Persist provider evidence first; normalization can be repeated without another API request.
      fs.writeFileSync(rawPath, JSON.stringify(evidence, null, 2) + "\n");
      const normalized = normalizeStratzHeroPosition(data, {
        position, patch, updatedAt: queriedAt, itemsById
      });
      fs.writeFileSync(normalizedPath, JSON.stringify({
        hero: heroName, heroId, position, ...normalized
      }, null, 2) + "\n");
      progress.completed = [...new Set([...progress.completed, heroId])];
      progress.failed = progress.failed.filter(item => item.heroId !== heroId);
      console.log("OK " + heroName + " (" + heroId + "): " + JSON.stringify(evidence.counts));
    } catch (error) {
      progress.failed = progress.failed.filter(item => item.heroId !== heroId);
      progress.failed.push({ heroId, hero: heroName, error: String(error.message || error).slice(0, 500) });
      console.error("FAIL " + heroName + " (" + heroId + "): " + (error.message || error));
    } finally {
      progress.updatedAt = new Date().toISOString();
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + "\n");
    }
  }
  console.log(JSON.stringify({
    position, catalogCount: heroes.length, batchStart: start, batchSize: selected.length,
    completedInManifest: progress.completed.length, failedInManifest: progress.failed.length,
    progressFile: progressPath
  }, null, 2));
  if (progress.failed.some(item => selected.some(hero => Number(hero.id) === item.heroId))) process.exitCode = 1;
}
if (require.main === module) main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
module.exports = { safeName, main };
