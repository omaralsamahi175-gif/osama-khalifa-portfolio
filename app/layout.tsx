import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import type { ReactNode } from "react"
import { SITE_URL, site } from "@/lib/site"
import "@/styles/base.css"
import "@/styles/portfolio.css"
import "@/styles/case-card.css"
import "@/styles/writing-row.css"
import "@/styles/spec-additions.css"

// Same self-hosted subsets the Framer site used (see licenses/).
const mono = localFont({
  src: "./fonts/JetBrainsMono-subset.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
})
const pixel = localFont({
  src: "./fonts/DepartureMono-subset.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-pixel",
  adjustFontFallback: false,
})

const title = "Osama Khalifa · Full Stack Engineer (Next.js, .NET, PostgreSQL)"
const description = "Full stack engineer in Cairo building production web apps across frontend, API, data and AI. Case studies: BuildMetrics AI, KACADEMIA, DADBOD."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", title, description, url: "/", siteName: "Osama Khalifa" },
  twitter: { card: "summary_large_image", title, description },
}

export const viewport: Viewport = { themeColor: "#0e0f11", width: "device-width", initialScale: 1 }

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Osama Khalifa",
  jobTitle: "Full Stack Engineer",
  email: `mailto:${site.email}`,
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Tanta University" },
  sameAs: [site.github, site.linkedin].filter(Boolean),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${pixel.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  )
}
