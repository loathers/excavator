import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { projects } from "excavator-projects";
import makeFetchCookie from "fetch-cookie";
import crypto from "node:crypto";

const f = makeFetchCookie(fetch);
const prisma = new PrismaClient();

type Kmail = {
  id: string;
  type: string;
  fromid: string;
  fromname: string;
  localtime: string;
  azunixtime: string;
  message: string;
};

type SpadingData = {
  _PROJECT: string;
  _VERSION: string;
  [key: string]: string | number | boolean;
};

function createBody(data: Record<string, string>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return new URLSearchParams(formData as unknown as Record<string, string>);
}

async function login() {
  const request = await f("https://www.kingdomofloathing.com/login.php", {
    method: "POST",
    body: createBody({
      loggingin: "Yup.",
      loginname: process.env.KOL_USERNAME!,
      password: process.env.KOL_PASSWORD!,
      secure: "0",
      submitbutton: "Log In",
    }),
  });
  return (await request.text()).includes("main.php");
}

function isKmailArray(data: unknown): data is Kmail[] {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return true;
  // Just check the first one
  const d = data[0];
  return (
    typeof d === "object" &&
    typeof d.id === "string" &&
    typeof d.message === "string" &&
    typeof d.fromid === "string" &&
    typeof d.fromname === "string" &&
    typeof d.azunixtime === "string" &&
    typeof d.type === "string" &&
    typeof d.localtime === "string"
  );
}

async function loadKmails() {
  const request = await f(
    "https://www.kingdomofloathing.com/api.php?what=kmail&for=excavator&count=100",
  );
  try {
    const results = await request.json();
    if (!isKmailArray(results)) {
      console.error("Kmails not in expected format");
      return [];
    }
    return results;
  } catch (error) {
    console.error("Failed to load kmails, either logged out or it's rollover");
    return [];
  }
}

async function getPwd() {
  const request = await f(
    "https://www.kingdomofloathing.com/api.php?what=status&for=excavator",
  );
  const json = await request.json();
  return json["pwd"];
}

async function deleteKmails(ids: number[]) {
  const pwd = await getPwd();
  const response = await f("https://www.kingdomofloathing.com/messages.php", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `the_action=delete&pwd=${pwd}&box=Inbox&${ids.map((id) => `sel${id}=on`).join("&")}`,
    credentials: "include",
    method: "POST",
  });
  const text = await response.text();
  return text.includes(`${ids.length} messages deleted.`);
}

function hashData(data: Record<string, string | number | boolean>) {
  return crypto
    .createHash("md5")
    .update(
      Object.entries(data)
        .sort(([a], [b]) => b.localeCompare(a))
        .map((k) => k.join(":"))
        .join(","),
    )
    .digest("hex");
}

function applyFixes(data: SpadingData) {
  // 2024-03-31: The old version of excavator used to have a capital letter here that annoyed gausie
  if (data._PROJECT === "Fresh Coat Of Paint")
    data._PROJECT = "Fresh Coat of Paint";

  // 2024-04-02: Accidentally zero-indexed this item count
  if (data._PROJECT === "Continental Juice Bar" && "item0" in data) {
    data["item3"] = data["item2"];
    data["item2"] = data["item1"];
    data["item1"] = data["item0"];
    delete data["item0"];
  }

  // 2024-04-02: Made a few mistakes here
  if (
    data._PROJECT === "Autumnaton" &&
    ["Item: {acquired}", "Item: autumn-aton"].includes(
      data["evidence"] as string,
    )
  ) {
    return null;
  }

  // 2024-04-02: Added source to Monster Parts
  if (data._PROJECT === "Monster Parts" && !("source" in data)) {
    data["source"] = "Unknown";
  }

  return data;
}

async function main() {
  if (!(await login())) {
    console.log("Can't log in, probably rollover");
    return;
  }

  // Try reloading kmails a load of times to deal with volume
  for (let i = 0; i < 100; i++) {
    const kmails = await loadKmails();

    // If there are no kmails, we're done
    if (kmails.length === 0) break;

    for (const kmail of kmails) {
      try {
        const message = decodeURIComponent(
          kmail.message.replace(/ /g, "").replace(/\+/g, " "),
        );
        const fixed = applyFixes(JSON.parse(message) as SpadingData);

        if (fixed === null) continue;

        const { _PROJECT, _VERSION, ...data } = fixed;

        if (projects.find((project) => project.name === _PROJECT)?.completed)
          continue;

        const id = Number(kmail.id);

        await prisma.spadingData.upsert({
          create: {
            id,
            createdAt: new Date(Number(kmail.azunixtime) * 1000),
            playerId: Number(kmail.fromid),
            project: _PROJECT,
            version: _VERSION,
            dataHash: hashData(data),
            data,
          },
          update: {},
          where: { id },
        });
      } catch (error) {
        const intro = `Kmail ${kmail.id} from ${kmail.fromname} (#${kmail.fromid})`;
        if (error instanceof URIError) {
          console.error(intro, "is poorly encoded");
          continue;
        }
        if (error instanceof SyntaxError) {
          console.error(intro, "contains bad JSON");
          continue;
        }

        console.error(intro, "causes some other error", error);
      }
    }

    const deleteSuccess = await deleteKmails(kmails.map((k) => Number(k.id)));
    deleteSuccess
      ? console.log("Deleted kmails")
      : console.error("Failed to delete kmails");
  }
}

main();
