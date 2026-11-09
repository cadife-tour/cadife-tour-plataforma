import { destinationPages } from "@/content/destinationPages";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cadifetour.com.br";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...destinationPages.map(({ slug }) => ({ url: new URL(`/destinos/${slug}`, baseUrl).href })),
  ];
}
