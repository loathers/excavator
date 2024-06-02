import { equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

export const DROP_BINDLESTOCKING: ExcavatorProject = {
  name: "Bindlestocking",
  description: "Track critical drops from the bindlestocking.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (_: string, page: string) => {
      // Must be wielding a bindlestocking
      if (equippedAmount(Item.get("bindlestocking")) < 1) return null;
      const result = page.match(
        /Something gets knocked loose from your bindlestocking!.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = Item.get(result[1]);
      return {
        item: item !== Item.none ? toNormalisedString(item) : result[1],
      };
    },
  },
};
