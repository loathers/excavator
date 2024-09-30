-- Delete substat data from KoL Con 13 snowglobe substat data
DELETE FROM "SpadingData"
WHERE
  "project" = 'KoL Con 13 Snowglobe'
  AND "data"->>'type' = 'substat'

-- Update remaining data to remove type
UPDATE "SpadingData"
SET
  "data" = "data" - "type"
WHERE
  "project" = 'KoL Con 13 Snowglobe'
  AND "data"->>'type' = 'item'