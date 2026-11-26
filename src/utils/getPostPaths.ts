import { getRelativeLocaleUrl } from "astro:i18n";
import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import config from "@/config";

const DATED_FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? []
  );
}

function getFileBasename(filePath: string | undefined): string | undefined {
  if (!filePath) return undefined;
  const parts = filePath.split(/[/\\]/);
  const filename = parts[parts.length - 1];
  return filename?.replace(/\.(md|mdx|markdown)$/i, "");
}

function getIdSlug(id: string): string {
  const postId = id.split("/");
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

export function getPostRouteParams(
  id: string,
  filePath: string | undefined
): { year: string; month: string; day: string; slug: string } | null {
  const basename = getFileBasename(filePath);
  const match = basename?.match(DATED_FILENAME_RE);
  if (match) {
    return {
      year: match[1],
      month: match[2],
      day: match[3],
      slug: match[4],
    };
  }
  const fallbackSlug = getIdSlug(id);
  return fallbackSlug ? null : null;
}

function getPostSlugPath(id: string, filePath: string | undefined): string {
  const dated = getPostRouteParams(id, filePath);
  if (dated) {
    return `${dated.year}/${dated.month}/${dated.day}/${dated.slug}`;
  }
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath)}`;
}

/**
 * Returns a fully navigable URL for use in `<a href>` and RSS links.
 * Preserves Jekyll's `/:year/:month/:day/:title/` permalink structure.
 */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  const dated = getPostRouteParams(id, filePath);
  if (dated) {
    return getRelativeLocaleUrl(
      locale,
      `${dated.year}/${dated.month}/${dated.day}/${dated.slug}/`
    );
  }
  return getRelativeLocaleUrl(locale, `posts/${getPostSlugPath(id, filePath)}`);
}
