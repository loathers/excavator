import { type SpadingData } from "@prisma/client";
import { getSpadingDataCounts } from "@prisma/client/sql";
import { createReadableStreamFromReadable } from "@react-router/node";
import { stringify } from "csv-stringify/sync";
import { Readable } from "node:stream";
import { type LoaderFunctionArgs } from "react-router";

import { db } from "../db.server.js";
import { fromSlug } from "../utils/utils.js";

import { Route } from "./+types/projects.$project[.csv].js";

export async function loader({ params }: Route.LoaderArgs) {
  const project = fromSlug(params.project || "");

  const data = (
    await db.$queryRawTyped(getSpadingDataCounts(project, 0, Infinity))
  ).map(({ count, data }) => ({
    ...(data as SpadingData["data"]),
    _COUNT: count,
  }));

  if (data.length === 0) {
    throw new Response("No data found for this project", { status: 404 });
  }

  const csvString = stringify(data, {
    header: true,
    cast: { boolean: (v) => String(v) },
  });
  const file = createReadableStreamFromReadable(Readable.from(csvString));
  const yyyymmdd = new Date().toISOString().split("T").at(0)?.replace(/-/g, "");
  return new Response(file, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${params.project}-${yyyymmdd}.csv"`,
      "Content-Type": "text/csv",
    },
  });
}
