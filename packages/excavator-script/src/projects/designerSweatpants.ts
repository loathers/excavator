/**
 * @author horrible-little-slime
 * Track sweatiness of various sweatpants zones
 */
import { currentRound, equippedItem, myLocation } from "kolmafia";
import { $item, $slot } from "libram";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils/game";

type SweatpantsData = { location: string; sweat: number };
const SWEAT_PATTERN = /You get (\d)% sweatier/;
function spadeSweatpants(
  _encounter: string,
  page: string,
): SweatpantsData | null {
  if (currentRound() !== 0) return null;
  if (equippedItem($slot`pants`) !== $item`designer sweatpants`) return null;
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
  hooks: { COMBAT_ROUND: spadeSweatpants },
};
