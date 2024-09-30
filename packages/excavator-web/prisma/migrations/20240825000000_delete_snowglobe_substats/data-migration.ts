import { PrismaClient } from "@prisma/client";

import { hashData } from "../../../etl.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const data = await tx.spadingData.findMany({
      where: {
        project: "KoL Con 13 Snowglobe",
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
