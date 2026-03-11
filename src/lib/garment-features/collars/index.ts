import { registerFeature } from "../registry";
import type { SilhouetteFeature } from "../types";
import { CX, SHOULDER_W, SHOULDER_Y, NECK_BASE, BUST_Y, fitExpand } from "../landmarks";

const peterPan: SilhouetteFeature = {
  id: "peter-pan",
  category: "collar",
  label: "Peter Pan",
  renderDecoration({ fit }) {
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    return `<path d="M ${CX - 12} ${NECK_BASE} C ${CX - 18} ${SHOULDER_Y + 3} ${CX - sw + 8} ${SHOULDER_Y + 8} ${CX - sw + 3} ${SHOULDER_Y + 3} M ${CX + 12} ${NECK_BASE} C ${CX + 18} ${SHOULDER_Y + 3} ${CX + sw - 8} ${SHOULDER_Y + 8} ${CX + sw - 3} ${SHOULDER_Y + 3}" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary))" stroke-width="1" />`;
  },
};

const mandarinCollar: SilhouetteFeature = {
  id: "mandarin",
  category: "collar",
  label: "Mandarin",
  renderDecoration() {
    return `<path d="M ${CX - 10} ${NECK_BASE - 2} L ${CX - 10} ${NECK_BASE - 14} Q ${CX} ${NECK_BASE - 18} ${CX + 10} ${NECK_BASE - 14} L ${CX + 10} ${NECK_BASE - 2}" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary))" stroke-width="1" />`;
  },
};

const shirtCollar: SilhouetteFeature = {
  id: "shirt",
  category: "collar",
  label: "Shirt Collar",
  renderDecoration() {
    return `<path d="M ${CX - 10} ${NECK_BASE - 2} L ${CX - 22} ${SHOULDER_Y + 14} L ${CX - 10} ${SHOULDER_Y + 8} M ${CX + 10} ${NECK_BASE - 2} L ${CX + 22} ${SHOULDER_Y + 14} L ${CX + 10} ${SHOULDER_Y + 8}" fill="none" stroke="hsl(var(--primary))" stroke-width="1" />`;
  },
};

const sailorCollar: SilhouetteFeature = {
  id: "sailor",
  category: "collar",
  label: "Sailor",
  renderDecoration({ fit }) {
    const fw = fitExpand(fit);
    const sw = SHOULDER_W + fw;
    return `<path d="M ${CX - 12} ${NECK_BASE} L ${CX - sw - 8} ${BUST_Y + 5} L ${CX - sw + 12} ${BUST_Y + 5} Z M ${CX + 12} ${NECK_BASE} L ${CX + sw + 8} ${BUST_Y + 5} L ${CX + sw - 12} ${BUST_Y + 5} Z" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary))" stroke-width="1" />`;
  },
};

export function registerCollars(): void {
  [
    { id: "none", category: "collar" as const, label: "None" },
    peterPan, mandarinCollar, shirtCollar, sailorCollar,
  ].forEach(registerFeature);
}
