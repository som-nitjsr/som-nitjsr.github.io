import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);
  const processor = await createMarkdownProcessor();
  const siteBase = config.site.url.replace(/\/+$/, "");

  const items = await Promise.all(
    sortedPosts.map(async ({ data, id, body, filePath }) => {
      const rendered = body ? (await processor.render(body)).code : "";
      const absoluteHtml = rendered
        .replace(
          /(src|href)=["']\/(?!\/)([^"']*)["']/g,
          (_m, attr, rel) => `${attr}="${siteBase}/${rel}"`
        )
        .replace(/]]>/g, "]]]]><![CDATA[>");

      return {
        link: getPostUrl(id, filePath, config.site.lang),
        title: data.title,
        description: data.description,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
        categories: [
          ...new Set([...(data.categories ?? []), ...(data.tags ?? [])]),
        ],
        content: absoluteHtml,
      };
    })
  );

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items,
  });
}
