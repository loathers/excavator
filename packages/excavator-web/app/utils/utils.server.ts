import { db } from "../db.server.js";

type ProjectData = {
  count: number;
  data: Record<string, any>;
  dataHash: string;
  project: string;
};

export async function loadProjectData(project: string) {
  return await db.$queryRaw<ProjectData[]>`
    SELECT
      COUNT(*) as "count",
      "dataHash",
      "project",
      (
        SELECT
          "data"
        FROM
          "SpadingData" AS "b"
        WHERE
          "b"."dataHash" = "a"."dataHash"
        LIMIT
          1
      )
    FROM
      "SpadingData" AS "a"
    WHERE
      LOWER("project") = LOWER('genie')
    GROUP BY
      "dataHash",
      "project"
  `;
}
