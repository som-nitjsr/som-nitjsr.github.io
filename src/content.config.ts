import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: () =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      featured_section: z.string().optional(),
      featured_rank: z.number().optional(),
      draft: z.boolean().optional(),
      categories: z.array(z.string()).default([]),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string().optional(),
      description: z.string().default(""),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      hideToc: z.boolean().optional(),
      comments: z.boolean().optional(),
      identifier: z.string().optional(),
      legacyUrl: z.string().optional(),
      permalinkSlug: z.string().optional(),
      faq: z
        .array(
          z.object({
            q: z.string(),
            a: z.string(),
          })
        )
        .optional(),
      // An empty value means "not set", so the site timezone applies.
      timezone: z
        .string()
        .optional()
        .transform(tz => tz || undefined),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
