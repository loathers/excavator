import {
  LoaderFunctionArgs,
  createReadableStreamFromReadable,
} from "@remix-run/node";
import { stringify } from "csv-stringify/sync";
import { Readable } from "node:stream";

import { fromSlug } from "../utils/utils.js";
import { loadProjectData } from "../utils/utils.server.js";

export async function loader({ params }: LoaderFunctionArgs) {
  const project = fromSlug(params.project || "");

  const data = await loadProjectData(project);

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
