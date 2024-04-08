/**
 * @author rinn
 * Track drops from the can of mixed everything
 */
import { currentRound, equippedAmount, Item } from "kolmafia";
import { $item } from "libram";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

export const DROP_MIXED_EVERYTHING: ExcavatorProject = {
  name: "Can Of Mixed Everything",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing the can of mixed everything
      if (equippedAmount($item`can of mixed everything`) < 1) return null;
      const result = page.match(
        /Something falls out of your can of mixed everything.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = Item.get(result[1]);
      return {
        item: item !== $item`none` ? toNormalisedString(item) : result[1],
      };
    },
  },
};
