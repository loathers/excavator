import { getProperty, Item, myId, myTurncount } from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { isEquippedAtEndOfCombat, toNormalisedItem } from "../utils.js";

export const DROP_CUP_OF_13: ExcavatorProject = {
  name: "Cup of 13s drops",
  description: "Track drops from the Cup of 13s.",
  author: "Ignose",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (!isEquippedAtEndOfCombat(Item.get("Cup of 13s"))) return null;
      const result = page.match(
        /You hear a gurgling from your Cup of 13s.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return {
        item,
        dropsToday: Number(getProperty("_cupOf13sDrops")),
      };
    },
  },
};
