import { Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { isEquippedAtEndOfCombat, toNormalisedItem } from "../utils";

export const DROP_ORDNANCE_MAGNET: ExcavatorProject = {
  name: "Ordnance Magnet",
  slug: "ordnance",
  description: "Track drops from the ordnance magnet",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (!isEquippedAtEndOfCombat(Item.get("ordnance magnet"))) return null;
      const result = page.match(
        /You notice that your ordnance magnet has picked up some ordnance.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return { item };
    },
  },
};
