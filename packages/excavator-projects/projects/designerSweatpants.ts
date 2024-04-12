import {
  currentRound,
  Item,
  equippedItem,
  Slot,
  myLocation,
  getProperty,
  setProperty,
} from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

function spadeSweatpants(encounter: string, page: string) {
  if (currentRound() !== 0) return null;
  if (
    !Item.get(["designer sweatpants", "replica designer sweatpants"]).includes(
      equippedItem(Slot.get("pants")),
    )
  ) {
    return null;
  }

  const sweat = Number(page.match(/You get (\d)% Sweatier/)?.[1]);
  if (!sweat) return null;

  const location = toNormalisedString(myLocation());
  const reportedLocations = getProperty("reportedSweatpantsLocations").split(
    "|",
  );
  if (reportedLocations.includes(location)) return null;

  setProperty(
    "excavatorSweatpantsLocations",
    [...reportedLocations, location].join("|"),
  );

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
