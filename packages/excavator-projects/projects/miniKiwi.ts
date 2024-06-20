import {
  Familiar,
  Item,
  currentRound,
  familiarWeight,
  getProperty,
  haveEquipped,
  lastMonster,
  myFamiliar,
  myId,
  myLocation,
  myPath,
  myTotalTurnsSpent,
  weightAdjustment,
} from "kolmafia";

import { ExcavatorProject } from "../type";
import { toNormalisedString } from "../utils";

type KiwiData = {
  player: number;
  gotDrop: boolean;
  dropsToday: number;
  location: string;
  monster: string;
  baseWeight: number;
  buffedWeight: number;
  turn: number;
  path: string;
  hasGoggles: boolean;
};

function spadeKiwi(encounter: string, page: string): KiwiData | null {
  if (currentRound() !== 0) return null;
  if (myFamiliar() !== Familiar.get("Mini Kiwi")) return null;

  return {
    player: Number(myId()),
    gotDrop: page.includes("You acquire an item: <b>mini kiwi</b>"),
    dropsToday: Number(getProperty("_miniKiwiDrops")),
    location: toNormalisedString(myLocation()),
    path: toNormalisedString(myPath()),
    baseWeight: familiarWeight(Familiar.get("Mini Kiwi")),
    buffedWeight:
      familiarWeight(Familiar.get("Mini Kiwi")) + weightAdjustment(),
    turn: myTotalTurnsSpent(),
    hasGoggles: haveEquipped(Item.get("aviator goggles")),
    monster: toNormalisedString(lastMonster()),
  };
}

export const MINI_KIWI: ExcavatorProject = {
  name: "Mini Kiwi",
  description:
    "Determine the formula and factors of the Mini Kiwi's mini-kiwi drop rate",
  author: "sweaty bill",
  hooks: {
    COMBAT_ROUND: spadeKiwi,
  },
  since: 27973, // mini kiwi familiar equipment added
  completed: true,
};
