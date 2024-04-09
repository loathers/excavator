import {
  getProperty,
  Item,
  itemAmount,
  Location,
  sessionStorage,
  toLocation,
} from "kolmafia";

import { ExcavatorProject } from "../type";

export const AUTUMNATON: ExcavatorProject = {
  name: "Autumnaton",
  description: "Determine difficulty level of zones autumnaton is sent to.",
  author: "midleyc",
  hooks: {
    COMBAT_ROUND: (meta: string, page: string) => {
      const location = getProperty("autumnatonQuestLocation");
      if (location) {
        sessionStorage.setItem("lastQuestLocation", location);
      }

      // If the quest is done, the autumn-aton returns
      if (!page.includes("You acquire an item: <b>autumn-aton")) return null;

      const lastQuestLocation = sessionStorage.getItem("lastQuestLocation");

      // Exit if we don't know where the autumn-aton was sent
      if (!lastQuestLocation) {
        return null;
      }

      sessionStorage.removeItem("lastQuestLocation");

      return endQuest(lastQuestLocation, page);
    },
  },
};

const UPGRADE_TO_LOCATION_DETAILS = {
  "energy-absorptive hat": "low outdoor",
  "high performance right arm": "mid outdoor",
  "vision extender": "high outdoor",
  "enhanced left arm": "low indoor",
  "high speed right leg": "mid indoor",
  "radar dish": "high indoor",
  "upgraded left leg": "low underground",
  "collection prow": "mid underground",
  "dual exhaust": "high underground",
} as Record<string, string>;

const MELTABLE_TO_LOCATION_DETAILS = {
  "autumn debris shield": "mid outdoor",
  "autumn leaf pendant": "high outdoor",
  "autumn sweater-weather sweater": "low underground",
} as Record<string, string>;

const ITEM_TO_LOCATION_DETAILS = {
  "autumn leaf": "low outdoor",
  "AutumnFest ale": "low indoor",
  "autumn-spice donut": "mid indoor",
  "autumn breeze": "high indoor",
  "autumn sweater-weather sweater": "low underground",
  "autumn dollar": "mid underground",
  "autumn years wisdom": "high underground",
} as Record<string, string>;

const getLocationDetails = (location: Location) =>
  `${location.difficultyLevel} ${location.environment}`;

function checkUpgrade(location: Location, page: string) {
  const upgrade = page.match(
    /Your autumn-aton also found an? (.+) to upgrade itself./,
  )?.[1];
  if (!upgrade) return null;
  const expected = getLocationDetails(location);
  const actual = UPGRADE_TO_LOCATION_DETAILS[upgrade];

  if (actual === expected) return null;

  return {
    location: location.toString(),
    estimate: actual,
    evidence: `Upgrade ${upgrade}`,
  };
}

function checkItem(location: Location, page: string) {
  const expected = getLocationDetails(location);

  const meltable = Object.keys(MELTABLE_TO_LOCATION_DETAILS).find((m) =>
    page.includes(`You acquire an item: <b>${m}`),
  );

  // If user received meltables, location is known
  if (meltable) {
    const actual = MELTABLE_TO_LOCATION_DETAILS[meltable];
    if (actual === expected) return null;
    return {
      location: location.toString(),
      estimate: actual,
      evidence: `Item: ${meltable}`,
    };
  }

  // If user has meltables, can't be sure as some Mafia envs are wrong
  if (
    Item.get([
      "autumn debris shield",
      "autumn leaf pendant",
      "autumn sweater-weather sweater",
    ])
      .map((i) => itemAmount(i))
      .some((q) => q > 0)
  )
    return null;

  // user has no meltables
  const acquired = page.match(
    /You acquire an item: <b>([Aa]utumn(?!-aton)[^<]+)<\/b>/,
  )?.[1];

  if (!acquired) return null;

  // If we have a collection prow installed random items can drop, so this work is less useful.
  if (getProperty("autumnatonUpgrades").includes("cowcatcher")) return null;

  const actual = ITEM_TO_LOCATION_DETAILS[acquired];

  if (actual === expected) return null;

  return {
    location: location.toString(),
    estimate: actual,
    evidence: `Item: ${acquired}`,
  };
}

function endQuest(locationName: string, page: string) {
  const location = toLocation(locationName);
  return checkUpgrade(location, page) || checkItem(location, page);
}
