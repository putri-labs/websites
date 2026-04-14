// ~/dev/custompro-landing/app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://customspro.putri-labs.com/sitemap.xml",
  }
}
