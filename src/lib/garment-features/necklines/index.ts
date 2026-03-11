import { registerFeature } from "../registry";
import type { SilhouetteFeature, FeatureRenderContext } from "../types";
import { CX, SHOULDER_W, SHOULDER_Y, NECK_BASE, NECK_W, BUST_Y, HIP_W, fitExpand } from "../landmarks";

function backNecklinePath(fit: string): string {
  const fw = fitExpand(fit);
  const sw = SHOULDER_W + fw;
  const depth = 8;
  return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 3} ${CX - 12} ${NECK_BASE - depth} ${CX} ${NECK_BASE - depth + 3} C ${CX + 12} ${NECK_BASE - depth} ${CX + sw - 8} ${SHOULDER_Y - 3} ${CX + sw} ${SHOULDER_Y}`;
}

const round: SilhouetteFeature = {
  id: "round",
  category: "neckline",
  label: "Round",
  renderPath({ fit, view }) {
    if (view === "back") return backNecklinePath(fit);
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    const depth = 18;
    return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 4} ${CX - 15} ${NECK_BASE - depth + 2} ${CX} ${NECK_BASE - depth + 8} C ${CX + 15} ${NECK_BASE - depth + 2} ${CX + sw - 8} ${SHOULDER_Y - 4} ${CX + sw} ${SHOULDER_Y}`;
  },
};

const vNeck: SilhouetteFeature = {
  id: "v-neck",
  category: "neckline",
  label: "V-Neck",
  renderPath({ fit, view }) {
    if (view === "back") return backNecklinePath(fit);
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    const nBase = NECK_BASE;
    return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 10} ${SHOULDER_Y - 4} ${CX - NECK_W} ${nBase - 2} ${CX - NECK_W} ${nBase} L ${CX} ${BUST_Y + 5} L ${CX + NECK_W} ${nBase} C ${CX + NECK_W} ${nBase - 2} ${CX + sw - 10} ${SHOULDER_Y - 4} ${CX + sw} ${SHOULDER_Y}`;
  },
};

const boat: SilhouetteFeature = {
  id: "boat",
  category: "neckline",
  label: "Boat",
  renderPath({ fit, view }) {
    if (view === "back") return backNecklinePath(fit);
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    return `M ${CX - sw} ${SHOULDER_Y + 2} Q ${CX} ${SHOULDER_Y - 6} ${CX + sw} ${SHOULDER_Y + 2}`;
  },
};

const square: SilhouetteFeature = {
  id: "square",
  category: "neckline",
  label: "Square",
  renderPath({ fit, view }) {
    if (view === "back") return backNecklinePath(fit);
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    const sqW = 18, sqD = 20;
    return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 3} ${CX - sqW - 2} ${SHOULDER_Y - 2} ${CX - sqW} ${SHOULDER_Y} L ${CX - sqW} ${SHOULDER_Y + sqD} L ${CX + sqW} ${SHOULDER_Y + sqD} L ${CX + sqW} ${SHOULDER_Y} C ${CX + sqW + 2} ${SHOULDER_Y - 2} ${CX + sw - 8} ${SHOULDER_Y - 3} ${CX + sw} ${SHOULDER_Y}`;
  },
};

const sweetheart: SilhouetteFeature = {
  id: "sweetheart",
  category: "neckline",
  label: "Sweetheart",
  renderPath({ fit, view }) {
    if (view === "back") return backNecklinePath(fit);
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 4} ${CX - 16} ${SHOULDER_Y + 5} ${CX - 12} ${SHOULDER_Y + 22} Q ${CX} ${SHOULDER_Y + 32} ${CX + 12} ${SHOULDER_Y + 22} C ${CX + 16} ${SHOULDER_Y + 5} ${CX + sw - 8} ${SHOULDER_Y - 4} ${CX + sw} ${SHOULDER_Y}`;
  },
};

const mandarin: SilhouetteFeature = {
  id: "mandarin",
  category: "neckline",
  label: "Mandarin",
  renderPath({ fit, view }) {
    if (view === "back") return backNecklinePath(fit);
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    const nBase = NECK_BASE;
    const mw = 12, mh = 10;
    return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 3} ${CX - mw - 4} ${nBase + 2} ${CX - mw} ${nBase} L ${CX - mw} ${nBase - mh} Q ${CX} ${nBase - mh - 4} ${CX + mw} ${nBase - mh} L ${CX + mw} ${nBase} C ${CX + mw + 4} ${nBase + 2} ${CX + sw - 8} ${SHOULDER_Y - 3} ${CX + sw} ${SHOULDER_Y}`;
  },
};

export function registerNecklines(): void {
  [round, vNeck, boat, square, sweetheart, mandarin].forEach(registerFeature);
}
