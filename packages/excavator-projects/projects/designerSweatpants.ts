import { currentRound, Item, equippedItem, Slot, myLocation } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

type SweatpantsData = { location: string; sweat: number };
const SWEAT_PATTERN = /You get (\d)% sweatier/;
function spadeSweatpants(
  _encounter: string,
  page: string,
): SweatpantsData | null {
  if (currentRound() !== 0) return null;
  if (
    !Item.get(["designer sweatpants", "replica designer sweatpants"]).includes(
      equippedItem(Slot.get("pants")),
    )
  )
    return null;
  const result = page.match(SWEAT_PATTERN);
  if (result)
    return {
      location: toNormalisedString(myLocation()),
      sweat: Number(result[1]),
    };
  return null;
}

export const DESIGNER_SWEATPANTS: ExcavatorProject = {
  name: "Designer Sweatpants",
  description:
    "Tracks sweatiness of various zones for the Designer Sweatpants and its replica",
  author: "horrible-little-slime",
  hooks: { COMBAT_ROUND: spadeSweatpants },
};
