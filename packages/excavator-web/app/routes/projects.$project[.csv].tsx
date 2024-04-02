import {
  LoaderFunctionArgs,
  createReadableStreamFromReadable,
} from "@remix-run/node";
import { stringify } from "csv-stringify/sync";
import { Readable } from "node:stream";

import { deslug } from "../utils/utils.js";
import { loadProjectData } from "../utils/utils.server.js";

export async function loader({ params }: LoaderFunctionArgs) {
  let project = deslug(params.project || "");

  const data = await loadProjectData(project);

  if (data.length === 0) {
    throw new Response("No data found for this project", { status: 404 });
  }

  const csvData = data.map(({ count, data }) => ({
    count: Number(count),
    ...data,
  }));
  const csvString = stringify(csvData, {
    header: true,
    cast: { boolean: (v) => String(v) },
  });
  const file = createReadableStreamFromReadable(Readable.from(csvString));
  return new Response(file, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${params.project}"`,
      "Content-Type": "text/csv",
    },
  });
}
