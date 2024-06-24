-- Update the area of Mayfly data to be the zone instead of the location. This was only done for Conspiracy Island locations.
UPDATE "SpadingData"
SET
  "data" = jsonb_set (data, '{area}', '"Conspiracy Island"')
WHERE
  "project" = 'Summon Mayfly Swarm'
  AND "data"->>'area' IN (
    'The Secret Government Laboratory',
    'The Mansion of Dr. Weirdeaux',
    'The Deep Dark Jungle'
  );