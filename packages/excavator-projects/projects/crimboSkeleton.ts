import { currentRound, Familiar, familiarWeight, getProperty, haveEquipped, Item, lastMonster, myClass, myDaycount, myFamiliar, myId, myLocation, myPath, myTotalTurnsSpent, Phylum, weightAdjustment } from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils.js";

type KiwiData = {
  player: number;
  gotDrop: boolean;
  dropsToday: number;
  location: string;
  monster: string;
  baseWeight: number;
  buffedWeight: number;
  turn: number;
  phylum: string;
  hasCane: boolean;
};

function spadeSkeleton(encounter: string, page: string): KiwiData | null {
  if (currentRound() !== 0) return null;
  if (myFamiliar() !== Familiar.get("Skeleton of Crimbo Past")) return null;

  return {
    player: Number(myId()),
    gotDrop: page.includes("You acquire an item: <b>knucklebone</b>"),
    dropsToday: Number(getProperty("_knuckleboneDrops")),
    location: toNormalisedString(myLocation()),
    baseWeight: familiarWeight(Familiar.get("Mini Kiwi")),
    buffedWeight:
      familiarWeight(Familiar.get("Mini Kiwi")) + weightAdjustment(),
    turn: myTotalTurnsSpent(),
    hasCane: haveEquipped(Item.get("small peppermint-flavored sugar walking crook")),
    phylum: lastMonster().phylum.toString(),
    monster: toNormalisedString(lastMonster()),
  };
}

export const SKELETON_OF_CRIMBO_PAST: ExcavatorProject = {
  name: "Skeleton of Crimbo Past",
  slug: "skcrimbo",
  description: "Spade Skeleton of Crimbo Past drops",
  author: "Ignose",
  hooks: {
    COMBAT_ROUND: spadeSkeleton,
  },
  since: 27973, // mini kiwi familiar equipment added
};