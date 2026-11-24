"use strict";
const assert = require("node:assert/strict");
const { safeName, hasCompleteEvidence, hasOnlyMismatchedPositionRows } = require("../scripts/stratz-batch-audit");
const { SELECTIONS } = require("../scripts/stratz-query-plan");

assert.equal(safeName("npc_dota_hero_ancient_apparition"), "npc-dota-hero-ancient-apparition");
assert.equal(safeName("Pugna"), "pugna");
assert.equal(safeName(""), "hero");

const validData = Object.fromEntries(SELECTIONS.map(entry => [entry.alias, []]));
assert.equal(hasCompleteEvidence({ data: validData }), true);
assert.equal(hasCompleteEvidence({ data: { ...validData, [SELECTIONS[0].alias]: null } }), false);
assert.equal(hasCompleteEvidence({ data: {} }), false);
assert.equal(hasCompleteEvidence(null), false);
assert.equal(hasOnlyMismatchedPositionRows({ startingItems: [{ itemId: 44, position: "POSITION_1" }] }, "POSITION_2"), true);
assert.equal(hasOnlyMismatchedPositionRows({ startingItems: [{ itemId: 44, position: "POSITION_2" }] }, "POSITION_2"), false);
assert.equal(hasOnlyMismatchedPositionRows({ startingItems: [] }, "POSITION_2"), false);

console.log("STRATZ batch audit tests passed.");
