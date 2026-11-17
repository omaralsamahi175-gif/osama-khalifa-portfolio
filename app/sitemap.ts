import type { MetadataRoute } from "next"
import { getCaseStudies } from "@/lib/content"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const studies = await getCaseStudies()
  return [{ url: `${SITE_URL}/` }, ...studies.map((s) => ({ url: `${SITE_URL}/work/${s.meta.slug}` }))]
}
