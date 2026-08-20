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
  slug: "blueteammonsteralignment",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      const color = getProperty("blueVsRedTeam");
      if (color !== "blue") return null;
      const choiceId = parseInt(choice, 10);
      return spadeMonsterTeamAlignedColor(choiceId, page, color);
    },
    CHOICE: (url: string, page: string) => {
      const color = getProperty("blueVsRedTeam");
      if (color !== "blue") return null;
      const match = url.match(/whichchoice=(\d+)/);
      const choiceId = match ? parseInt(match[1], 10) : 0;
      return spadeMonsterTeamAlignedColor(choiceId, page, color);
    },
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (currentRound() !== 0) return null;
      if (myPath() !== Path.get("Blue vs. Red")) return null;
      if (getProperty("blueVsRedTeam") !== "blue") return null;
      return {
        monster: toNormalisedString(lastMonster()),
        color: "red",
      };
    },
  },
};

export const RED_TEAM_MONSTERS: ExcavatorProject = {
  description: "Logs Red Team monster alignment for the Blue vs. Red path",
  author: "Rinn",
  name: "Red Team Monsters",
  slug: "redteammonsteralignment",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      const color = getProperty("blueVsRedTeam");
      if (color !== "red") return null;
      const choiceId = parseInt(choice, 10);
      return spadeMonsterTeamAlignedColor(choiceId, page, color);
    },
    CHOICE: (url: string, page: string) => {
      const color = getProperty("blueVsRedTeam");
      if (color !== "red") return null;
      const match = url.match(/whichchoice=(\d+)/);
      const choiceId = match ? parseInt(match[1], 10) : 0;
      return spadeMonsterTeamAlignedColor(choiceId, page, color);
    },
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (currentRound() !== 0) return null;
      if (myPath() !== Path.get("Blue vs. Red")) return null;
      if (getProperty("blueVsRedTeam") !== "red") return null;
      return {
        monster: toNormalisedString(lastMonster()),
        color: "blue",
      };
    },
  },
};

function spadeMonsterTeamAlignedColor(
  choice: number,
  page: string,
  color: string,
) {
  if (choice < 1604 || choice > 1636) return null;
  if (myPath() !== Path.get("Blue vs. Red")) return null;

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
