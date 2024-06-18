import { currentRound, equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedItem } from "../utils";

export const DROP_MR_SCREEGES: ExcavatorProject = {
  name: "Mr. Screege's Spectacles",
  slug: "screeges",
  description: "Track drops from the Mr. Screege's Spectacles.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing Mr. Screege's spectacles
      if (equippedAmount(Item.get("Mr. Screege's spectacles")) < 1) return null;
      const result = page.match(
        /You notice something valuable hidden .*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return { item };
    },
  },
};
