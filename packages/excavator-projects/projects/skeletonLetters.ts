import { currentRound, lastMonster, Monster } from "kolmafia";

import { ExcavatorProject } from "../type.js";

type SkeletonLetterData = {
  ribs: string;
  regiment: number;
  monster: string;
};

function spadeSkeletonLetters(
  encounter: string,
  page: string,
): SkeletonLetterData | null {
  if (currentRound() !== 0) return null;
  if (
    !Monster.get([
      "Axis artillery skeleton",
      "Axis grenadier skeleton",
      "Axis infantry skeleton",
      "Axis officer skeleton",
    ]).includes(lastMonster())
  )
    return null;
  const regimentMatch = page.match(
    RegExp(`${lastMonster()}, (\\d+)[a-z]+ regiment</span>`),
  );
  if (regimentMatch) {
    const ribMatch = page.matchAll(
      /\/images\/otherimages\/skeletonwar\/rib(\d)\.png/g,
    );
    const ribs = [...ribMatch].flat().sort().join(",");
    const regiment = Number(regimentMatch[1]);
    const monster = lastMonster().name;
    return { ribs, regiment, monster };
  }
  return null;
}

export const SKELETON_LETTERS: ExcavatorProject = {
  name: "Skeleton Letters",
  description:
    "Determines which ribs are available on which regiments of skeleton",
  author: "sweaty bill",
  hooks: { COMBAT_ROUND: spadeSkeletonLetters },
};
