-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_dataId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "SpadingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Delete substat data from KoL Con 13 snowglobe substat data
DELETE FROM "SpadingData"
WHERE
  "project" = 'KoL Con 13 Snowglobe'
  AND "data"->>'type' = 'substat';

-- Update remaining data to remove type
UPDATE "SpadingData"
SET
  "data" = "data" - 'type'
WHERE
  "project" = 'KoL Con 13 Snowglobe'
  AND "data"->>'type' = 'item';