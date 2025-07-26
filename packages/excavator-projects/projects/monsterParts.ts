import "core-js/modules/es.string.match-all";
import {
  availableAmount,
  currentRound,
  Effect,
  Familiar,
  getFloristPlants,
  getProperty,
  haveEffect,
  haveEquipped,
  haveSkill,
  isWearingOutfit,
  Item,
  lastMonster,
  Monster,
  myFamiliar,
  myLocation,
  myPath,
  Path,
  Skill,
} from "kolmafia";

import { ExcavatorProject } from "../type";
import { isAdventureTextAltered, toNormalisedString } from "../utils";

export const MONSTER_PARTS: ExcavatorProject = {
  name: "Monster Parts v2",
  description: "Determine what parts are considered to make up each monster.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: spadeMonsterParts,
  },
  since: 27884, // Monster.prototype.parts added
};

// eslint-disable-next-line libram/verify-constants
const MONSTER_DENYLIST = Monster.get(["the darkness (blind)"]);
const MONSTER_SEARCH_DENYLIST = Monster.get([
  "Perceiver of Sensations",
  "Performer of Actions",
  "Thinker of Thoughts",
]);

type Indicator =
  | { type: "effect"; prerequisite: Effect; pattern: string }
  | { type: "equip"; prerequisite: Item; pattern: string }
  | { type: "item"; prerequisite: Item; pattern: string }
  | { type: "familiar"; prerequisite: Familiar; pattern: string }
  | { type: "plant"; prerequisite: string; pattern: string }
  | { type: "skill"; prerequisite: Skill; pattern: string };

const INDICATORS: Indicator[] = [
  // { type: "familiar", prerequisite: Familiar.get("Bowlet"), pattern: "flaps directly into your opponent's (.+?), causing \\d+? damage" },
  {
    type: "effect",
    prerequisite: Effect.get("Little Mouse Skull Buddy"),
    pattern:
      "The cute little floating mouse skull nibbles at your opponent's (.+?), dealing \\d+? damage",
  },
  {
    type: "equip",
    prerequisite: Item.get("battery-powered drill"),
    pattern:
      "You drill a neat hole in your opponent's (.+?) which deals \\d+? damage",
  },
  {
    type: "equip",
    prerequisite: Item.get("high-temperature mining drill"),
    pattern:
      "You drill a neat hole in your opponent's (.+?) which deals \\d+? damage",
  },
  {
    type: "familiar",
    prerequisite: Familiar.get("Adorable Seal Larva"),
    pattern:
      "fangs your opponent in the (.+?) and greedily sucks the vital juices from the wound",
  },
  {
    type: "familiar",
    prerequisite: Familiar.get("Adventurous Spelunker"),
    pattern: "whips your opponent in the (.+?), dealing \\d+? damage",
  },
  {
    type: "familiar",
    prerequisite: Familiar.get("Left-Hand Man"),
    pattern: "smacks your opponent in the (.+?) with the",
  },
  {
    type: "item",
    prerequisite: Item.get("electronics kit"),
    pattern:
      "You wire up a quick circuit and hook it to your opponent's (.+?)\\. You flip the switch",
  },
  {
    type: "item",
    prerequisite: Item.get("small golem"),
    pattern: "Your little golem punches your foe in the (.+?) for \\d+? damage",
  },
  {
    type: "plant",
    prerequisite: "Rabid Dogwood",
    pattern:
      "The Rabid Dogwood jumps up and nails your opponent in the (.+?) in a misguided show of affection",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Extract"),
    pattern:
      "You reach into your foe's (.+?) and pull out some juicy, pulsating data",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Hammer Smash"),
    pattern: "You smack your foe right in the (.+?) with your hammer, dealing",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Shoot"),
    pattern:
      "You draw your sixgun and shoot your foe right in the (.+?), dealing \\d+? damage",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Stream of Sauce"),
    pattern:
      "You blast it with a stream of hot .+?, dealing \\d+? damage. Right in the (.+?)",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Ultrasonic Ululations"),
    pattern:
      "You shriek in the direction of your foe's (.+?), vibrating it to the tune of \\d+? damage",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Unleash Terra Cotta Army"),
    pattern:
      "A terra cotta .+?s your foe(?: in the|'s) (.+?)(?:, dealing| with a fireball)",
  },
  {
    type: "skill",
    prerequisite: Skill.get("Utensil Twist"),
    pattern:
      "You slap your .+? against the ground, kicking up a spark that strikes your foe in the (.+?), dealing \\d+? damage",
  },
];

function checkPrerequisite({
  type,
  prerequisite,
}: (typeof INDICATORS)[number]) {
  switch (type) {
    case "skill":
      return haveSkill(prerequisite);
    case "effect":
      return haveEffect(prerequisite) > 0;
    case "familiar":
      return myFamiliar() === prerequisite;
    case "equip":
      return haveEquipped(prerequisite);
    case "plant":
      return (
        getFloristPlants()[myLocation().toString()]?.includes(prerequisite) ??
        false
      );
    default:
      return false;
  }
}

