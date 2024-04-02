/*
  Warnings:

  - Added the required column `dataHash` to the `SpadingData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpadingData" ADD COLUMN     "dataHash" TEXT NOT NULL;
