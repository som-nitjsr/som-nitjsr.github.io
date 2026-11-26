import type { CollectionEntry } from "astro:content";

/**
 * Returns a clean prose summary for a post card.
 * Falls back to a plain-text excerpt from the body when frontmatter
 * `description` is empty or contains legacy pipe-separated keywords.
 */
export function getPostSummary(
  post: Pick<CollectionEntry<"posts">, "data" | "body">,
  maxLength = 160
): string {
  const desc = post.data.description?.trim() ?? "";
  if (desc && !desc.includes("|")) {
    return desc;
  }

  const plain = (post.body ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength - 3).replace(/\s+\S*$/, "") + "...";
}
