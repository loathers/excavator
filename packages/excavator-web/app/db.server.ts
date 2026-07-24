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

export function createDb() {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
      cursor: Cursor,
    }),
  });
}

// hard-code a unique key so we can look up the client when this module gets re-imported
export const db = singleton("kysely", createDb);

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
