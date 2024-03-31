-- CreateTable
CREATE TABLE "SpadingData" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "playerId" INTEGER NOT NULL,
    "project" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "SpadingData_pkey" PRIMARY KEY ("id")
);
