import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { projects } from "excavator-projects";
import crypto from "node:crypto";

import { db } from "../db.server.js";

const VALID_PROJECTs = projects.map((p) => p.name);

type SpadingData = {
  _PROJECT: string;
  _VERSION: string;
  _PLAYER: string | number;
  [key: string]: string | number | boolean;
};

function isValidSpadingData(data: unknown): data is SpadingData {
  if (typeof data !== "object" || data === null) return false;
  return (
    "_PROJECT" in data &&
    "_VERSION" in data &&
    "_PLAYER" in data &&
    typeof data._PROJECT === "string" &&
    typeof data._VERSION === "string" &&
    (typeof data._PLAYER === "string" || typeof data._PLAYER === "number")
  );
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

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ success: false, message: "Method not allowed" }, 405);
  }
  const payload = await request.json();

  if (!isValidSpadingData(payload)) {
    return json(
      {
        success: false,
        message: "The supplied payload is invalid",
      },
      422,
    );
  }

  const fixed = applyFixes(payload);

  if (fixed === null)
    return json(
      {
        success: false,
        message: `The project ${payload._PROJECT} is outdated, please update excavator`,
      },
      400,
    );

  if (!VALID_PROJECTs.includes(fixed._PROJECT))
    return json(
      {
        success: false,
        message: `The project ${fixed._PROJECT} is not a valid project`,
      },
      404,
    );

  const { _PROJECT, _VERSION, _PLAYER, ...data } = fixed;

  await db.spadingData.create({
    data: {
      createdAt: new Date(),
      playerId: Number(_PLAYER),
      project: _PROJECT,
      version: _VERSION,
      dataHash: hashData(data),
      data,
    },
  });

  return json({ success: true }, 200);
};
