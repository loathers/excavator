-- Create temporary table for old data
CREATE TEMPORARY TABLE "SpadingDataTemp" AS 
(
  SELECT
    * 
  FROM
    "SpadingData"
);
TRUNCATE TABLE "SpadingData";

-- AlterTable
CREATE SEQUENCE spadingdata_id_seq;
ALTER TABLE "SpadingData" DROP COLUMN "createdAt",
DROP COLUMN "playerId",
ALTER COLUMN "id" 
SET
  DEFAULT nextval('spadingdata_id_seq');
ALTER SEQUENCE spadingdata_id_seq OWNED BY "SpadingData"."id";

-- CreateIndex
CREATE UNIQUE INDEX "SpadingData_dataHash_version_project_key" 
ON "SpadingData"("dataHash", "version", "project");

-- Copy unique spading data back from temp table
INSERT INTO
  "SpadingData" ("dataHash", "project", "version", "data") 
  SELECT DISTINCT
    ON ("dataHash", "project", "version") "dataHash",
    "project",
    "version",
    "data" 
  FROM
    "SpadingDataTemp";

-- CreateTable
CREATE TABLE "Report" ( "id" INTEGER NOT NULL, "playerId" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL, "dataId" INTEGER NOT NULL, CONSTRAINT "Report_pkey" PRIMARY KEY ("id") );

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "SpadingData"("id") 
ON 
DELETE
  RESTRICT 
  ON 
  UPDATE
    CASCADE;

-- Copy individual reports in fromTemp table
INSERT INTO
  "Report" ("id", "playerId", "createdAt", "dataId") 
  SELECT
    "SpadingDataTemp"."id",
    "SpadingDataTemp"."playerId",
    "SpadingDataTemp"."createdAt",
    "SpadingData"."id" AS "dataId" 
  FROM
    "SpadingDataTemp" 
    JOIN
      "SpadingData" 
      ON "SpadingDataTemp"."dataHash" = "SpadingData"."dataHash" 
      AND "SpadingDataTemp"."version" = "SpadingData"."version" 
      AND "SpadingDataTemp"."project" = "SpadingData"."project";
