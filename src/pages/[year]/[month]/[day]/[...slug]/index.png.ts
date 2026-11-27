import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import satori from "satori";
import sharp from "sharp";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import { getPostRouteParams } from "@/utils/getPostPaths";
import { postFilter } from "@/utils/postFilter";
import config from "@/config";

const avatarBase64 = fs
  .readFileSync(path.resolve("public/assets/avatar.jpg"))
  .toString("base64");
const avatarDataUri = `data:image/jpeg;base64,${avatarBase64}`;

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(post => postFilter(post) && !post.data.ogImage)
  );

  return posts.map(post => {
    const routeParams = getPostRouteParams(post.id, post.filePath);
    if (!routeParams) {
      throw new Error(
        `Expected dated filename for post: ${post.filePath ?? post.id}`
      );
    }
    return {
      params: routeParams,
      props: post,
    };
  });
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const fonts = fontData["--font-jakarta"];
  const semiboldPath = getFontPathByWeight(fonts, 600);
  const boldPath = getFontPathByWeight(fonts, 700);

  if (semiboldPath === undefined || boldPath === undefined) {
    throw new Error("Cannot find Plus Jakarta Sans font path for OG image.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(semiboldPath, url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldPath, url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  const categoryLabel =
    props.data.featured_section ??
    props.data.categories?.[0] ??
    "Digital Leadership";

  const svg = await satori(
    {
      key: null,
      type: "div",
      props: {
        style: {
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          boxSizing: "border-box",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          fontFamily: "Plus Jakarta Sans",
          color: "#f8fafc",
          borderTop: "10px solid #006cac",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "#38bdf8",
                      textTransform: "uppercase",
                      marginBottom: "18px",
                    },
                    children: `${config.site.title} · ${categoryLabel}`,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize:
                        props.data.title.length > 65
                          ? 42
                          : props.data.title.length > 45
                            ? 48
                            : 54,
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.2,
                      color: "#ffffff",
                      width: "100%",
                      maxHeight: "280px",
                      overflow: "hidden",
                    },
                    children: props.data.title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #334155",
                paddingTop: "28px",
                width: "100%",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    },
                    children: [
                      {
                        type: "img",
                        props: {
                          src: avatarDataUri,
                          width: 72,
                          height: 72,
                          style: {
                            borderRadius: "9999px",
                            border: "2px solid #38bdf8",
                            objectFit: "cover",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 26,
                                  fontWeight: 700,
                                  color: "#ffffff",
                                },
                                children: props.data.author,
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 20,
                                  fontWeight: 600,
                                  color: "#94a3b8",
                                },
                                children:
                                  "Digital Transformation · Technical Leader",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: 22,
                      fontWeight: 600,
                      color: "#38bdf8",
                    },
                    children: new URL(config.site.url).hostname,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "Plus Jakarta Sans",
          data: regularData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Plus Jakarta Sans",
          data: boldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
