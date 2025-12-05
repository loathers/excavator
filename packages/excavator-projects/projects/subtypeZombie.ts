import { currentRound, lastMonster } from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedString } from "../utils.js";

export const SUBTYPE_ZOMBIE: ExcavatorProject = {
  name: "Subtype Zombie",
  slug: "sub_zombie",
  description: "Determine zombie monsters",
  author: "midgleyc",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // end of fight only
      if (currentRound() !== 0) {
        return null;
      }
      // if a zombie, a wriggling worm may drop, but it's not guaranteed
      if (
        page.includes(
          "You grab a plump, wriggling worm from what's left of that zombie.",
        )
      ) {
        const monster = lastMonster();
        const expected = monster.attributes.includes("ZOMBIE");

        if (!expected) {
          return {
            monster: toNormalisedString(monster),
            zombie: true,
          };
        }
      }

      return null;
    },
  },
  since: 28782, // track zombies
};
