import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL, llmsURL: URL) => `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# AI answer-engine crawlers (GEO: allow citation eligibility)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Bytespider
Allow: /

# AI-readable site index: ${llmsURL.href}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  const llmsURL = new URL("llms.txt", site);
  return new Response(getRobotsTxt(sitemapURL, llmsURL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
