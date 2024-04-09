import { projects } from "excavator-projects";

export const findKeyForValue = <K extends string | number | symbol, V>(
  obj: Record<K, V>,
  value: V,
) => Object.entries(obj).find(([, v]) => v === value)?.[0];

const toDefaultSlug = (name: string) => name.replace(/ /g, "-").toLowerCase();
const fromDefaultSlug = (slug: string) => slug.replace(/-/g, " ");
const SLUG_MAP = Object.fromEntries(
  projects.map((p) => [p.name, p.slug || toDefaultSlug(p.name)]),
);
export const fromSlug = (slug: string) =>
  findKeyForValue(SLUG_MAP, slug) || fromDefaultSlug(slug);
export const toSlug = (name: string) => SLUG_MAP[name] || toDefaultSlug(name);

export const getValuesInKeyOrder = <T>(
  obj: Record<string, T>,
  keys: string[],
) =>
  Object.entries(obj)
    .sort(([a], [b]) => keys.indexOf(a) - keys.indexOf(b))
    .map(([, v]) => v);
