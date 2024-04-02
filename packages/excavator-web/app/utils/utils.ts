export const deslug = (slug: string) => {
  if (slug === "bird-a-day") return slug;
  return slug.replace(/-/g, " ");
};

export const slug = (name: string) => name.replace(/ /g, "-").toLowerCase();

export const getValuesInKeyOrder = <T>(
  obj: Record<string, T>,
  keys: string[],
) =>
  Object.entries(obj)
    .sort(([a], [b]) => keys.indexOf(a) - keys.indexOf(b))
    .map(([, v]) => v);
