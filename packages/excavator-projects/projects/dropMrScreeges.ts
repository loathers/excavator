import { Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { isEquippedAtEndOfCombat, toNormalisedItem } from "../utils";

export const DROP_MR_SCREEGES: ExcavatorProject = {
  name: "Mr. Screege's Spectacles",
  slug: "screeges",
  description: "Track drops from the Mr. Screege's Spectacles.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (!isEquippedAtEndOfCombat(Item.get("Mr. Screege's spectacles")))
        return null;
      const result = page.match(
        /You notice something valuable hidden .*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return { item };
    },
  },
};