type MonsterPartsData = {
  monster: string;
  part: string;
  confirmation: boolean;
  source: string;
};

function checkSimpleIndicators(
  data: MonsterPartsData[],
  page: string,
  monster: string,
  monsterParts: readonly string[],
) {
  for (const indicator of INDICATORS) {
    if (!checkPrerequisite(indicator)) continue;
    const part = page.match(indicator.pattern)?.[1];
    if (!part) continue;
    if (monsterParts.includes(part)) continue;
    data.push({
      monster,
      part,
      confirmation: true,
      source: indicator.prerequisite.toString(),
    });
  }
}

function checkElVibratoRestraints(
  data: MonsterPartsData[],
  page: string,
  monster: string,
  monsterParts: readonly string[],
) {
  if (
    availableAmount(Item.get("El Vibrato restraints")) === 0 ||
    !page.includes("lvcuff.gif")
  )
    return;

  const base = { monster, part: "arm", source: "El Vibrato restraints" };
  if (
    monsterParts.includes("arm") &&
    page.includes("This foe doesn't have any arms that you can find")
  ) {
    data.push({ ...base, confirmation: false });
  } else if (
    !monsterParts.includes("arm") &&
    page.includes("You push the button on top of the restraints")
  ) {
    data.push({ ...base, confirmation: true });
  }
}

const MUTANT_COUTURE_SKILLS = {
  head: Skill.get("Strangle"),
  arm: Skill.get("Disarm"),
  leg: Skill.get("Entangle"),
};

function checkMutantCouture(
  data: MonsterPartsData[],
  page: string,
  monster: string,
  monsterParts: readonly string[],
) {
  if (
    currentRound() !== 1 ||
    !isWearingOutfit("Mutant Couture") ||
    !page.includes("<select name=whichskill>")
  )
    return;

  data.push(
    ...Object.entries(MUTANT_COUTURE_SKILLS)
      .filter(
        ([part, skill]) =>
          !monsterParts.includes(part) &&
          page.includes(`<option value="${skill.id}"`),
      )
      .map(([part, _]) => ({
        monster,
        part,
        confirmation: true,
        source: "Mutant Couture",
      })),
  );

  data.push(
    ...Object.entries(MUTANT_COUTURE_SKILLS)
      .filter(
        ([part, skill]) =>
          monsterParts.includes(part) &&
          !page.includes(`<option value="${skill.id}"`),
      )
      .map(([part, _]) => ({
        monster,
        part,
        confirmation: true,
        source: "Mutant Couture",
      })),
  );
}

const DART_REGEX =
  /<div class="ed_part.*?name="whichskill" value="\d+".*?<button>([^<]+?)<\/button>/g;

function checkEverfullDartHolster(
  data: MonsterPartsData[],
  page: string,
  monster: string,
  monsterParts: readonly string[],
) {
  // Everfull Dart Holster
  if (
    currentRound() !== 1 ||
    // eslint-disable-next-line libram/verify-constants
    !haveEquipped(Item.get("Everfull Dart Holster"))
  )
    return;

  const buttAwareness =
    getProperty("everfullDartPerks").includes("Butt awareness");
  const allDartParts = [...page.matchAll(DART_REGEX)].map((match) => match[1]);

  const dartParts = [
    ...new Set(
      allDartParts.filter((part) => !buttAwareness || part !== "butt"),
    ),
  ];

  data.push(
    ...dartParts
      .filter((part) => !monsterParts.includes(part))
      .map((part) => ({
        monster: monster,
        part,
        confirmation: true,
        source: "Everfull Dart Holster",
      })),
  );

  if (allDartParts.length <= 4) {
    data.push(
      ...monsterParts
        .filter((part) => !dartParts.includes(part))
        .map((part) => ({
          monster: monster,
          part,
          confirmation: false,
          source: "Everfull Dart Holster",
        })),
    );
  }
}

function spadeMonsterParts(
  encounter: string,
  page: string,
): MonsterPartsData[] | null {
  if (MONSTER_DENYLIST.includes(lastMonster())) return null;

  const path = myPath();
  // in FotD, monster parts are the parts of the dino that ate the monster
  // in Pocket Familiars, combat is completely different, and the dart holster doesn't appear
  if (path == Path.get("Fall of the Dinosaurs") || path == Path.get("Pocket Familiars")) return null;

  const monster = toNormalisedString(lastMonster());
  const monsterParts = lastMonster().parts;

  const data: MonsterPartsData[] = [];

  if (
    !isAdventureTextAltered() &&
    !MONSTER_SEARCH_DENYLIST.includes(lastMonster())
  ) {
    checkSimpleIndicators(data, page, monster, monsterParts);
    checkElVibratoRestraints(data, page, monster, monsterParts);
  }

  checkMutantCouture(data, page, monster, monsterParts);
  checkEverfullDartHolster(data, page, monster, monsterParts);

  return data;
}
