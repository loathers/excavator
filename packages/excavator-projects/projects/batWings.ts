import { availableAmount, currentRound, getProperty, haveEquipped, Item, myAscensions, myDaycount, myId, sessionStorage } from "kolmafia";
import { ExcavatorData, ExcavatorProject } from "../type";

export const BAT_WINGS: ExcavatorProject = {
  name: "Bat Wings",
  description: "Track activations of the Bat Wings free fights",
  author: "sweaty bill",
  since: 28078, //  track remaining bat wing skills
  hooks: {
    COMBAT_ROUND: spadeBatWings
  }
}

type BatwingData = {
  userAscensionDay: string; // Used to assemble multiple data points into a single cohesive set
  wingsEquipped: boolean; // We include data without wings equipped in case it's kramco-like
  triggersToday: number; // Calculated _after_ the wings trigger; so "triggersToday" is 1 on your first trigger
  encounterWasFree: boolean; // independent of `wingsTriggered`; wings cannot trigger when a fight is natively free
  victory: boolean; // Checks for WINWINWIN
  wingsTriggered: boolean; // Checks if the wings triggerd on this particular combat
}



function spadeBatWings(encounter: string, page: string): BatwingData | null {
  if (currentRound() !== 0) return null;
  if (!availableAmount(Item.get("bat wings"))) return null;

  const wingsTriggered = page.includes("You flap your bat wings gustily");
  const triggersToday = Number(getProperty("_batWingsFreeFights"));
  if (triggersToday >= 5 && !wingsTriggered) return null;
  return {
    userAscensionDay: `${myId()};${myAscensions()};${myDaycount()}`,
    wingsEquipped: haveEquipped(Item.get("bat wings")),
    wingsTriggered,
    triggersToday,
    victory: page.includes("WINWINWIN"),
    encounterWasFree: page.includes('FREEFREEFREE')
  }

}