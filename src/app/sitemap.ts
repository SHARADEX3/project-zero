import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { baseUrlFromHeaders } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const base = baseUrlFromHeaders(h);

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];
}
