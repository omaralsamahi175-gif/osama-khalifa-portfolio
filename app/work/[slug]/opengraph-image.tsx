import { getCaseStudies, getCaseStudy } from "@/lib/content"
import { OG_SIZE, renderSocialCard } from "@/lib/og"

export const alt = "Osama Khalifa case study"
export const size = OG_SIZE
export const contentType = "image/png"

export async function generateStaticParams() {
  return (await getCaseStudies()).map((s) => ({ slug: s.meta.slug }))
}

export default async function Image({ params }: { params: { slug: string } }) {
  const study = await getCaseStudy(params.slug)
  const meta = study?.meta
  return renderSocialCard({
    title: meta?.title ?? "Osama Khalifa",
    caption: (meta?.stack ?? "").toUpperCase(),
    number: meta?.number ?? "00",
  })
}
