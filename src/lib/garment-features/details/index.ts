import { registerFeature } from "../registry";
import type { SilhouetteFeature } from "../types";
import { CX, SHOULDER_W, SHOULDER_Y, BUST_W, BUST_Y, WAIST_W, WAIST_Y } from "../landmarks";

const laceTrim: SilhouetteFeature = {
  id: "lace-trim",
  category: "detail",
  label: "Lace Trim",
  renderDecoration({ hemY = WAIST_Y + 30, hemW = 28 }) {
    let scallop = `M ${CX - hemW} ${hemY}`;
    for (let x = CX - hemW; x < CX + hemW; x += 7) {
      scallop += ` Q ${x + 3.5} ${hemY + 5} ${x + 7} ${hemY}`;
    }
    let inner = `M ${CX - hemW + 2} ${hemY - 3}`;
    for (let x = CX - hemW + 2; x < CX + hemW - 2; x += 5) {
      inner += ` Q ${x + 2.5} ${hemY + 1} ${x + 5} ${hemY - 3}`;
    }
    return `<path d="${scallop}" fill="none" stroke="hsl(var(--primary) / 0.5)" stroke-width="0.8" /><path d="${inner}" fill="none" stroke="hsl(var(--primary) / 0.3)" stroke-width="0.5" />`;
  },
};

const ruffle: SilhouetteFeature = {
  id: "ruffle",
  category: "detail",
  label: "Ruffle",
  renderDecoration({ hemY = WAIST_Y + 30, hemW = 28 }) {
    const els: string[] = [];
    for (let row = 0; row < 2; row++) {
      let wave = `M ${CX - hemW} ${hemY - row * 5}`;
      for (let x = CX - hemW; x < CX + hemW; x += 8) {
        const amp = 4 + Math.sin(x * 0.3) * 2;
        wave += ` C ${x + 2} ${hemY - row * 5 + amp} ${x + 6} ${hemY - row * 5 - amp * 0.5} ${x + 8} ${hemY - row * 5}`;
      }
      els.push(`<path d="${wave}" fill="none" stroke="hsl(var(--primary) / ${0.4 - row * 0.15})" stroke-width="0.7" />`);
    }
    return els.join("");
  },
};

const pintucks: SilhouetteFeature = {
  id: "pintucks",
  category: "detail",
  label: "Pintucks",
  renderDecoration() {
    const els: string[] = [];
    for (let i = -3; i <= 3; i++) {
      els.push(`<line x1="${CX + i * 5}" y1="${SHOULDER_Y + 15}" x2="${CX + i * 5}" y2="${WAIST_Y - 5}" stroke="hsl(var(--muted-foreground) / 0.25)" stroke-width="0.4" />`);
    }
    return els.join("");
  },
};

const piping: SilhouetteFeature = {
  id: "piping",
  category: "detail",
  label: "Piping",
  renderDecoration() {
    return [
      `<path d="M ${CX - SHOULDER_W} ${SHOULDER_Y} C ${CX - BUST_W - 2} ${BUST_Y - 5} ${CX - WAIST_W - 2} ${WAIST_Y - 10} ${CX - WAIST_W} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="1.2" />`,
      `<path d="M ${CX + SHOULDER_W} ${SHOULDER_Y} C ${CX + BUST_W + 2} ${BUST_Y - 5} ${CX + WAIST_W + 2} ${WAIST_Y - 10} ${CX + WAIST_W} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="1.2" />`,
    ].join("");
  },
};

const embroideryBorder: SilhouetteFeature = {
  id: "embroidery-border",
  category: "detail",
  label: "Embroidery Border",
  renderDecoration({ hemY = WAIST_Y + 30, hemW = 28 }) {
    let emb = `M ${CX - hemW + 4} ${hemY - 10}`;
    for (let x = CX - hemW + 4; x < CX + hemW - 4; x += 6) {
      emb += ` C ${x + 1.5} ${hemY - 14} ${x + 3} ${hemY - 6} ${x + 6} ${hemY - 10}`;
    }
    let dots = "";
    for (let x = CX - hemW + 7; x < CX + hemW - 7; x += 12) {
      dots += `<circle cx="${x}" cy="${hemY - 16}" r="1" fill="hsl(var(--primary) / 0.3)" />`;
    }
    return `<path d="${emb}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="0.7" />${dots}`;
  },
};

export function registerDetails(): void {
  [laceTrim, ruffle, pintucks, piping, embroideryBorder].forEach(registerFeature);
}
