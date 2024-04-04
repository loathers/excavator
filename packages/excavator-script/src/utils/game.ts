import {
  canInteract,
  gamedayToInt,
  haveEquipped,
  inHardcore,
  Item,
  Monster,
  moonLight,
  moonPhase,
  myClass,
  myDaycount,
  myLocation,
  myPath,
  Path,
} from "kolmafia";
import { $effects, $items, $locations, have } from "libram";

const ALTERING_EFFECTS = $effects`Can Has Cyborger, Dis Abled, Haiku State of Mind, Just the Best Anapests, O Hai!, Robocamo, Temporary Blindness`;
const ALTERING_EQUIPMENT = $items`makeshift turban, staph of homophones, sword behind inappropriate prepositions`;
const ALTERING_LOCATIONS = $locations`The Haiku Dungeon`;

export function isAdventureTextAltered(): boolean {
  return (
    ALTERING_EFFECTS.some((effect) => have(effect)) ||
    ALTERING_EQUIPMENT.some((item) => haveEquipped(item)) ||
    ALTERING_LOCATIONS.includes(myLocation())
  );
}

export function getDaySeed() {
  return {
    daycount: myDaycount(),
    class: myClass().id,
    path: myPath().id,
  };
}

export function getGamedaySeed() {
  return {
    gameday: gamedayToInt(),
    moonlight: moonLight(),
    moonphase: moonPhase(),
  };
}

export function getDifficulty() {
  if (myPath() !== Path.none) return "Normal";
  if (!canInteract()) return "Normal (Ronin)";
  if (inHardcore()) return "Hardcore";
  return "Casual";
}

export function getDifficultySeed() {
  return {
    difficulty: getDifficulty(),
  };
}

export function toNormalisedString(thing: Item | Monster) {
  return `[${thing.id}]${thing.name}`;
}
