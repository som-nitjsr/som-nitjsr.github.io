import kebabcase from "lodash.kebabcase";
import slugify from "slugify";

const hasNonLatin = (str: string): boolean => /[^\x00-\x7F]/.test(str);

/**
 * Slugify a string using a hybrid approach:
 * - Latin strings: slugify (e.g. "E2E Testing" → "e2e-testing")
 *   with `/` and `.` normalized so tag/category slugs are valid URL segments
 * - Strings with non-Latin chars: lodash.kebabcase (preserves non-Latin chars)
 */
export const slugifyStr = (str: string): string => {
  if (hasNonLatin(str)) {
    return kebabcase(str);
  }
  const normalized = str.replace(/\//g, "-").replace(/^\./, "dot-");
  return slugify(normalized, { lower: true, strict: true }) || "other";
};

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
