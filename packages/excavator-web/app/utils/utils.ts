export const deslug = (slug: string) => {
  if (slug === "bird-a-day") return slug;
  return slug.replace(/-/g, " ");
};
