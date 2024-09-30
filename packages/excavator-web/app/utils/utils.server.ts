import { getSpadingDataCounts } from "@prisma/client/sql";

import { db } from "../db.server.js";

export async function loadProjectData(project: string) {
  return await db.$queryRawTyped(getSpadingDataCounts(project));
}
