import { Portfolio } from "@/components/Portfolio"
import { getCaseStudies, getPosts } from "@/lib/content"
import { caseAssets, site } from "@/lib/site"

export default async function HomePage() {
  const [studies, posts] = await Promise.all([getCaseStudies(), getPosts()])
  return (
    <Portfolio
      cases={studies.map((s) => s.meta)}
      bodies={Object.fromEntries(studies.map((s) => [s.meta.slug, s.body]))}
      posts={posts}
      assets={caseAssets}
      site={site}
    />
  )
}
