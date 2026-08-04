import {
  combatSkillAvailable,
  currentRound,
  haveEquipped,
  Item,
  lastMonster,
  myPath,
  Path,
  Skill,
} from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedString } from "../utils.js";

export const SUBTYPE_SKELETON: ExcavatorProject = {
  name: "Subtype skeleton",
  slug: "sub_skeleton",
  description: "Determine skeleton monsters",
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

      // the ring of telling skeletons what to do gives one of two skills
      if (!haveEquipped(Item.get("ring of telling skeletons what to do"))) {
        return null;
      }

      const monster = lastMonster();
      const expected = monster.attributes.includes("SKELETON");

      let actual = undefined;

      if (combatSkillAvailable(Skill.get("Tell This Skeleton What To Do"))) {
        actual = true;
      } else if (
        combatSkillAvailable(Skill.get("Tell a Skeleton What To Do"))
      ) {
        actual = false;
      } else {
        // neither skill available, call it quits
        return null;
      }

      if (actual !== expected) {
        return {
          monster: toNormalisedString(monster),
          skeleton: actual,
        };
      }

      return null;
    },
  },
  since: 28778, // skeleton monster tracking
};
