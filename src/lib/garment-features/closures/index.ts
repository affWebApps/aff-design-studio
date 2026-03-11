import { registerFeature } from "../registry";
import type { SilhouetteFeature } from "../types";
import { CX, SHOULDER_Y, NECK_BASE, BUST_Y, WAIST_Y, WAIST_W } from "../landmarks";

const frontButtons: SilhouetteFeature = {
  id: "front-buttons",
  category: "closure",
  label: "Front Buttons",
  renderDecoration({ view, hemY }) {
    const hY = hemY ?? WAIST_Y + 30;
    if (view === "back") {
      return `<line x1="${CX}" y1="${NECK_BASE}" x2="${CX}" y2="${Math.min(hY - 10, WAIST_Y + 15)}" stroke="hsl(var(--muted-foreground) / 0.4)" stroke-width="0.6" stroke-dasharray="3 2" />`;
    }
    const dots: string[] = [];
    for (let y = SHOULDER_Y + 20; y < hY - 10; y += 22) {
      dots.push(`<circle cx="${CX}" cy="${y}" r="2.5" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`);
      dots.push(`<circle cx="${CX}" cy="${y}" r="0.8" fill="hsl(var(--primary))" />`);
    }
    return dots.join("");
  },
};

const backZip: SilhouetteFeature = {
  id: "back-zip",
  category: "closure",
  label: "Back Zip",
  renderDecoration({ view, hemY }) {
    const hY = hemY ?? WAIST_Y + 30;
    if (view === "back") {
      return `<line x1="${CX}" y1="${NECK_BASE}" x2="${CX}" y2="${Math.min(hY - 10, WAIST_Y + 15)}" stroke="hsl(var(--muted-foreground) / 0.4)" stroke-width="0.6" stroke-dasharray="3 2" />`;
    }
    return `<line x1="${CX}" y1="${NECK_BASE}" x2="${CX}" y2="${Math.min(hY - 10, WAIST_Y + 15)}" stroke="hsl(var(--muted-foreground) / 0.4)" stroke-width="0.6" stroke-dasharray="3 2" />`;
  },
};

const sideZip: SilhouetteFeature = {
  id: "side-zip",
  category: "closure",
  label: "Side Zip",
  renderDecoration({ view }) {
    if (view === "back") {
      return `<line x1="${CX}" y1="${NECK_BASE}" x2="${CX}" y2="${WAIST_Y + 15}" stroke="hsl(var(--muted-foreground) / 0.4)" stroke-width="0.6" stroke-dasharray="3 2" />`;
    }
    const fw = 2;
    return `<line x1="${CX + WAIST_W + fw}" y1="${BUST_Y + 10}" x2="${CX + WAIST_W + fw}" y2="${WAIST_Y + 10}" stroke="hsl(var(--muted-foreground) / 0.3)" stroke-width="0.5" stroke-dasharray="2 2" />`;
  },
};

const wrap: SilhouetteFeature = {
  id: "wrap",
  category: "closure",
  label: "Wrap",
  renderDecoration({ view }) {
    if (view === "back") {
      return `<path d="M ${CX - 5} ${WAIST_Y} L ${CX - 15} ${WAIST_Y + 20} M ${CX + 5} ${WAIST_Y} L ${CX + 15} ${WAIST_Y + 20}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`;
    }
    return `<path d="M ${CX - 8} ${SHOULDER_Y + 5} C ${CX} ${BUST_Y} ${CX + 5} ${BUST_Y + 10} ${CX + 12} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" /><path d="M ${CX + 12} ${WAIST_Y} L ${CX + 20} ${WAIST_Y + 15} L ${CX + 12} ${WAIST_Y + 30}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`;
  },
};

export function registerClosures(): void {
  [
    { id: "none", category: "closure" as const, label: "None" },
    frontButtons, backZip, sideZip, wrap,
  ].forEach(registerFeature);
}
