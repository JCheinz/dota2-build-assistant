"use strict";
const assert = require("node:assert/strict");
const { normalizeStratzHeroPosition } = require("../scripts/stratz-normalize");

const raw = {
  startingItems: [{ itemId: 44, matchCount: 100, winCount: 55, wasGiven: false, position: "POSITION_1" }],
  earlyItems: [{ itemId: 51, matchCount: 80, winCount: 44, time: 420, position: "POSITION_1" }],
  midItems: [{ itemId: 116, matchCount: 60, winCount: 33, time: 1200, position: "POSITION_1" }],
  lateItems: [],
  boots: [{ itemId: 52, matchCount: 75, winCount: 40, timeAverage: 500, position: "POSITION_1" }],
  neutralItems: [{ itemId: 700, matchCount: 30, winCount: 16, position: "POSITION_1" }],
  abilityMinLevel: [{ abilityId: 501, level: 1, matchCount: 70, winCount: 39, position: "POSITION_1" }],
  abilityMaxLevel: [{ abilityId: 502, level: 4, matchCount: 65, winCount: 37, position: "POSITION_1" }],
  talents: [{ abilityId: 9001, matchCount: 40, winCount: 22, time: 600, position: "POSITION_1" }]
};
const itemsById = {
  44: { id: 44, dname: "Tango" },
  51: { id: 51, dname: "Boots of Speed" },
  52: { id: 52, dname: "Boots of Speed (boots group)" },
  116: { id: 116, dname: "Blink Dagger" },
  700: { id: 700, dname: "Neutral Item" }
};
const normalized = normalizeStratzHeroPosition(raw, {
  position: "POSITION_1",
  patch: "7.42",
  updatedAt: "2026-11-23T00:00:00.000Z",
  itemsById
});
assert.equal(normalized.role, "Carry");
assert.equal(normalized.source, "STRATZ");
assert.equal(normalized.patch, "7.42");
assert.equal(normalized.items.starting[0].name, "Tango");
assert.equal(normalized.items.early[0].name, "Boots of Speed");
assert.equal(normalized.items.core[0].name, "Blink Dagger");
assert.equal(normalized.items.neutral[0].id, 700);
assert.equal(normalized.items.early[0].winRate, 0.55);
assert.equal(normalized.items.starting[0].evidenceQuality.confidence, "high");
assert.equal(normalized.items.starting[0].evidenceQuality.eligibleForRecommendation, true);
assert.equal(normalized.items.early[1].averageMinute, 500 / 60, "boot timeAverage is seconds and must be stored as minutes");
assert.equal(normalized.skillBuild.length, 0, "min/max level aggregates are not a per-level build");
assert.equal(normalized.talents.length, 0, "talent IDs require canonical tier mapping first");
assert.equal(normalized.skillObservations.length, 2);
assert.equal(normalized.talentObservations[0].abilityId, 9001);
assert.equal(normalized.coverage.skills, false);
assert.equal(normalized.coverage.talents, false);
assert.throws(() => normalizeStratzHeroPosition(raw, { position: "POSITION_6", patch: "7.42", itemsById }), /Posición STRATZ desconocida/);
assert.throws(() => normalizeStratzHeroPosition(raw, { position: "POSITION_1", itemsById }), /Debe indicarse el parche/);
const mismatched = normalizeStratzHeroPosition({ ...raw, earlyItems: [{ itemId: 51, matchCount: 25, position: "POSITION_2" }] }, { position: "POSITION_1", patch: "7.42", itemsById });
assert.equal(mismatched.items.early.some(item => item.id === 51), false, "rows from another role must not enter recommendations");
assert.equal(mismatched.items.early.some(item => item.id === 52), true, "valid boots evidence must remain available");
assert.equal(mismatched.mismatchedPositionRows.length, 1);
assert.match(mismatched.notes.join(" "), /no se mezclaron roles/);
assert.throws(() => normalizeStratzHeroPosition({ ...raw, talents: {} }, { position: "POSITION_1", patch: "7.42", itemsById }), /no-array: talents/);
const library = require("../hero-library-engine");
const heroDataset = { heroes: [{ id: 45, name: "npc_dota_hero_pugna", localized_name: "Pugna" }] };
const built = library.buildHeroLibrary(heroDataset);
assert.equal(library.mergeProviderHero(built, "npc_dota_hero_pugna", "Carry", normalized), true);
const stored = library.getRoleBuild(built, "Pugna", "Carry");
assert.equal(stored.skillObservations.length, 2);
assert.equal(stored.talentObservations.length, 1);
assert.equal(stored.coverage.skills, false);
console.log("STRATZ normalizer tests passed.");
