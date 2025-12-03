import {
  currentRound,
  Familiar,
  familiarWeight,
  getProperty,
  haveEquipped,
  Item,
  lastMonster,
  myClass,
  myDaycount,
  myFamiliar,
  myId,
  myLocation,
  myPath,
  myTotalTurnsSpent,
  Phylum,
  weightAdjustment,
} from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils.js";

type SkellyData = {
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
  dropText: string;
};

const knuckleTexts = [
  "silently gestures at a loose knucklebone lying on the ground",
  "wordlessly points out a knucklebone you knocked loose from your opponent",
  "picks something up off the ground and tosses it to you",
];

function extractKnuckleText(page: string): number {
  return knuckleTexts.findIndex((t) => page.includes(t));
}

function spadeSkeleton(encounter: string, page: string): SkellyData | null {
  if (Number(getProperty("_knuckleboneDrops")) >= 100) return null;
  if (currentRound() !== 0) return null;
  if (myFamiliar() !== Familiar.get("Skeleton of Crimbo Past")) return null;

  return {
    player: Number(myId()),
    gotDrop: page.includes("You acquire an item: <b>knucklebone</b>"),
    dropsToday: Number(getProperty("_knuckleboneDrops")),
    location: toNormalisedString(myLocation()),
    baseWeight: familiarWeight(Familiar.get("Skeleton of Crimbo Past")),
    buffedWeight:
      familiarWeight(Familiar.get("Skeleton of Crimbo Past")) +
      weightAdjustment(),
    turn: myTotalTurnsSpent(),
    hasCane: haveEquipped(
      Item.get("small peppermint-flavored sugar walking crook"),
    ),
    phylum: lastMonster().phylum.toString(),
    monster: toNormalisedString(lastMonster()),
    dropText: extractKnuckleText(page),
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
  since: 28774, // tracking for knucklebone drops
};
