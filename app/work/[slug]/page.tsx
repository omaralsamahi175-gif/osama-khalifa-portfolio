import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CaseStandalone } from "@/components/CaseStandalone"
import { getCaseStudies, getCaseStudy } from "@/lib/content"
import { getCaseAsset, site } from "@/lib/site"

type Params = { params: { slug: string } }

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getCaseStudies()).map((s) => ({ slug: s.meta.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = await getCaseStudy(params.slug)
  if (!study) return {}
  const { seoTitle, summary, slug } = study.meta
  return {
    title: seoTitle,
    description: summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: "article", title: seoTitle, description: summary, url: `/work/${slug}` },
    twitter: { card: "summary_large_image", title: seoTitle, description: summary },
  }
}

export default async function CasePage({ params }: Params) {
  const [study, all] = await Promise.all([getCaseStudy(params.slug), getCaseStudies()])
  if (!study) notFound()
  return <CaseStandalone file={study.meta} asset={getCaseAsset(study.meta.slug)} body={study.body} email={site.email} slugs={all.map((s) => s.meta.slug)} />
}
