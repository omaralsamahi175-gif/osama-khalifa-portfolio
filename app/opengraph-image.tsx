import { OG_SIZE, renderSocialCard } from "@/lib/og"

export const alt = "Osama Khalifa: Built through every layer."
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return renderSocialCard({ title: "Built through\nevery layer.", caption: "NEXT.JS · .NET · POSTGRESQL · AI", number: "00" })
}
