import {
  currentRound,
  equippedAmount,
  Item,
  Location,
  myLocation,
} from "kolmafia";

import { ExcavatorProject } from "../type";
import { isEquippedAtEndOfCombat } from "../utils";

const ZONE_PATTERNS = new Map<string, RegExp>([
  [
    "Conspiracy Island",
    /The swarm of mayflies buzzes off into the spooky distance and returns a few minutes later, struggling under the weight of a mysterious coin/,
  ],
  [
    "Dinseylandfill",
    /The swarm of mayflies buzzes off into the distance and returns a few moments later carrying a rolled up FunFunds/,
  ],
  [
    "Twitch",
    /The swarm of mayflies buzzes off into the greasy distance and returns a few minutes later, struggling under the weight of a shiny coin/,
  ],
  [
    "Spring Break Beach",
    /The swarm of mayflies buzzes off into the greasy distance and returns a few minutes later, struggling under the weight of a damp bill/,
  ],
  [
    "The Glaciest",
    /The swarm of mayflies buzzes off into the frigid distance and returns a short while later carrying a rolled up Wal-Mart gift certificate/,
  ],
  [
    "Dreadsylvania",
    /The swarm of mayflies buzzes off into the dreary distance and returns a few minutes later, struggling under the weight of a coin/,
  ],
  [
    "Degrassi Knoll",
    /The swarm of mayflies buzzes off in the direction of one of the myriad workbenches littering the Knoll/,
  ],
]);

const LOCATION_PATTERNS = new Map<Location, RegExp>([
  [
    Location.get("Hobopolis Town Square"),
    /The swarm of mayflies buzzes off into the distance and returns a few minutes later, struggling under the weight of a coin/,
  ],
  [
    Location.get("The Hole in the Sky"),
    /mistakes the swarm of flies for a different (and apparently very frightening) constellation, and runs off so fast it leaves some little bits of itself behind/,
  ],
  [
    Location.get("The Sleazy Back Alley"),
    /The swarm flies into a dumpster, buzzes around for a bit, and flies back out looking slightly larger/,
  ],
  [
    Location.get("The Slime Tube"),
    /The swarm of mayflies plunges into the mass of Slime and emerges a few moments later, coated with goo and carrying a little glob of something/,
  ],
  [
    Location.get("South of The Border"),
    /After the fight is over, one of those annoying kids runs up and tries to sell you some gum/,
  ],
]);

const SWARM_PATTERN = /mayflies(\d+)\.gif/;
const ITEM_PATTERN =
  /The swarm of mayflies buzzes around the ground, helping you find stuff/;
const MEAT_PATTERN =
  /The swarm of mayflies draws your attention to more Meat than you would've otherwise found/;

export const SUMMON_MAYFLY_SWARM: ExcavatorProject = {
  name: "Summon Mayfly Swarm",
  slug: "mayflyswarm",
  description:
    "Spade how swarm size affects result odds when casting Summon Mayfly Swarm",
  author: "Rinn",
  hooks: {
    COMBAT_ROUND: (_: string, page: string) => {
      if (!isEquippedAtEndOfCombat(Item.get("mayfly bait necklace")))
        return null;
      // Must be in a tracked zone or location
      const specialPattern =
        ZONE_PATTERNS.get(myLocation().zone) ??
        LOCATION_PATTERNS.get(myLocation());
      if (!specialPattern) return null;
      // Ensure it was cast and get the swarm size from the image
      const swarmResult = page.match(SWARM_PATTERN);
      if (!swarmResult) return null;
      const swarmSize = Number(swarmResult[1]);
      // either zone or location, no need for multiple columns
      const area = ZONE_PATTERNS.has(myLocation().zone)
        ? myLocation().zone
        : `${myLocation()}`;
      const patterns = {
        special: specialPattern,
        item: ITEM_PATTERN,
        meat: MEAT_PATTERN,
      };
      const result =
        Object.entries(patterns).find(([_, v]) => page.match(v))?.[0] ??
        "nothing";
      return {
        area: area,
        size: swarmSize,
        result: result,
      };
    },
  },
};
