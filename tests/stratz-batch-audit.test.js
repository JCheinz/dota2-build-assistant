"use strict";
const assert = require("node:assert/strict");
const { safeName } = require("../scripts/stratz-batch-audit");
assert.equal(safeName("npc_dota_hero_ancient_apparition"), "npc-dota-hero-ancient-apparition");
assert.equal(safeName("Pugna"), "pugna");
console.log("STRATZ batch audit tests passed.");
