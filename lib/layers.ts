export const LAYERS = [
  { dir: "N", deg: "000", name: "Frontend", code: "OSK-01", color: "#7BC86C", tag: "render ok", tech: "REACT · NEXT.JS · TYPESCRIPT", copy: "Interfaces that stay fast with real data. Virtualized tables, Web Workers, SSR where it counts.", metric: "57 ROUTES MIGRATED · NEXT.JS 14" },
  { dir: "E", deg: "090", name: "API", code: "OSK-02", color: "#4A8FE7", tag: "routes live", tech: "ASP.NET CORE · REST · GRAPHQL", copy: "Clean contracts between client and server. Versioned, documented, predictable errors.", metric: "REST · GRAPHQL · WS · ASP.NET CORE" },
  { dir: "S", deg: "180", name: "Data", code: "OSK-03", color: "#E5484D", tag: "schema sealed", tech: "POSTGRESQL · PRISMA · SUPABASE", copy: "Relational schemas that survive growth. Typed access, no query waterfalls.", metric: "POSTGRESQL · PRISMA · SUPABASE" },
  { dir: "W", deg: "270", name: "AI", code: "OSK-04", color: "#E2B341", tag: "grounded", tech: "RAG · RETRIEVAL · VALIDATION", copy: "AI features with guardrails. Grounded answers, usage limits, nothing made up.", metric: "RAG TUTOR · GROUNDED" },
] as const

/** Two supplied log lines per layer; the radar alternates between them. */
export const MESSAGES: readonly (readonly [string, string])[] = [
  ["57 routes migrated to app router", "BOQ tables virtualized"],
  ["error responses follow RFC 9457", "NextAuth routes protected by middleware"],
  ["query waterfall replaced, 1 round trip", "KACADEMIA schema on PostgreSQL + Prisma"],
  ["tutor answers grounded in course data", "usage limits enforced per account"],
]

export const NAV = [
  ["work", "WORK", "1"],
  ["stack", "STACK", "2"],
  ["log", "LOG", "3"],
  ["writing", "WRITING", "4"],
  ["contact", "CONTACT", "5"],
] as const

export const EASE: [number, number, number, number] = [0.2, 0, 0, 1]

/** Card accent colours, in case order (used by the card system map). */
export const CARD_COLORS = ["#7bc86c", "#4a8fe7", "#e5484d", "#e2b341"]
