export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Makes a slug unique against a list of slugs already stored in the table. */
export function uniqueSlug(base: string, taken: string[], fallback = "item"): string {
  const root = slugify(base) || fallback;
  if (!taken.includes(root)) return root;
  let counter = 2;
  while (taken.includes(`${root}-${counter}`)) counter += 1;
  return `${root}-${counter}`;
}
