import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { SocialCard } from "@/components/SocialCard"

export const OG_SIZE = { width: 1200, height: 630 }

/** Satori can't read woff2, so OG images use the full JetBrains Mono TTF from assets/og. */
export async function renderSocialCard(props: { title: string; caption: string; number: string }) {
  const font = await readFile(path.join(process.cwd(), "assets/og/JetBrainsMono-Regular.ttf"))
  return new ImageResponse(<SocialCard {...props} />, {
    ...OG_SIZE,
    fonts: [{ name: "JetBrains Mono", data: font, weight: 400, style: "normal" }],
  })
}
