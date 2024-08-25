import "core-js/modules/es.string.match-all";
import { Item } from "kolmafia";

import { ExcavatorData, ExcavatorProject } from "../type";
import { isEquippedAtEndOfCombat, toNormalisedItem } from "../utils";

const PATTERNS: RegExp[] = [
  /and find a weird thing you don't remember packing in the first place.*?You acquire an item: <b>(.*?)<\/b>/,
  /go into your kitchen and try to recreate it.*?You acquire an item: <b>(.*?)<\/b>/,
  /that dinner is still in your refrigerator.*?You acquire an item: <b>(.*?)<\/b>/,
];

export const DROP_CON_SNOWGLOBE: ExcavatorProject = {
  name: "KoL Con 13 Snowglobe",
  slug: "snowglobe",
  description: "Track drops from the KoL Con 13 snowglobe.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (_: string, page: string): ExcavatorData | null => {
      if (!isEquippedAtEndOfCombat(Item.get("KoL Con 13 snowglobe")))
        return null;
      for (const pattern of PATTERNS) {
        const result = page.match(pattern);
        if (!result) continue;
        const item = toNormalisedItem(result[1]);
        return {
          item,
        };
      }
      return null;
    },
  },
};
