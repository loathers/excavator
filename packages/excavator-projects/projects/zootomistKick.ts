import { getProperty, myPath, Path } from "kolmafia";

import { ExcavatorProject } from "../type";

type ZootomistKickData = {
  action: string;
  familiar: string;
  heal: string;
  sniffCopies: string;
  banishTurns: string;
  banishELBDuration: string;
  banishFree: boolean;
  instakillFree: boolean;
  instakillYR: boolean;
  instakillELYDuration: string;
  stunTurns: string;
};

function spadeKick(encounter: string, page: string): ZootomistKickData | null {
  if (myPath() != Path.get("Z is for Zootomist")) return null;

  const kick = page.match(
    /You kick your foe with a perfect (left|right)-side side-kick/,
  );
  if (!kick) return null;

  const familiar = getProperty(
    `zootGraftedFoot${kick[1] === "left" ? "Left" : "Right"}Familiar`,
  );
  const instakill = page.match(
    /Your kick is so powerful, it launches your foes? (instantly )?into the sun(, leaving all their stuff behind)?\..*?\(duration: (\d+) Adventures\)/,
  );
  const banish = page.match(
    /Your kick is so fast, that your foes? fl(?:y|ies) off into the distance and likely won't return for (\d+) adventures..*?\(duration: (\d+) Adventures\)(.*?Your kick was so fast that your fight doesn't take any time)?/,
  );

  return {
    action: "kick",
    familiar,
    heal:
      page
        .match(
          /Your attack absorbs some of your foe(?:'s|s') life force\..*?You gain ([\d,]+) hit points\./,
        )?.[1]
        ?.replace(",", "") ?? "0",
    sniffCopies:
      page.match(
        /Your kick lacerates your foe(?:'s|s') .*?, and .*? starts trailing bodily ichor that you can track. \(You will be (.*?) likely to encounter this foe until you track something else\.\)/,
      )?.[1] ?? "",
    banishTurns: banish?.[1] ?? "0",
    banishELBDuration: banish?.[2] ?? "0",
    banishFree: !!(banish?.[3] ?? ""),
    instakillFree: !!(instakill?.[1] ?? ""),
    instakillYR: !!(instakill?.[2] ?? ""),
    instakillELYDuration: instakill?.[3] ?? "0",
    stunTurns:
      page.match(
        /Your kick is so devastating, that your foes? will likely be stunned for (\d+) turns?\./,
      )?.[1] ?? "0",
  };
}

export const ZOOTOMIST_KICK: ExcavatorProject = {
  name: "Zootomist Kick",
  description: "Determine how graft power affects kicks in Z is for Zootomist.",
  author: "gausie",
  hooks: {
    COMBAT_ROUND: spadeKick,
  },
  completed: false,
};
