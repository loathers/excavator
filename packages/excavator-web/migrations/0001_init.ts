import { type Kysely, sql } from "kysely";

// Baseline replicating the schema previously managed by Prisma. Every
// statement guards with ifNotExists so this is a no-op against the
// already-provisioned production database.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("SpadingData")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("project", "text", (col) => col.notNull())
    .addColumn("version", "text", (col) => col.notNull())
    .addColumn("data", "jsonb", (col) => col.notNull())
    .addColumn("dataHash", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("SpadingData_dataHash_version_project_key")
    .ifNotExists()
    .on("SpadingData")
    .columns(["dataHash", "version", "project"])
    .unique()
    .execute();

  await db.schema
    .createTable("Report")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("playerId", "integer", (col) => col.notNull())
    .addColumn("createdAt", sql`timestamp(3)`, (col) => col.notNull())
    .addColumn("dataId", "integer", (col) =>
      col
        .notNull()
        .references("SpadingData.id")
        .onDelete("cascade")
        .onUpdate("cascade"),
    )
    .execute();

  // Clean up the migrations table left behind by Prisma, which previously
  // managed this schema
  await db.schema.dropTable("_prisma_migrations").ifExists().execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Report").ifExists().execute();
  await db.schema.dropTable("SpadingData").ifExists().execute();
}
