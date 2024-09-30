import { getProperty, getVersion, myClass, myDaycount, myPath, print } from "kolmafia";

import { ExcavatorProject } from "../type";

export const BLACK_AND_WHITE_APRON: ExcavatorProject = {
  name: "Black & White Apron",
  slug: "bwapron",
  description: "Spade how the Black & White Apron meals are seeded",
  author: "worthawholebean",
  hooks: {
    CHOICE_VISIT(choice: string, page: string) {
      if (choice !== "1518") return null;
      return spadeBw(page);
    },
  },
};

function spadeBw(page: string) {
  const version = getVersion().match(/KoLmafia r([0-9]+)/)?.[1];
  if (!version || parseInt(version) < 28071) return null;

  const main0 = page.match(
    /name="meal"\s+value="0"\s+data-name="([^"]*)"/,
  )?.[1];
  if (!main0) return null;
  const main = {
    "dinner salad": "lettuce",
    "chicken wings": "chicken",
    "baked potatoes": "potato",
    "beef stew": "beef",
    "fish sandwich": "fish",
    "pork butt": "pork",
  }[main0];
  if (!main) return null;

  const ingredientMatches = Array.from(
    page.matchAll(/name="ingredients([0-9])\[\]"\s+value="([0-9]+)"/g),
  );
  if (ingredientMatches.length !== 15) return null;
  let mealsEaten = parseInt(getProperty("bwApronMealsEaten"));
  if (!Number.isFinite(mealsEaten)) mealsEaten = -1;

  const result = {
    path: myPath().id,
    class: myClass().id,
    day: myDaycount(),
    mealsEaten,
    main,
    ...Object.fromEntries(
      ingredientMatches.map(([, meal, ingredient], index) => [
        `ingredient${meal}${index % 5}`,
        ingredient,
      ]),
    ),
  };
  return result;
}
