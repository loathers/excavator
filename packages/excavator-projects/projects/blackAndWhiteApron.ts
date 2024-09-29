import { dump, print } from "kolmafia";
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
    CHOICE(url: string, page: string) {
      if (new URL(url).searchParams.get("whichchoice") !== "1518") return null;
      return spadeBw(page);
    },
  },
};

function spadeBw(page: string) {
  const main0 = page.match(/name="meal"\s+value="0"\s+data-name="([^"]*)"/)?.[1];
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
  const result = {
    main,
    ...Object.fromEntries(
      ingredientMatches.map(([, meal, ingredient], index) => [
        `ingredient${meal}${index % 5}`,
        ingredient
      ]),
    ),
  };
  return result;
}
