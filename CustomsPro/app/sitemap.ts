// ~/dev/custompro-landing/app/sitemap.ts
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://customspro.putri-labs.com",
      lastModified: new Date("2026-04-14"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
