import { type Generated, Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import Cursor from "pg-cursor";

import { singleton } from "./utils/singleton.server.js";

export type SpadingDataObject = {
  [key: string]: string | number | boolean;
};

export interface SpadingDataTable {
  id: Generated<number>;
  project: string;
  version: string;
  data: SpadingDataObject;
  dataHash: string;
}

export interface ReportTable {
  id: number;
  playerId: number;
  createdAt: Date;
  dataId: number;
}

export interface Database {
  SpadingData: SpadingDataTable;
  Report: ReportTable;
}

// hard-code a unique key so we can look up the client when this module gets re-imported
export const db = singleton(
  "kysely",
  () =>
    new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
        cursor: Cursor,
      }),
    }),
);

export function getSpadingDataCounts(project: string) {
  return db
    .selectFrom("SpadingData")
    .leftJoin("Report", "SpadingData.id", "Report.dataId")
    .select((eb) => [
      "SpadingData.dataHash",
      "SpadingData.data",
      eb.cast<number>(eb.fn.count("Report.id"), "integer").as("count"),
    ])
    .where("SpadingData.project", "ilike", project)
    .groupBy(["SpadingData.dataHash", "SpadingData.data"])
    .orderBy("SpadingData.dataHash");
}

export async function countReports(project: string) {
  const { total } = await db
    .selectFrom("Report")
    .innerJoin("SpadingData", "SpadingData.id", "Report.dataId")
    .select((eb) => eb.cast<number>(eb.fn.countAll(), "integer").as("total"))
    .where("SpadingData.project", "ilike", project)
    .executeTakeFirstOrThrow();
  return total;
}

export async function countDistinctSpadingData(project: string) {
  const { count } = await db
    .selectFrom("SpadingData")
    .select((eb) =>
      eb
        .cast<number>(eb.fn.count("dataHash").distinct(), "integer")
        .as("count"),
    )
    .where("project", "ilike", project)
    .executeTakeFirstOrThrow();
  return count;
}

export async function saveReport(
  report: Omit<ReportTable, "dataId">,
  spadingData: Omit<SpadingDataTable, "id">,
) {
  const { id: dataId } =
    (await db
      .insertInto("SpadingData")
      .values(spadingData)
      .onConflict((oc) =>
        oc.columns(["dataHash", "version", "project"]).doNothing(),
      )
      .returning("id")
      .executeTakeFirst()) ??
    (await db
      .selectFrom("SpadingData")
      .select("id")
      .where("dataHash", "=", spadingData.dataHash)
      .where("version", "=", spadingData.version)
      .where("project", "=", spadingData.project)
      .executeTakeFirstOrThrow());

  await db
    .insertInto("Report")
    .values({ ...report, dataId })
    .onConflict((oc) => oc.column("id").doNothing())
    .execute();
}
