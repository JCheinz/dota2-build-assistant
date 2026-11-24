"use strict";

const POSITION_ROLE = {
  POSITION_1: "Carry",
  POSITION_2: "Mid",
  POSITION_3: "Offlane",
  POSITION_4: "Support 4",
  POSITION_5: "Support 5"
};
const ITEM_GROUPS = [
  ["startingItems", "starting"],
  ["earlyItems", "early"],
  ["midItems", "core"],
  ["lateItems", "late"],
  ["boots", "early"],
  ["neutralItems", "neutral"]
];
const OBSERVATION_GROUPS = ["abilityMinLevel", "abilityMaxLevel", "talents"];

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
function indexItems(items) {
  if (Array.isArray(items)) return new Map(items.filter(Boolean).map(item => [String(item.id), item]));
  return new Map(Object.entries(items || {}).map(([key, item]) => [String(item && item.id !== undefined ? item.id : key), item]));
}
function normalizeStratzHeroPosition(raw, options = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Respuesta STRATZ inválida.");
  const position = options.position;
  const role = POSITION_ROLE[position];
  if (!role) throw new Error("Posición STRATZ desconocida: " + position);
  const patch = String(options.patch || "").trim();
  if (!patch) throw new Error("Debe indicarse el parche de referencia; no se infiere de la respuesta.");
  const itemIndex = indexItems(options.itemsById);
  const updatedAt = options.updatedAt || null;
  const items = { starting: [], laning: [], early: [], core: [], late: [], situational: [], neutral: [] };
  const unmappedItems = [];
  const seen = new Set();
  const readRows = key => {
    const rows = raw[key];
    if (rows === undefined || rows === null) return [];
    if (!Array.isArray(rows)) throw new Error("Campo STRATZ no-array: " + key);
    return rows;
  };
  const assertPosition = (row, field) => {
    if (row.position && row.position !== position) {
      throw new Error("STRATZ devolvió " + row.position + " dentro de " + field + " solicitado para " + position);
    }
  };
  for (const [field, stage] of ITEM_GROUPS) {
    for (const row of readRows(field)) {
      if (!row || typeof row !== "object") continue;
      assertPosition(row, field);
      const id = numberOrNull(row.itemId);
      const meta = id === null ? null : itemIndex.get(String(id));
      if (!meta) {
        unmappedItems.push({ field, itemId: id, matchCount: numberOrNull(row.matchCount) });
        continue;
      }
      const key = String(id) + ":" + stage;
      if (seen.has(key)) continue;
      seen.add(key);
      const matchCount = numberOrNull(row.matchCount);
      const winCount = numberOrNull(row.winCount);
      items[stage].push({
        id,
        name: meta.dname || meta.display_name || meta.name || meta.localized_name || meta.key || null,
        stage,
        matchCount,
        winRate: matchCount > 0 && winCount !== null ? winCount / matchCount : null,
        averageMinute: field === "boots"
          ? (numberOrNull(row.timeAverage ?? row.time) === null ? null : numberOrNull(row.timeAverage ?? row.time) / 60)
          : numberOrNull(row.time),
        source: "STRATZ",
        reason: row.wasGiven === true ? "Objeto otorgado; no cuenta como compra" : null
      });
    }
  }
  const skillObservations = [];
  for (const field of ["abilityMinLevel", "abilityMaxLevel"]) {
    for (const row of readRows(field)) {
      if (!row || typeof row !== "object") continue;
      assertPosition(row, field);
      skillObservations.push({
        kind: field,
        abilityId: numberOrNull(row.abilityId),
        level: numberOrNull(row.level),
        matchCount: numberOrNull(row.matchCount),
        winCount: numberOrNull(row.winCount),
        position
      });
    }
  }
  const talentObservations = readRows("talents").filter(Boolean).map(row => {
    assertPosition(row, "talents");
    return {
      abilityId: numberOrNull(row.abilityId),
      matchCount: numberOrNull(row.matchCount),
      winCount: numberOrNull(row.winCount),
      time: numberOrNull(row.time),
      winsAverage: numberOrNull(row.winsAverage),
      timeAverage: numberOrNull(row.timeAverage),
      position
    };
  });
  const notes = [];
  if (unmappedItems.length) notes.push("Hay " + unmappedItems.length + " registros de objetos sin correspondencia con el catálogo; se conservaron como incidencias.");
  if (skillObservations.length) notes.push("STRATZ entregó observaciones agregadas de nivel mínimo/máximo; no se interpretan como una secuencia de subida por nivel.");
  if (talentObservations.length) notes.push("Las elecciones de talentos se conservan como observaciones por ID; no se asigna tier hasta cruzar cada ID con los talentos oficiales del héroe.");
  return {
    role,
    source: "STRATZ",
    patch,
    updatedAt,
    sampleSize: 0,
    winRate: null,
    items,
    skillBuild: [],
    talents: [],
    skillObservations,
    talentObservations,
    unmappedItems,
    notes,
    coverage: {
      items: Object.values(items).some(rows => rows.length > 0),
      skills: false,
      talents: false
    }
  };
}
module.exports = { POSITION_ROLE, normalizeStratzHeroPosition };
