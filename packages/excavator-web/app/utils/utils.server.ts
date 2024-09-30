import { db } from "../db.server.js";

export async function loadProjectData(project: string) {
  return (
    await db.spadingData.findMany({
      where: {
        project: { equals: project, mode: "insensitive" },
      },
      include: {
        _count: {
          select: { reports: true },
        },
      },
    })
  ).map(({ _count, ...rest }) => ({ count: _count.reports, ...rest }));
}
