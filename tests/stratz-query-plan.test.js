"use strict";
const assert = require("node:assert/strict");
const { POSITIONS, SELECTIONS, buildProbeQuery } = require("../scripts/stratz-query-plan");

const schema = {
  candidates: [...new Set(SELECTIONS.map(x => x.field))].map(name => ({
    name,
    args: ["heroId", "positionIds", "minTime", "maxTime", "matchLimit"].map(name => ({ name })),
    fields: SELECTIONS.find(x => x.field === name).fields
  }))
};
for (const position of POSITIONS) {
  const plan = buildProbeQuery(schema, position);
  assert.equal(plan.position, position);
  assert.equal(plan.included.length, 9);
  assert.match(plan.query, new RegExp("positionIds: \\[" + position + "\\]"));
  assert.doesNotMatch(plan.query, /POSITION_[1-5].*POSITION_[1-5]/s, "una consulta no debe mezclar posiciones");
}
assert.throws(() => buildProbeQuery(schema, "POSITION_6"), /Posición STRATZ inválida/);
const incomplete = structuredClone(schema);
incomplete.candidates.find(x => x.name === "talent").fields = ["abilityId"];
assert.throws(() => buildProbeQuery(incomplete, "POSITION_1"), /talents:field:matchCount/);
console.log("STRATZ query plan tests passed.");
