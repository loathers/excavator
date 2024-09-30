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
WHERE "project" = $1
GROUP BY 
  "SpadingData"."dataHash",
  "SpadingData"."data";