import { db } from "../db.server.js";

export async function loadProjectData(project: string) {
  const separatedByVersion = (
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

  type T = Omit<(typeof separatedByVersion)[0], "version">;

  return Object.values(
    separatedByVersion.reduce<Record<string, T>>(
      (acc, { version, ...datum }) => ({
        ...acc,
        [datum.dataHash]: acc[datum.dataHash]
          ? {
              ...acc[datum.dataHash],
              count: acc[datum.dataHash].count + datum.count,
            }
          : datum,
      }),
      {},
    ),
  );
}
