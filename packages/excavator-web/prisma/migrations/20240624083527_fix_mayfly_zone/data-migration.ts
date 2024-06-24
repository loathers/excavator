import { PrismaClient } from "@prisma/client";

import { hashData } from "../../../etl.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const data = await tx.spadingData.findMany({
      where: {
        project: "Summon Mayfly Swarm",
        data: {
          path: ["area"],
          equals: "Conspiracy Island",
        },
      },
    });

    for (const datum of data) {
      await tx.spadingData.update({
        where: { id: datum.id },
        data: {
          dataHash: hashData(
            datum.data as unknown as Record<string, string | number | boolean>,
          ),
        },
      });
    }

    console.log(data.length, "rows updated");
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
