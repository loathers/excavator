/**
 * @author rinn
 * Track drops from the KoL Con 13 snowglobe
 */
import { currentRound, equippedAmount, Item } from "kolmafia";
import { $item } from "libram";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

type Indicator = { type: "substat" | "item"; pattern: RegExp };

const INDICATORS: Indicator[] = [
  {
    type: "substat",
    pattern: /when you helped carry the kegs to an afterparty/g,
  },
  {
    type: "substat",
    pattern: /when you armwrestled/g,
  },
  { type: "substat", pattern: /took turns doing benchpresses with/g },
  {
    type: "substat",
    pattern:
      /trivia contest with your vast stores of useless esoteric knowledge/g,
  },
  {
    type: "substat",
    pattern: /taught you to play that really complicated board game/g,
  },
  {
    type: "substat",
    pattern:
      /when you managed to successfully coordinate a dinner for a group/g,
  },
  { type: "substat", pattern: /totally stole the show at karaoke/g },
  {
    type: "substat",
    pattern: /when everybody got really excited about your/g,
  },
  { type: "substat", pattern: /complimented you on your dancing/g },
  {
    type: "item",
    pattern:
      /and find a weird thing you don't remember packing in the first place.*?You acquire an item: <b>(.*?)<\/b>/g,
  },
  {
    type: "item",
    pattern:
      /go into your kitchen and try to recreate it.*?You acquire an item: <b>(.*?)<\/b>/g,
  },
  {
    type: "item",
    pattern:
      /that dinner is still in your refrigerator.*?You acquire an item: <b>(.*?)<\/b>/g,
  },
];

type SnowglobeData = {
  type: string;
  item: string;
};

function spadeSnowglobe(
  encounter: string,
  page: string,
): SnowglobeData[] | null {
  // Must be end of battle
  if (currentRound() !== 0) return null;
  // Must be wearing KoL Con 13 snowglobe
  if (equippedAmount($item`KoL Con 13 snowglobe`) < 1) return null;

  const data = [];

  for (const indicator of INDICATORS) {
    // Multiple results are possible if the time-twitching toolbelt is equipped
    for (const match of page.matchAll(indicator.pattern)) {
      let str = "";
      if (indicator.type === "item") {
        const item = Item.get(match[1]);
        str = item !== $item`none` ? toNormalisedString(item) : match[1];
      }
      data.push({
        type: indicator.type,
        item: str,
      });
    }
  }

  return data;
}

export const DROP_CON_SNOWGLOBE: ExcavatorProject = {
  name: "KoL Con 13 Snowglobe",
  hooks: {
    COMBAT_ROUND: spadeSnowglobe,
  },
};
