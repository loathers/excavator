-- @param {String} $1:project
-- @param {Int} $2:offset
-- @param {Int} $3:limit For no limit, use NULL or "ALL"
SELECT 
  "SpadingData"."dataHash",
  "SpadingData"."data",
  COUNT("Report"."id")::int AS "count"
FROM 
  "SpadingData"
LEFT JOIN 
  "Report"
ON 
  "SpadingData"."id" = "Report"."dataId"
WHERE "project" LIKE $1
GROUP BY 
  "SpadingData"."dataHash",
  "SpadingData"."data"
OFFSET $2
LIMIT $3;