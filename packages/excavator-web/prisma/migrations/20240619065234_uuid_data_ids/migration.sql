/*
  Warnings:

  - The primary key for the `SpadingData` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "SpadingData" DROP CONSTRAINT "SpadingData_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SpadingData_pkey" PRIMARY KEY ("id");
