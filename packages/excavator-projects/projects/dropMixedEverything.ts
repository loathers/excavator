import { currentRound, equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

export const DROP_MIXED_EVERYTHING: ExcavatorProject = {
  name: "Can Of Mixed Everything",
  description: "Track drops from the can of mixed everything.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing the can of mixed everything
      if (equippedAmount(Item.get("can of mixed everything")) < 1) return null;
      const result = page.match(
        /Something falls out of your can of mixed everything.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = Item.get(result[1]);
      return {
        item: item !== Item.none ? toNormalisedString(item) : result[1],
      };
    },
  },
};
