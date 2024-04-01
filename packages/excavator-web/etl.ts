import { PrismaClient } from "@prisma/client";
import makeFetchCookie from "fetch-cookie";
import crypto from "node:crypto";

const f = makeFetchCookie(fetch);
const prisma = new PrismaClient();

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

async function loadKmails() {
  const request = await f(
    "https://www.kingdomofloathing.com/api.php?what=kmail&for=excavator",
  );
  return (await request.json()) as Kmail[];
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

async function main() {
  if (!(await login())) {
    console.log("Can't log in, probably rollover");
    return;
  }

  for (const kmail of await loadKmails()) {
    try {
      const message = decodeURIComponent(kmail.message.replace(/ /g, ""));
      const { _PROJECT, _VERSION, ...data } = JSON.parse(
        message,
      ) as SpadingData;
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
}

main();
