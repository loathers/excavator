/**
 * @author rinn
 * Track drops from the Mr. Cheeng's Spectacles
 */
import { currentRound, equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

export const DROP_MR_CHEENGS: ExcavatorProject = {
  name: "Mr. Cheeng's Spectacles",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing Mr. Cheeng's spectacles
      if (equippedAmount(Item.get("Mr. Cheeng's spectacles")) < 1) return null;
      const result = page.match(
        /You see a weird thing out of the corner of your eye, and you grab it.\s+Far out, man!.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = Item.get(result[1]);
      return {
        item: item !== Item.none ? toNormalisedString(item) : result[1],
      };
    },
  },
};
