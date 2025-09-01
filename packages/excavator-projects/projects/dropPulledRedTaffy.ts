import { currentRound, myLocation } from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedItem } from "../utils.js";

export const DROP_PULLED_RED_TAFFY: ExcavatorProject = {
  name: "Pulled Red Taffy",
  description: "Track end of combat drops from pulled red taffy underwater",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (currentRound() !== 0) return null;
      // TODO: Does _seadentWaveZone when implemented allow for this?
      if (myLocation().environment !== "underwater") return null;
      const result = page.match(
        /and gives you an item before disappearing into the murky depths.*?You acquire an item: <b>(.*?)<\/b>/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return { item };
    },
  },
};
