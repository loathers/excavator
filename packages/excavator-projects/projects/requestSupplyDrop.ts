import { ExcavatorProject } from "../type";

export const REQUEST_SUPPLY_DROP_LETTER: ExcavatorProject = {
  name: "Request Supply Drop Letter",
  slug: "supplydropletter",
  description: "Logs letters from successful Request Supply Drop requests",
  author: "Rinn",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      if (choice !== "1561" && choice != "1563") return null;
      return spadeRequestSupplyDropLetter(page);
    },
    CHOICE: (url: string, page: string) => {
      if (
        !url.includes("whichchoice=1561") &&
        !url.includes("whichchoice=1563")
      )
        return null;
      return spadeRequestSupplyDropLetter(page);
    },
  },
};

export const REQUEST_SUPPLY_DROP_GREY: ExcavatorProject = {
  name: "Request Supply Drop Grey Text",
  slug: "supplydropgrey",
  description: "Logs grey text from invalid Request Supply Drop requests",
  author: "Rinn",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      if (choice !== "1561" && choice != "1563") return null;
      return spadeRequestSupplyDropGrey(page);
    },
    CHOICE: (url: string, page: string) => {
      if (
        !url.includes("whichchoice=1561") &&
        !url.includes("whichchoice=1563")
      )
        return null;
      return spadeRequestSupplyDropGrey(page);
    },
  },
};

function spadeRequestSupplyDropLetter(page: string) {
  // Check page validity
  if (!page.includes("Results:</b>")) return null;

  // Find our number and letter or bail out
  const result = page.match(/(\d+)\.\.\. ([A-Z])\.\.\./);

  if (!result) return null;

  return {
    number: Number.parseInt(result[1]),
    letter: result[2],
  };
}

function spadeRequestSupplyDropGrey(page: string) {
  // Check page validity
  if (!page.includes("Results:</b>")) return null;

  // Find our grey text or bail out
  const result = page.match(/#999'\>([A-Za-z][A-Za-z][A-Za-z])\</);

  if (!result) return null;

  return {
    text: result[1],
  };
}
