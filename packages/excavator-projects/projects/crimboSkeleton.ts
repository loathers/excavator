import {
  currentRound,
  Familiar,
  familiarWeight,
  getProperty,
  haveEquipped,
  Item,
  lastMonster,
  myFamiliar,
  myLocation,
  weightAdjustment,
} from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedString } from "../utils.js";

type SkellyData = {
  gotDrop: boolean;
  dropsToday: number;
  location: string;
  monster: string;
  baseWeight: number;
  buffedWeight: number;
  phylum: string;
  skeleton: boolean;
  hasCane: boolean;
  dropText: number;
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
  if (!page.includes("WINWINWIN")) return null;

  const monster = lastMonster();

  return {
    gotDrop: page.includes("You acquire an item: <b>knucklebone</b>"),
    dropsToday: Number(getProperty("_knuckleboneDrops")),
    location: toNormalisedString(myLocation()),
    baseWeight: familiarWeight(Familiar.get("Skeleton of Crimbo Past")),
    buffedWeight:
      familiarWeight(Familiar.get("Skeleton of Crimbo Past")) +
      weightAdjustment(),
    hasCane: haveEquipped(
      Item.get("small peppermint-flavored sugar walking crook"),
    ),
    phylum: monster.phylum.toString(),
    skeleton: monster.attributes.includes("SKELETON"),
    monster: toNormalisedString(monster),
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
  since: 28778, // skeleton monster tracking
};
