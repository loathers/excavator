import { getProperty, Monster, myPath, Path } from "kolmafia";

import { ExcavatorProject } from "../type.js";
import { toNormalisedString } from "../utils.js";

export const BLUE_TEAM_MONSTERS: ExcavatorProject = {
  description: "Logs Blue Team monster team for the Blue vs. Red path",
  author: "Rinn",
  name: "Blue Team Monster Team",
  slug: "blueteammonsterteam",
  since: 29167,
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
  },
};

export const RED_TEAM_MONSTERS: ExcavatorProject = {
  description: "Logs Red Team monster team for the Blue vs. Red path",
  author: "Rinn",
  name: "Red Team Monster Team",
  slug: "redteammonsterteam",
  since: 29167,
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
  if (monster === Monster.none) return null;

  return {
    monster: toNormalisedString(monster),
    color: color,
  };
}
