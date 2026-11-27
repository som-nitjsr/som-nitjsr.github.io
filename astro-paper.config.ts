import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://som-nitjsr.github.io",
    title: "Digital Leadership Lab",
    description:
      "Strategic insights for CTOs and technology leaders. Expert perspectives on Digital Transformation, Platform Thinking, and Strategic Leadership for the modern tech executive.",
    author: "Somnath Shukla",
    profile: "https://som-nitjsr.github.io/about/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Kolkata",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/somnathshukla/",
      linkTitle: "Somnath Shukla on LinkedIn",
    },
    {
      name: "github",
      url: "https://github.com/som-nitjsr",
      linkTitle: "Somnath Shukla on GitHub",
    },
    {
      name: "x",
      url: "https://x.com/som_nitjsr",
      linkTitle: "Somnath Shukla on X",
    },
  ],
  shareLinks: [
    {
      name: "linkedin",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=",
    },
    {
      name: "x",
      url: "https://x.com/intent/post?url=",
    },
    {
      name: "whatsapp",
      url: "https://wa.me/?text=",
    },
    {
      name: "mail",
      url: "mailto:?subject=See%20this%20post&body=",
    },
  ],
});
