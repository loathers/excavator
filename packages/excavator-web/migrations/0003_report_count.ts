import { type Kysely, sql } from "kysely";

// Denormalise report counts onto SpadingData (maintained by the etl script,
// the sole writer) so that neither page views nor CSV exports need to
// aggregate the Report table, and index (project, dataHash, reportCount)
// so those reads are index-only. Project lookups move from case-insensitive
// to exact matching - every stored project name is canonical (it comes from
// the excavator-projects definitions) - so the LOWER(project) index from
// 0002 is replaced; an expression index can never serve index-only scans.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("SpadingData")
    .addColumn("reportCount", "integer", (col) => col.notNull().defaultTo(0))
    .execute();

  await sql`
    UPDATE "SpadingData"
    SET "reportCount" = counts.count
    FROM (
      SELECT "dataId", count(*)::int AS count
      FROM "Report"
      GROUP BY "dataId"
    ) counts
    WHERE counts."dataId" = "SpadingData".id
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS "SpadingData_project_dataHash_idx"
    ON "SpadingData" (project, "dataHash") INCLUDE ("reportCount")
  `.execute(db);

  await db.schema
    .dropIndex("SpadingData_lower_project_idx")
    .ifExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex("SpadingData_lower_project_idx")
    .ifNotExists()
    .on("SpadingData")
    .expression(sql`LOWER(project)`)
    .execute();
  await db.schema
    .dropIndex("SpadingData_project_dataHash_idx")
    .ifExists()
    .execute();
  await db.schema.alterTable("SpadingData").dropColumn("reportCount").execute();
}
