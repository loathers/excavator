import { Item, myLocation } from "kolmafia";

import { ExcavatorProject } from "../type";
import {
  isEquippedAtEndOfCombat,
  shouldDiscardData,
  toNormalisedString,
} from "../utils";

function spadeSweatpants(encounter: string, page: string) {
  if (
    !isEquippedAtEndOfCombat(
      Item.get(["designer sweatpants", "replica designer sweatpants"]),
    )
  )
    return null;

  const sweat = Number(page.match(/You get (\d)% Sweatier/)?.[1]);
  if (!sweat) return null;

  const location = toNormalisedString(myLocation());
  if (shouldDiscardData("DesignerSweatpants", location)) return null;

  return {
    location,
    sweat,
  };
}

export const DESIGNER_SWEATPANTS: ExcavatorProject = {
  name: "Designer Sweatpants",
  description:
    "Tracks sweatiness of various zones for the Designer Sweatpants and its replica.",
  author: "horrible-little-slime",
  hooks: { COMBAT_ROUND: spadeSweatpants },
};
