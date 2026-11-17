import type { CaseAsset, CaseMeta } from "@/lib/types"
import { Architecture } from "../Architecture"
import { ProductScreen } from "../ProductScreen"
import { CaseSection } from "./CaseSection"

/** 05 — product screenshot (when supplied) above the architecture map. */
export function SystemSection({ file, asset }: { file: CaseMeta; asset?: CaseAsset }) {
  const screens = asset?.screens ?? []
  return (
    <CaseSection number="05" title={screens.length ? "SCREEN / SYSTEM" : "SYSTEM ARCHITECTURE"}>
      {screens.map((screen, i) => (
        <ProductScreen key={screen.image.silver.src} screen={screen} index={i} total={screens.length} title={file.title} />
      ))}
      <Architecture number={file.number} diagram={file.diagram} />
    </CaseSection>
  )
}
