import { equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { isEquippedAtEndOfCombat, toNormalisedItem } from "../utils";

export const DROP_MIXED_EVERYTHING: ExcavatorProject = {
  name: "Can Of Mixed Everything",
  description: "Track drops from the can of mixed everything.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (!isEquippedAtEndOfCombat(Item.get("can of mixed everything")))
        return null;
      const result = page.match(
        /Something falls out of your can of mixed everything.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return { item };
    },
  },
};
