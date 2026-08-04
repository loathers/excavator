// Column key (lower-cased header) -> entity name. The entity name is used both to
// look the value up in data-of-loathing and as the KoL wiki pseudo-namespace, since
// those are always the same string. Add a new linkable column type with one line here.
export const LINKABLE_COLUMNS: Record<string, string> = {
  item: "Item",
  monster: "Monster",
};

export const getEntity = (header: string): string | undefined =>
  LINKABLE_COLUMNS[header.toLowerCase()];

/**
 * Values are stored as `[<id>]<name>` (see toNormalisedString in excavator-projects)
 * or occasionally as a bare numeric id. Extract the id; the display name comes from
 * data-of-loathing, not from the stored string.
 */
export const parseEntityId = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isInteger(value) ? value : null;
  if (typeof value !== "string") return null;
  const bracket = value.match(/^\[(\d+)\]/);
  if (bracket) return Number(bracket[1]);
  return /^\d+$/.test(value) ? Number(value) : null;
};

/** Key for the resolved-name map, so columns sharing an entity share resolved names. */
export const resolveKey = (entity: string, id: number) => `${entity}:${id}`;

export const wikiUrl = (entity: string, id: number) =>
  `https://wiki.kingdomofloathing.com/${entity}:${id}`;
