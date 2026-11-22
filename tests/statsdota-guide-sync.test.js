"use strict";
const assert=require("node:assert/strict");
const {parseGuideIndex,parseGuidePage,appRole}=require("../scripts/statsdota-guide-sync");
const heroes=[
 {name:"npc_dota_hero_centaur",localized_name:"Centaur Warrunner"},
 {name:"npc_dota_hero_enigma",localized_name:"Enigma"}
];
const index='<a href="https://statsdota.com/en/guides/centaur-warrunner"><img alt="Centaur">Centaur Warrunner</a><a href="/en/guides/enigma">Enigma</a>';
const links=parseGuideIndex(index,heroes);
assert.equal(links.length,2);
assert.equal(links[0].hero.name,"npc_dota_hero_centaur");
assert.equal(links[0].slug,"centaur-warrunner");
assert.equal(appRole("Hard Support"),"Support 5");
assert.equal(appRole("Soft Support"),"Support 4");
assert.equal(appRole("Support"),null,"Generic support role must not be guessed as position 4 or 5");
const hero=heroes[1],heroAbilities={npc_dota_hero_enigma:{abilities:["enigma_demonic_conversion","enigma_malefice","enigma_black_hole"]}};
const html='<h1>How to play Enigma — guide 7.42</h1><p>Based on 100 winning matches of Immortal rank players and pro players · updated November 22, 2026</p><p>Enigma is played in Offlane. In ranked games this is the main role.</p><h2>Skill order</h2><div>1<img alt="enigma_demonic_conversion"></div><div>2<img alt="enigma_malefice"></div><div>3<img alt="enigma_demonic_conversion"></div><div>4<img alt="enigma_malefice"></div><div>5<img alt="enigma_demonic_conversion"></div><div>6<img alt="enigma_black_hole"></div><h2>Frequently asked questions</h2>';
const parsed=parseGuidePage(html,hero,heroAbilities,"https://statsdota.com/en/guides/enigma");
assert.equal(parsed.role,"Offlane");
assert.equal(parsed.patch,"7.42");
assert.equal(parsed.matches,100);
assert.equal(parsed.status,"ready");
assert.deepEqual(parsed.abilityOrder,["enigma_demonic_conversion","enigma_malefice","enigma_demonic_conversion","enigma_malefice","enigma_demonic_conversion","enigma_black_hole"]);
const missing=parseGuidePage('<h1>Guide 7.42</h1><h2>Skill order</h2><p>no sequence</p><h2>Frequently asked questions</h2>',hero,heroAbilities,"https://statsdota.com/en/guides/enigma");
assert.equal(missing.status,"incomplete");
assert.equal(missing.role,null);
const crystal={name:"npc_dota_hero_crystal_maiden",localized_name:"Crystal Maiden"};
const crystalAbilities={npc_dota_hero_crystal_maiden:{abilities:["crystal_maiden_crystal_nova","crystal_maiden_frostbite","crystal_maiden_brilliance_aura","generic_hidden","generic_hidden","crystal_maiden_freezing_field"]}};
const crystalHtml='<h1>How to play Crystal Maiden — guide 7.42</h1><p>Based on 100 winning matches of Immortal rank players and pro players · updated November 22, 2026</p><p>Crystal Maiden is played as Carry.</p><h2>Positions</h2><p>Carry 77 games Offlane 12 games Mid 11 games</p><h2>Skill order</h2><div>1<img alt="crystal_maiden_frostbite"></div><div>2<img alt="crystal_maiden_brilliance_aura"></div><div>3<img alt="crystal_maiden_crystal_nova"></div><div>4<img alt="crystal_maiden_frostbite"></div><div>5<img alt="crystal_maiden_frostbite"></div><div>6<img alt="crystal_maiden_freezing_field"></div><h2>Frequently asked questions</h2>';
const crystalGuide=parseGuidePage(crystalHtml,crystal,crystalAbilities,"https://statsdota.com/en/guides/crystal-maiden");
assert.equal(crystalGuide.role,"Carry","StatsDota main role should come from the position with the highest game count");
assert.equal(crystalGuide.roleGames,77);
assert.equal(crystalGuide.status,"ready");
console.log("OK: StatsDota index mapping, role/sample/patch parsing and ability-order extraction");
