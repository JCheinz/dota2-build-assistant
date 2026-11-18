(function (root) {
  "use strict";
  const DEFAULT_BASE = "https://api.opendota.com/api";
  const ENDPOINTS = { abilities: "/constants/abilities", heroAbilities: "/constants/hero_abilities", heroes: "/constants/heroes" };
  const memoryCache = new Map();
  function firstDefined(object, keys) {
    for (const key of keys) if (object && object[key] !== undefined && object[key] !== null) return object[key];
    return null;
  }
  function asArray(value) { return Array.isArray(value) ? value : value == null ? [] : [value]; }
  function normalizeAbility(name, raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    return {
      id:name, name,
      displayName:firstDefined(source, ["dname","display_name","name"]) || name,
      description:firstDefined(source, ["desc","description"]) || "",
      lore:firstDefined(source, ["lore"]) || "",
      notes:asArray(firstDefined(source, ["notes"])),
      manaCost:firstDefined(source, ["mc","mana_cost","manaCost"]),
      cooldown:firstDefined(source, ["cd","cooldown"]),
      damage:firstDefined(source, ["dmg","damage"]),
      damageType:firstDefined(source, ["dmg_type","damage_type"]),
      castRange:firstDefined(source, ["cast_range","castRange"]),
      radius:firstDefined(source, ["radius","aoe","area_of_effect"]),
      behavior:firstDefined(source, ["behavior"]),
      targetTeam:firstDefined(source, ["target_team","targetTeam"]),
      targetType:firstDefined(source, ["target_type","targetType"]),
      targetFlags:firstDefined(source, ["target_flags","targetFlags"]),
      attributes:asArray(firstDefined(source, ["attrib","attributes"])),
      raw:source
    };
  }
  function normalizeHeroAbilityMap(heroAbilities, abilities) {
    const result = {};
    for (const [hero, entry] of Object.entries(heroAbilities || {})) {
      const slots = entry && Array.isArray(entry.abilities) ? entry.abilities : [];
      const talents = entry && Array.isArray(entry.talents) ? entry.talents : [];
      result[hero] = {
        hero,
        abilities:slots.filter(Boolean).map(name => ({id:name,data:abilities[name] || null,missingMetadata:!abilities[name]})),
        talents:talents.map(talent => {
          const name = talent && talent.name || talent;
          return {name,slot:talent && talent.name ? talent : null,data:abilities[name] || null,missingMetadata:!abilities[name]};
        })
      };
    }
    return result;
  }
  function buildDataset(payload, metadata) {
    const source = payload.abilities || {}, abilities = {};
    for (const [name, raw] of Object.entries(source)) abilities[name] = normalizeAbility(name, raw);
    const heroAbilities = normalizeHeroAbilityMap(payload.heroAbilities || {}, abilities);
    const heroes = Array.isArray(payload.heroes) ? payload.heroes : Object.values(payload.heroes || {});
    return {
      schemaVersion:1, source:metadata && metadata.source || "OpenDota constants",
      patch:metadata && metadata.patch || null, fetchedAt:metadata && metadata.fetchedAt || new Date().toISOString(),
      counts:{abilities:Object.keys(abilities).length,heroes:Object.keys(heroAbilities).length,heroCatalog:heroes.length},
      abilities,heroAbilities,heroes
    };
  }
  async function fetchJson(url, fetchImpl) {
    const response = await fetchImpl(url,{headers:{Accept:"application/json"}});
    if (!response || !response.ok) throw new Error("No se pudo obtener " + url + " (HTTP " + (response && response.status || "desconocido") + ")");
    return response.json();
  }
  async function load(options) {
    const opts=options || {}, fetchImpl=opts.fetch || root.fetch;
    if (typeof fetchImpl !== "function") throw new Error("Este entorno no dispone de fetch.");
    const base=(opts.baseUrl || DEFAULT_BASE).replace(/\/$/,"");
    if (!opts.force && memoryCache.has(base)) return memoryCache.get(base);
    const [abilities,heroAbilities,heroes]=await Promise.all([
      fetchJson(base+ENDPOINTS.abilities,fetchImpl),
      fetchJson(base+ENDPOINTS.heroAbilities,fetchImpl),
      fetchJson(base+ENDPOINTS.heroes,fetchImpl)
    ]);
    const dataset=buildDataset({abilities,heroAbilities,heroes},{source:"OpenDota constants API",patch:opts.patch || null});
    memoryCache.set(base,dataset);
    return dataset;
  }
  function getHeroSkills(dataset, heroKey) { return dataset && dataset.heroAbilities && dataset.heroAbilities[heroKey] || null; }
  function findAbility(dataset, name) { return dataset && dataset.abilities && dataset.abilities[name] || null; }
  function getCoverage(dataset) {
    const heroes=Object.values(dataset && dataset.heroAbilities || {});
    const slots=heroes.reduce((sum,hero)=>sum+hero.abilities.length,0);
    const missing=heroes.reduce((sum,hero)=>sum+hero.abilities.filter(skill=>skill.missingMetadata).length,0);
    return {heroes:heroes.length,abilitySlots:slots,missingMetadataSlots:missing,metadataCoverage:slots?Math.round((slots-missing)/slots*10000)/100:0};
  }
  const api={version:"1.0.0",sources:ENDPOINTS,load,buildDataset,normalizeAbility,getHeroSkills,findAbility,getCoverage};
  if (typeof module!=="undefined" && module.exports) module.exports=api;
  root.DotaSkillDataEngine=api;
})(typeof globalThis!=="undefined" ? globalThis : this);
