import "core-js/modules/es.string.match-all";
import { currentRound, equippedAmount, Item } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedItem } from "../utils";

export const DROP_CON_SNOWGLOBE: ExcavatorProject = {
  name: "KoL Con 13 Snowglobe",
  slug: "snowglobe",
  description: "Track drops from the KoL Con 13 snowglobe.",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: spadeSnowglobe,
  },
};

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
  if (equippedAmount(Item.get("KoL Con 13 snowglobe")) < 1) return null;

  const data = [];

  for (const indicator of INDICATORS) {
    // Multiple results are possible if the time-twitching toolbelt is equipped
    for (const match of page.matchAll(indicator.pattern)) {
      const item = indicator.type === "item" ? toNormalisedItem(match[1]) : "";
      data.push({
        type: indicator.type,
        item,
      });
    }
  }

  return data;
}
