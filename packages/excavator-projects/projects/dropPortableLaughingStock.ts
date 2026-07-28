import {
  daycount,
  getProperty,
  Item,
  myClass,
  myId,
  myPath,
  myTurncount,
} from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { isEquippedAtEndOfCombat, toNormalisedItem } from "../utils.js";
import { toNormalisedString } from "../utils.js";

export const DROP_PORTABLE_LAUGHING_STOCK: ExcavatorProject = {
  name: "Portable Laughing Stock",
  description: "Track drops from the portable laughing stock.",
  author: "Ignose",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (!isEquippedAtEndOfCombat(Item.get("portable laughing stock")))
        return null;
      const result = page.match(
        /You get smacked in the face with a piece of fruit from somewhere|The crowd's derision takes a physical form as a piece of fruit sails toward your head|A jeering onlooker chucks something soft and squishy your way|Someone in the crowd hurls a piece of fruit at you|Someone lobs a piece of fruit at you from the crowd/,
      );
      if (!result) return null;
      const item = toNormalisedItem(result[1]);
      return {
        player: Number(myId()),
        path: toNormalisedString(myPath()),
        item,
        dropsToday: Number(getProperty("_laughingStockFruitDropped")),
        turn: myTurncount(),
        class: myClass().toString(),
        daycount: daycount(),
      };
    },
  },
  completed: true,
};
