import {
  currentRound,
  getProperty,
  lastMonster,
  Monster,
  myPath,
  Path,
} from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedString } from "../utils.js";

export const BLUE_TEAM_MONSTERS: ExcavatorProject = {
  description: "Logs Blue Team monster alignment for the Blue vs. Red path",
  author: "Rinn",
  name: "Blue Team Monsters",
  slug: "blueteammonsters",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      const choiceId = parseInt(choice, 10);
      return spadeMonsterTeamAlignedColor(choiceId, page);
    },
    CHOICE: (url: string, page: string) => {
      const match = url.match(/whichchoice=(\d+)/);
      const choiceId = match ? parseInt(match[1], 10) : 0;
      return spadeMonsterTeamAlignedColor(choiceId, page);
    },
    COMBAT_ROUND: spadeMonsterTeamUnalignedColor,
  },
};

export const RED_TEAM_MONSTERS: ExcavatorProject = {
  description: "Logs Red Team monster alignment for the Blue vs. Red path",
  author: "Rinn",
  name: "Red Team Monsters",
  slug: "redteammonsters",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      const choiceId = parseInt(choice, 10);
      return spadeMonsterTeamAlignedColor(choiceId, page);
    },
    CHOICE: (url: string, page: string) => {
      const match = url.match(/whichchoice=(\d+)/);
      const choiceId = match ? parseInt(match[1], 10) : 0;
      return spadeMonsterTeamAlignedColor(choiceId, page);
    },
    COMBAT_ROUND: spadeMonsterTeamUnalignedColor,
  },
};

function spadeMonsterTeamAlignedColor(choice: number, page: string) {
  if (choice < 1604 || choice > 1636) return null;
  if (myPath() !== Path.get("Blue vs. Red")) return null;

  const color = getProperty("blueVsRedTeam");
  if (color === "") return null;

  if (!page.includes("monsterid:")) return null;

  const result = page.match(/<!-- monsterid: (\d+) -->/);

  if (!result) return null;

  const monsterId = parseInt(result[1], 10);
  const monster = Monster.get(monsterId);

  return {
    monster: toNormalisedString(monster),
    color: color,
  };
}

function spadeMonsterTeamUnalignedColor(encounter: string, page: string) {
  if (currentRound() !== 0) return null;
  if (myPath() !== Path.get("Blue vs. Red")) return null;

  const color = getProperty("blueVsRedTeam");
  if (color === "") return null;

  return {
    monster: toNormalisedString(lastMonster()),
    color: color === "blue" ? "red" : "blue",
  };
}
