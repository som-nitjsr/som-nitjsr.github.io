import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type CategoryInfo = {
  category: string;
  categoryName: string;
  count: number;
};

/**
 * Builds a de-duplicated, sorted category list with post counts.
 */
export function getUniqueCategories(
  posts: CollectionEntry<"posts">[]
): CategoryInfo[] {
  const map = new Map<string, CategoryInfo>();

  for (const post of posts.filter(postFilter)) {
    for (const raw of post.data.categories ?? []) {
      const slug = slugifyStr(raw);
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { category: slug, categoryName: raw, count: 1 });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );
}
