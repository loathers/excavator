import { currentRound, equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedItem } from "../utils";

export const DROP_MR_CHEENGS: ExcavatorProject = {
  name: "Mr. Cheeng's Spectacles",
  slug: "cheengs",
  description: "Track drops from the Mr. Cheeng's Spectacles.",
  author: "Rinn",
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
      const item = toNormalisedItem(result[1]);
      return { item };
    },
  },
};
