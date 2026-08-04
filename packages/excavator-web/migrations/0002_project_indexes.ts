import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex("SpadingData_lower_project_idx")
    .ifNotExists()
    .on("SpadingData")
    .expression(sql`LOWER(project)`)
    .execute();

  await db.schema
    .createIndex("Report_dataId_idx")
    .ifNotExists()
    .on("Report")
    .column("dataId")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("Report_dataId_idx").ifExists().execute();
  await db.schema
    .dropIndex("SpadingData_lower_project_idx")
    .ifExists()
    .execute();
}
