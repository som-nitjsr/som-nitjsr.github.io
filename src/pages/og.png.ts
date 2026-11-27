import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import config from "@/config";

const avatarBase64 = fs
  .readFileSync(path.resolve("public/assets/avatar.jpg"))
  .toString("base64");
const avatarDataUri = `data:image/jpeg;base64,${avatarBase64}`;

export const GET: APIRoute = async context => {
  const fonts = fontData["--font-jakarta"];
  const semiboldPath = getFontPathByWeight(fonts, 600);
  const boldPath = getFontPathByWeight(fonts, 700);

  if (semiboldPath === undefined || boldPath === undefined) {
    throw new Error("Cannot find Plus Jakarta Sans font path for OG image.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(semiboldPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

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
                    children:
                      "Technical Leadership · Enterprise AI · Business Impact",
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: 64,
                      fontWeight: 700,
                      margin: "0 0 20px",
                      lineHeight: 1.12,
                      color: "#ffffff",
                    },
                    children: config.site.title,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: 28,
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.4,
                      color: "#cbd5e1",
                      maxWidth: "960px",
                    },
                    children: config.site.description,
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
                                children: config.site.author,
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
                                  "Strategic Technology Leader · 20+ Yrs",
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
