import { db } from "../db.server.js";

type ProjectData = {
  count: number;
  data: Record<string, any>;
  dataHash: string;
  project: string;
};

export async function loadProjectData(project: string) {
  return await db.$queryRaw<ProjectData[]>`
    SELECT "a"."count",
        "a"."dataHash",
        "b"."data",
        "b"."project"
    FROM
    (
        SELECT COUNT(*) as "count",
              "dataHash"
        FROM "SpadingData"
        WHERE LOWER("project") = LOWER(${project})
        GROUP BY "dataHash"
    ) AS "a"
        LEFT JOIN "SpadingData" as "b"
            ON "a"."dataHash" = "b"."dataHash"
  `;
}
