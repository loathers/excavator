import {
  currentRound,
  Familiar,
  getProperty,
  myFamiliar,
  sessionStorage,
} from "kolmafia";

import { ExcavatorProject } from "../type";

export const COOKBOOKBAT: ExcavatorProject = {
  name: "Cookbookbat",
  description: "Determine the possible locations for Cookbookbat quests",
  author: "Shiverwarp",
  hooks: {
    COMBAT_ROUND: (meta: string, page: string) => {
      if (currentRound() !== 0) return null;
      if (myFamiliar() !== Familiar.get("Cookbookbat")) return null;
      const currentQuest = getProperty("_cookbookbatQuestLastLocation");
      // Exit if there is no quest location to report
      if (!currentQuest) return null;
      const previousQuest = sessionStorage.getItem(
        "lastCookbookbatQuestLocation",
      );
      // Exit if we didn't receive a new quest
      if (currentQuest === previousQuest) {
        return null;
      }
      sessionStorage.setItem("lastCookbookbatQuestLocation", currentQuest);
      return { questLocation: currentQuest };
    },
  },
};
