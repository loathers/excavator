import { PrismaClient } from "@prisma/client";

import { hashData } from "../../../etl.js";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.spadingData.findMany({
    where: {
      project: "KoL Con 13 Snowglobe",
    },
  });

  await prisma.$transaction(
    data.map((d) =>
      prisma.spadingData.update({
        where: { id: d.id },
        data: {
          dataHash: hashData(
            d.data as unknown as Record<string, string | number | boolean>,
          ),
        },
      }),
    ),
  );

  console.log(data.length, "rows updated");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
