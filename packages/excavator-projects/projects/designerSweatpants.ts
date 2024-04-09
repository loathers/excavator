import { currentRound, Item, equippedItem, Slot, myLocation } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

function spadeSweatpants(encounter: string, page: string) {
  if (currentRound() !== 0) return null;
  if (
    !Item.get(["designer sweatpants", "replica designer sweatpants"]).includes(
      equippedItem(Slot.get("pants")),
    )
  )
    return null;
  const sweat = page.match(/You get (\d)% sweatier/)?.[1];
  if (!sweat) return null;
  return {
    location: toNormalisedString(myLocation()),
    sweat: Number(sweat),
  };
}

export const DESIGNER_SWEATPANTS: ExcavatorProject = {
  name: "Designer Sweatpants",
  description:
    "Tracks sweatiness of various zones for the Designer Sweatpants and its replica",
  author: "horrible-little-slime",
  hooks: { COMBAT_ROUND: spadeSweatpants },
};
