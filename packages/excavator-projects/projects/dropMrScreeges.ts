/**
 * @author rinn
 * Track drops from the Mr. Screege's Spectacles
 */
import { currentRound, equippedAmount, Item } from "kolmafia";
import { $item } from "libram";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

export const DROP_MR_SCREEGES: ExcavatorProject = {
  name: "Mr. Screege's Spectacles",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing Mr. Screege's spectacles
      if (equippedAmount($item`Mr. Screege's spectacles`) < 1) return null;
      const result = page.match(
        /You notice something valuable hidden .*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = Item.get(result[1]);
      return {
        item: item !== $item`none` ? toNormalisedString(item) : result[1],
      };
    },
  },
};
