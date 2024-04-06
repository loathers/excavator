/**
 * @author Rinn
 * Determine what parts are considered to make up each monster
 */
import {
  currentRound,
  dartPartsToSkills,
  Effect,
  Familiar,
  haveEquipped,
  isWearingOutfit,
  Item,
  lastMonster,
  myFamiliar,
  myLocation,
  Skill,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $monsters,
  $skill,
  FloristFriar,
  get,
  have,
} from "libram";

import { ExcavatorProject } from "../type";
import { isAdventureTextAltered, toNormalisedString } from "../utils/game";

// eslint-disable-next-line libram/verify-constants
const MONSTER_DENYLIST = $monsters`the darkness (blind)`;
const MONSTER_SEARCH_DENYLIST = $monsters`Perceiver of Sensations, Performer of Actions, Thinker of Thoughts`;

type Indicator =
  | { type: "effect"; prerequisite: Effect; pattern: string }
  | { type: "equip"; prerequisite: Item; pattern: string }
  | { type: "item"; prerequisite: Item; pattern: string }
  | { type: "familiar"; prerequisite: Familiar; pattern: string }
  | { type: "plant"; prerequisite: string; pattern: string }
  | { type: "skill"; prerequisite: Skill; pattern: string };

const INDICATORS: Indicator[] = [
  // { type: "familiar", prerequisite: $familiar`Bowlet`, pattern: "flaps directly into your opponent's (.+?), causing \\d+? damage" },
  {
    type: "effect",
    prerequisite: $effect`Little Mouse Skull Buddy`,
    pattern:
      "The cute little floating mouse skull nibbles at your opponent's (.+?), dealing \\d+? damage",
  },
  {
    type: "equip",
    prerequisite: $item`battery-powered drill`,
    pattern:
      "You drill a neat hole in your opponent's (.+?) which deals \\d+? damage",
  },
  {
    type: "equip",
    prerequisite: $item`high-temperature mining drill`,
    pattern:
      "You drill a neat hole in your opponent's (.+?) which deals \\d+? damage",
  },
  {
    type: "familiar",
    prerequisite: $familiar`Adorable Seal Larva`,
    pattern:
      "fangs your opponent in the (.+?) and greedily sucks the vital juices from the wound",
  },
  {
    type: "familiar",
    prerequisite: $familiar`Adventurous Spelunker`,
    pattern: "whips your opponent in the (.+?), dealing \\d+? damage",
  },
  {
    type: "familiar",
    prerequisite: $familiar`Left-Hand Man`,
    pattern: "smacks your opponent in the (.+?) with the",
  },
  {
    type: "item",
    prerequisite: $item`electronics kit`,
    pattern:
      "You wire up a quick circuit and hook it to your opponent's (.+?)\\. You flip the switch",
  },
  {
    type: "item",
    prerequisite: $item`small golem`,
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
    prerequisite: $skill`Extract`,
    pattern:
      "You reach into your foe's (.+?) and pull out some juicy, pulsating data",
  },
  {
    type: "skill",
    prerequisite: $skill`Hammer Smash`,
    pattern: "You smack your foe right in the (.+?) with your hammer, dealing",
  },
  {
    type: "skill",
    prerequisite: $skill`Shoot`,
    pattern:
      "You draw your sixgun and shoot your foe right in the (.+?), dealing \\d+? damage",
  },
  {
    type: "skill",
    prerequisite: $skill`Stream of Sauce`,
    pattern:
      "You blast it with a stream of hot .+?, dealing \\d+? damage. Right in the (.+?)",
  },
  {
    type: "skill",
    prerequisite: $skill`Ultrasonic Ululations`,
    pattern:
      "You shriek in the direction of your foe's (.+?), vibrating it to the tune of \\d+? damage",
  },
  {
    type: "skill",
    prerequisite: $skill`Unleash Terra Cotta Army`,
    pattern:
      "A terra cotta .+?s your foe(?: in the|'s) (.+?)(?:, dealing| with a fireball)",
  },
  {
    type: "skill",
    prerequisite: $skill`Utensil Twist`,
    pattern:
      "You slap your .+? against the ground, kicking up a spark that strikes your foe in the (.+?), dealing \\d+? damage",
  },
];

const MUTANT_COUTURE_SKILLS = {
  head: $skill`Strangle`,
  arm: $skill`Disarm`,
  leg: $skill`Entangle`,
};

function checkPrerequisite({
  type,
  prerequisite,
}: (typeof INDICATORS)[number]) {
  switch (type) {
    case "skill":
    case "effect":
      return have(prerequisite);
    case "familiar":
      return myFamiliar() === prerequisite;
    case "equip":
      return haveEquipped(prerequisite);
    case "plant":
      return FloristFriar.flowersIn(myLocation())
        .map((f) => f.name)
        .includes(prerequisite);
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

function spadeMonsterParts(
  encounter: string,
  page: string,
): MonsterPartsData[] | null {
  if (MONSTER_DENYLIST.includes(lastMonster())) return null;

  const monster = toNormalisedString(lastMonster());
  const monsterParts = lastMonster().parts;

  const data = [];

  if (
    !isAdventureTextAltered() &&
    !MONSTER_SEARCH_DENYLIST.includes(lastMonster())
  ) {
    // Simple indicators
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

    // El Vibrato restraints
    if (have($item`El Vibrato restraints`) && page.includes("lvcuff.gif")) {
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
  }

  // Mutant Couture
  if (
    currentRound() === 1 &&
    isWearingOutfit("Mutant Couture") &&
    page.includes("<select name=whichskill>")
  ) {
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

  // Everfull Dart Holster
  if (
    currentRound() === 1 &&
    // eslint-disable-next-line libram/verify-constants
    haveEquipped($item`Everfull Dart Holster`)
  ) {
    const buttAwareness = get("everfullDartPerks").includes("Butt awareness");
    data.push(
      ...Object.keys(dartPartsToSkills())
        .filter(
          (part) =>
            !monsterParts.includes(part) && (!buttAwareness || part !== "butt"),
        )
        .map((part) => ({
          monster: monster,
          part,
          confirmation: true,
          source: "Everfull Dart Holster",
        })),
    );
  }

  return data;
}

export const MONSTER_PARTS: ExcavatorProject = {
  name: "Monster Parts",
  hooks: {
    COMBAT_ROUND: spadeMonsterParts,
  },
  since: 27884, // Monster.prototype.parts added
};
