import { db } from "../db.server.js";

export async function loadProjectData(project: string) {
  return await db.$queryRaw<
    { count: number; data: Record<string, any>; dataHash: string }[]
  >`
    SELECT
      COUNT(*) as "count",
      "dataHash",
      (SELECT "data" FROM "SpadingData" as "b" WHERE "b"."dataHash" = "a"."dataHash" LIMIT 1)
    FROM "SpadingData" as "a"
    WHERE LOWER("project") = LOWER(${project})
    GROUP BY "dataHash"
  `;
}
