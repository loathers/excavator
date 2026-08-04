import { createReadableStreamFromReadable } from "@react-router/node";
import { stringify } from "csv-stringify";
import { projects } from "excavator-projects";
import { Readable, pipeline } from "node:stream";

import { getSpadingDataCounts } from "../db.server.js";
import { fromSlug } from "../utils/utils.js";

import { Route } from "./+types/projects.$project[.csv].js";

export async function loader({ params }: Route.LoaderArgs) {
  const projectName = fromSlug(params.project || "").toLowerCase();
  const project = projects.find((p) => p.name.toLowerCase() === projectName);

  if (!project) {
    throw new Response("No project found", { status: 404 });
  }

  const iterator = getSpadingDataCounts(project.name)
    .stream(500)
    [Symbol.asyncIterator]();

  const first = await iterator.next();

  if (first.done) {
    throw new Response("No data found for this project", { status: 404 });
  }

  async function* rows() {
    let result = first;
    while (!result.done) {
      const { data, count } = result.value;
      yield { ...data, _COUNT: count };
      result = await iterator.next();
    }
  }

  const stringifier = stringify({
    header: true,
    cast: { boolean: (v) => String(v) },
  });
  // pipeline (rather than pipe) tears down the row stream - and with it the
  // database cursor - if the client disconnects mid-download
  const csv = pipeline(Readable.from(rows()), stringifier, () => {});
  const file = createReadableStreamFromReadable(csv);
  const yyyymmdd = new Date().toISOString().split("T").at(0)?.replace(/-/g, "");
  return new Response(file, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${params.project}-${yyyymmdd}.csv"`,
      "Content-Type": "text/csv",
    },
  });
}
