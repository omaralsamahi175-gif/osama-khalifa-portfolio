import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { cache, type ReactNode } from "react"
import { compileMDX } from "next-mdx-remote/rsc"
import { CaseMetrics } from "@/components/mdx/CaseMetrics"
import { CaseSection } from "@/components/mdx/CaseSection"
import { Decision, Decisions } from "@/components/mdx/Decision"
import { SystemSection } from "@/components/mdx/SystemSection"
import { getCaseAsset } from "./site"
import type { CaseMeta, Post } from "./types"

const CONTENT = path.join(process.cwd(), "content")

async function mdxFiles(dir: string) {
  const files = (await readdir(path.join(CONTENT, dir))).filter((f) => f.endsWith(".mdx"))
  return Promise.all(files.map(async (f) => ({ slug: f.replace(/\.mdx$/, ""), source: await readFile(path.join(CONTENT, dir, f), "utf8") })))
}

export type CaseStudy = { meta: CaseMeta; body: ReactNode }

/**
 * Compiles every case study once per build. The same compiled `body` is passed
 * to the home-page overlay and to /work/[slug], so both render identical MDX.
 */
export const getCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  const files = await mdxFiles("work")
  const studies = await Promise.all(
    files.map(async ({ slug, source }) => {
      // First pass reads frontmatter so per-file components can close over it.
      const { frontmatter } = await compileMDX<Omit<CaseMeta, "slug">>({ source, options: { parseFrontmatter: true } })
      const meta: CaseMeta = { ...frontmatter, slug }
      const asset = getCaseAsset(slug)
      const { content } = await compileMDX({
        source,
        options: { parseFrontmatter: true },
        components: {
          Section: CaseSection,
          Decisions,
          Decision,
          Metrics: () => <CaseMetrics metrics={meta.metrics} />,
          SystemSection: () => <SystemSection file={meta} asset={asset} />,
        },
      })
      return { meta, body: content }
    }),
  )
  return studies.sort((a, b) => a.meta.number.localeCompare(b.meta.number))
})

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((s) => s.meta.slug === slug)
}

/** "N MIN" at 200 wpm from the MDX body (frontmatter and comments excluded); undefined for an empty body. */
function readTime(source: string) {
  const body = source.replace(/^---[\s\S]*?---/, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  const words = body.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length
  return words >= 50 ? `${Math.max(1, Math.round(words / 200))} MIN` : undefined
}

export const getPosts = cache(async (): Promise<Post[]> => {
  const files = await mdxFiles("writing")
  const posts = await Promise.all(
    files.map(async ({ slug, source }) => {
      const { frontmatter } = await compileMDX<Omit<Post, "slug">>({ source, options: { parseFrontmatter: true } })
      return { ...frontmatter, url: frontmatter.url || "", readTime: readTime(source), slug }
    }),
  )
  return posts.sort((a, b) => a.number.localeCompare(b.number))
})
