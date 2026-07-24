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
  reportCount: Generated<number>;
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

// Project names must be canonical (from excavator-projects) - lookups are
// exact so they can use the (project, dataHash, reportCount) index
export function getSpadingDataCounts(project: string) {
  return db
    .selectFrom("SpadingData")
    .select((eb) => [
      "dataHash",
      "data",
      eb.cast<number>(eb.fn.sum("reportCount"), "integer").as("count"),
    ])
    .where("project", "=", project)
    .groupBy(["dataHash", "data"])
    .orderBy("dataHash");
}

export function getSpadingDataCountsPage(
  project: string,
  offset: number,
  limit: number,
) {
  const page = db
    .selectFrom("SpadingData")
    .select("dataHash")
    .where("project", "=", project)
    .groupBy("dataHash")
    .orderBy("dataHash")
    .offset(offset)
    .limit(limit);

  return db
    .selectFrom("SpadingData")
    .innerJoin(page.as("page"), "page.dataHash", "SpadingData.dataHash")
    .select((eb) => [
      "SpadingData.dataHash",
      "SpadingData.data",
      eb.cast<number>(eb.fn.sum("reportCount"), "integer").as("count"),
    ])
    .where("SpadingData.project", "=", project)
    .groupBy(["SpadingData.dataHash", "SpadingData.data"])
    .orderBy("SpadingData.dataHash")
    .execute();
}

export async function countReports(project: string) {
  const { total } = await db
    .selectFrom("SpadingData")
    .select((eb) =>
      eb
        .cast<number>(
          eb.fn.coalesce(eb.fn.sum("reportCount"), eb.val(0)),
          "integer",
        )
        .as("total"),
    )
    .where("project", "=", project)
    .executeTakeFirstOrThrow();
  return total;
}

export async function countDistinctSpadingData(project: string) {
  const { count } = await db
    .selectFrom(
      db
        .selectFrom("SpadingData")
        .select("dataHash")
        .distinct()
        .where("project", "=", project)
        .as("hashes"),
    )
    .select((eb) => eb.cast<number>(eb.fn.countAll(), "integer").as("count"))
    .executeTakeFirstOrThrow();
  return count;
}

export async function saveReport(
  report: Omit<ReportTable, "dataId">,
  spadingData: Omit<SpadingDataTable, "id" | "reportCount">,
) {
  await db.transaction().execute(async (trx) => {
    const { id: dataId } =
      (await trx
        .insertInto("SpadingData")
        .values(spadingData)
        .onConflict((oc) =>
          oc.columns(["dataHash", "version", "project"]).doNothing(),
        )
        .returning("id")
        .executeTakeFirst()) ??
      (await trx
        .selectFrom("SpadingData")
        .select("id")
        .where("dataHash", "=", spadingData.dataHash)
        .where("version", "=", spadingData.version)
        .where("project", "=", spadingData.project)
        .executeTakeFirstOrThrow());

    const inserted = await trx
      .insertInto("Report")
      .values({ ...report, dataId })
      .onConflict((oc) => oc.column("id").doNothing())
      .returning("id")
      .executeTakeFirst();

    if (inserted) {
      await trx
        .updateTable("SpadingData")
        .set((eb) => ({ reportCount: eb("reportCount", "+", 1) }))
        .where("id", "=", dataId)
        .execute();
    }
  });
}
