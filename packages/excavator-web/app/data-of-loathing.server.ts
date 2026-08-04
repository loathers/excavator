import { createClient } from "data-of-loathing";

import { getEntity, parseEntityId, resolveKey } from "./utils/entityLinks.js";
import { singleton } from "./utils/singleton.server.js";

// Load the SQLite database once per process. The Node strategy caches it to disk
// (~/.cache/data-of-loathing) and only re-downloads when the server ETag changes.
const clientPromise = singleton("dol", async () => {
  const client = createClient();
  await client.load();
  return client;
});

type Row = { data: unknown };

/**
 * Resolve the official name of every linkable id present on the page.
 * Returns { "Item:1234": "official name", ... }. Degrades to {} on any failure so
 * the table still renders (cells fall back to their raw stored value).
 */
export async function resolveEntityNames(
  rows: Row[],
  headers: string[],
): Promise<Record<string, string>> {
  const idsByEntity = new Map<string, Set<number>>();
  const linkableHeaders = headers.filter((h) => getEntity(h));
  if (linkableHeaders.length === 0) return {};

  for (const row of rows) {
    const data = row.data as Record<string, unknown> | null;
    if (!data) continue;
    for (const header of linkableHeaders) {
      const entity = getEntity(header)!;
      const id = parseEntityId(data[header]);
      if (id === null) continue;
      const ids = idsByEntity.get(entity) ?? new Set<number>();
      ids.add(id);
      idsByEntity.set(entity, ids);
    }
  }

  if (idsByEntity.size === 0) return {};

  try {
    const em = (await clientPromise).query;
    const names: Record<string, string> = {};
    await Promise.all(
      [...idsByEntity].map(async ([entity, ids]) => {
        const results = (await em.find(entity as never, {
          id: { $in: [...ids] },
        })) as { id: number; name: string }[];
        for (const { id, name } of results) {
          names[resolveKey(entity, id)] = name;
        }
      }),
    );
    return names;
  } catch {
    return {};
  }
}
