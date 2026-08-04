import {
  combatSkillAvailable,
  currentRound,
  haveEquipped,
  haveSkill,
  Item,
  lastMonster,
  Monster,
  myPath,
  Path,
  Skill,
} from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedString } from "../utils.js";

type GhostData = {
  monster: string;
  ghost: boolean;
  reason: string;
};

export const SUBTYPE_GHOST: ExcavatorProject = {
  name: "Subtype Ghost",
  slug: "sub_ghost",
  description: "Determine ghost monsters",
  author: "midgleyc",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      const path = myPath();
      // pokefam ruins everything
      // wereprofessor doesn't have normal skills
      if (
        path == Path.get("Pocket Familiars") ||
        path == Path.get("WereProfessor")
      ) {
        return null;
      }

      // confirm in fight and has skill selection
      if (currentRound() !== 1 || !page.includes("<select name=whichskill>")) {
        return null;
      }

      const monster = lastMonster();
      const expected = monster.attributes.includes("GHOST");

      return (
        pinchGhost(monster, expected) || protonicAccelerator(monster, expected)
      );
    },
  },
  since: 28778, // skeleton monster tracking
};

function pinchGhost(monster: Monster, expected: boolean): GhostData | null {
  if (!haveSkill(Skill.get("Pinch Ghost"))) {
    return null;
  }

  let actual = combatSkillAvailable(Skill.get("Pinch Ghost"));

  if (actual !== expected) {
    return {
      monster: toNormalisedString(monster),
      ghost: actual,
      reason: "Pinch Ghost",
    };
  }

  return null;
}

function protonicAccelerator(
  monster: Monster,
  expected: boolean,
): GhostData | null {
  if (!haveEquipped(Item.get("protonic accelerator pack"))) {
    return null;
  }

  let actual =
    combatSkillAvailable(Skill.get("Shoot Ghost")) ||
    combatSkillAvailable(Skill.get("Trap Ghost"));

  if (actual !== expected) {
    return {
      monster: toNormalisedString(monster),
      ghost: actual,
      reason: "ProtoPack",
    };
  }

  return null;
}
