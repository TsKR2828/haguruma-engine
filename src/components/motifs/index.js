// Motif registry — book-specific background/interaction VFX（施工圖 §2-3）。
// 每個 motif 提供 { Defs, Overlay }：
//   Defs    — 一次性掛在畫面根部的 SVG defs（clipPath 等共用資源）。
//   Overlay — 疊加在互動元件上的裝飾層（見 ForcedSteps 低 nerve 齒輪特效）。
// book.motif 決定用哪一組；换書只需在這裡加新 key，元件不用改。
import GearDefs from "../GearDefs";
import GearOverlay from "../GearOverlay";

function NoneDefs() {
  return null;
}

function NoneOverlay() {
  return null;
}

export const MOTIFS = {
  gears: { Defs: GearDefs, Overlay: GearOverlay },
  none: { Defs: NoneDefs, Overlay: NoneOverlay },
};

export function getMotif(id) {
  return MOTIFS[id] ?? MOTIFS.none;
}
