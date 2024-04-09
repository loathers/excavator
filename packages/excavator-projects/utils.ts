import {
  canInteract,
  Effect,
  gamedayToInt,
  haveEffect,
  haveEquipped,
  inHardcore,
  Item,
  Location,
  Monster,
  moonLight,
  moonPhase,
  myClass,
  myDaycount,
  myLocation,
  myPath,
  Path,
} from "kolmafia";

const ALTERING_EFFECTS = Effect.get([
  "Can Has Cyborger",
  "Dis Abled",
  "Haiku State of Mind",
  "Just the Best Anapests",
  "O Hai!",
  "Robocamo",
  "Temporary Blindness",
]);
const ALTERING_EQUIPMENT = Item.get([
  "makeshift turban",
  "papier-mâchine gun",
  "papier-mâchéte",
  "staph of homophones",
  "sword behind inappropriate prepositions",
]);
const ALTERING_LOCATIONS = Location.get(["The Haiku Dungeon"]);

export function isAdventureTextAltered(): boolean {
  return (
    ALTERING_EFFECTS.some((effect) => haveEffect(effect)) ||
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

export function toNormalisedString(thing: Item | Monster | Location) {
  return `[${thing.id}]${"name" in thing ? thing.name : thing.toString()}`;
}

export function notNull<T>(value: T | null): value is T {
  return value !== null;
}
