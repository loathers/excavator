import { currentRound, myFamiliar, Familiar, familiarWeight, weightAdjustment } from "kolmafia";
import { ExcavatorProject } from "../type";

type RiftletData = {
  free: boolean;
  weight: number;
  gaveAdventure: boolean;
}

function spadeRiftlet(encounter: string, page: string
): RiftletData | null {
  const riftlet = Familiar.get("Temporal Riftlet")
    if (currentRound() !== 0) return null;
    if (myFamiliar() !== riftlet) return null;

    return {
      weight: familiarWeight(riftlet) + weightAdjustment() + riftlet.soupWeight + (riftlet.feasted ? 10 : 0),
      gaveAdventure: page.includes("shimmers briefly, and you feel it getting earlier."),
      free: page.includes("FREEFREEFREE")
    }
}

export const TEMPORAL_RIFTLET: ExcavatorProject = {
  name: "Temporal Riftlet",
  description: "Determine the relationship between hit rate, riftlet weight, and freeness.",
  author: "sweaty bill",
  hooks: {
    COMBAT_ROUND: spadeRiftlet
  }
}