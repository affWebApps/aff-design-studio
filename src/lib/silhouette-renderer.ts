/**
 * SVG silhouette renderer.
 * Generates a fashion figure silhouette SVG based on garment configuration.
 */
import type { GarmentConfig, NecklineType, SleeveType, CollarType, FitType, SkirtSilhouette, SkirtLength, PantsStyle, PantsLength, DressWaistline, TopLength, ClosureType, DetailType, WaistbandType } from "./garment-config";

const W = 200;
const H = 500;
const CX = W / 2;

// Body landmarks
const SHOULDER_Y = 100;
const BUST_Y = 150;
const WAIST_Y = 200;
const HIP_Y = 240;
const KNEE_Y = 340;
const ANKLE_Y = 440;
const SHOULDER_W = 36;
const BUST_W = 34;
const WAIST_W = 26;
const HIP_W = 36;

function necklinePath(type: NecklineType): string {
  const neckTop = SHOULDER_Y - 20;
  const sw = SHOULDER_W;
  switch (type) {
    case "v-neck":
      return `M ${CX - sw} ${SHOULDER_Y} L ${CX} ${BUST_Y - 10} L ${CX + sw} ${SHOULDER_Y}`;
    case "boat":
      return `M ${CX - sw} ${SHOULDER_Y - 5} Q ${CX} ${SHOULDER_Y - 8} ${CX + sw} ${SHOULDER_Y - 5}`;
    case "square":
      return `M ${CX - sw} ${SHOULDER_Y} L ${CX - 15} ${SHOULDER_Y} L ${CX - 15} ${neckTop + 15} L ${CX + 15} ${neckTop + 15} L ${CX + 15} ${SHOULDER_Y} L ${CX + sw} ${SHOULDER_Y}`;
    case "sweetheart":
      return `M ${CX - sw} ${SHOULDER_Y} Q ${CX - 12} ${SHOULDER_Y - 5} ${CX - 8} ${SHOULDER_Y + 10} Q ${CX} ${SHOULDER_Y + 20} ${CX + 8} ${SHOULDER_Y + 10} Q ${CX + 12} ${SHOULDER_Y - 5} ${CX + sw} ${SHOULDER_Y}`;
    case "mandarin":
      return `M ${CX - sw} ${SHOULDER_Y} L ${CX - 8} ${SHOULDER_Y} L ${CX - 8} ${neckTop + 10} L ${CX + 8} ${neckTop + 10} L ${CX + 8} ${SHOULDER_Y} L ${CX + sw} ${SHOULDER_Y}`;
    case "round":
    default:
      return `M ${CX - sw} ${SHOULDER_Y} Q ${CX} ${neckTop} ${CX + sw} ${SHOULDER_Y}`;
  }
}

function sleevePathLeft(type: SleeveType): string {
  const sx = CX - SHOULDER_W;
  const sy = SHOULDER_Y;
  const armEndX = sx - 25;
  switch (type) {
    case "sleeveless": return "";
    case "cap":
      return `M ${sx} ${sy} Q ${sx - 15} ${sy - 5} ${sx - 18} ${sy + 15} L ${sx} ${sy + 20}`;
    case "short":
      return `M ${sx} ${sy} L ${sx - 20} ${sy + 5} L ${sx - 22} ${sy + 35} L ${sx - 5} ${sy + 40}`;
    case "three-quarter":
      return `M ${sx} ${sy} L ${sx - 20} ${sy + 5} L ${armEndX - 2} ${sy + 90} L ${armEndX + 12} ${sy + 90} L ${sx - 5} ${sy + 40}`;
    case "long":
      return `M ${sx} ${sy} L ${sx - 20} ${sy + 5} L ${armEndX - 5} ${sy + 140} L ${armEndX + 10} ${sy + 140} L ${sx - 5} ${sy + 40}`;
    case "bell":
      return `M ${sx} ${sy} L ${sx - 20} ${sy + 5} L ${armEndX - 15} ${sy + 140} L ${armEndX + 10} ${sy + 100} L ${sx - 5} ${sy + 40}`;
    case "puff":
      return `M ${sx} ${sy} Q ${sx - 25} ${sy - 5} ${sx - 22} ${sy + 25} Q ${sx - 20} ${sy + 35} ${sx - 5} ${sy + 35}`;
  }
}

function sleevePathRight(type: SleeveType): string {
  const sx = CX + SHOULDER_W;
  const sy = SHOULDER_Y;
  const armEndX = sx + 25;
  switch (type) {
    case "sleeveless": return "";
    case "cap":
      return `M ${sx} ${sy} Q ${sx + 15} ${sy - 5} ${sx + 18} ${sy + 15} L ${sx} ${sy + 20}`;
    case "short":
      return `M ${sx} ${sy} L ${sx + 20} ${sy + 5} L ${sx + 22} ${sy + 35} L ${sx + 5} ${sy + 40}`;
    case "three-quarter":
      return `M ${sx} ${sy} L ${sx + 20} ${sy + 5} L ${armEndX + 2} ${sy + 90} L ${armEndX - 12} ${sy + 90} L ${sx + 5} ${sy + 40}`;
    case "long":
      return `M ${sx} ${sy} L ${sx + 20} ${sy + 5} L ${armEndX + 5} ${sy + 140} L ${armEndX - 10} ${sy + 140} L ${sx + 5} ${sy + 40}`;
    case "bell":
      return `M ${sx} ${sy} L ${sx + 20} ${sy + 5} L ${armEndX + 15} ${sy + 140} L ${armEndX - 10} ${sy + 100} L ${sx + 5} ${sy + 40}`;
    case "puff":
      return `M ${sx} ${sy} Q ${sx + 25} ${sy - 5} ${sx + 22} ${sy + 25} Q ${sx + 20} ${sy + 35} ${sx + 5} ${sy + 35}`;
  }
}

function collarPath(type: CollarType): string {
  const neckTop = SHOULDER_Y - 20;
  switch (type) {
    case "none": return "";
    case "peter-pan":
      return `M ${CX - 12} ${neckTop + 5} Q ${CX - 25} ${SHOULDER_Y + 5} ${CX - SHOULDER_W + 5} ${SHOULDER_Y + 2} M ${CX + 12} ${neckTop + 5} Q ${CX + 25} ${SHOULDER_Y + 5} ${CX + SHOULDER_W - 5} ${SHOULDER_Y + 2}`;
    case "mandarin":
      return `M ${CX - 8} ${neckTop + 5} L ${CX - 8} ${neckTop - 5} Q ${CX} ${neckTop - 8} ${CX + 8} ${neckTop - 5} L ${CX + 8} ${neckTop + 5}`;
    case "shirt":
      return `M ${CX - 10} ${neckTop + 5} L ${CX - 20} ${SHOULDER_Y + 10} L ${CX - 8} ${SHOULDER_Y + 5} M ${CX + 10} ${neckTop + 5} L ${CX + 20} ${SHOULDER_Y + 10} L ${CX + 8} ${SHOULDER_Y + 5}`;
    case "sailor":
      return `M ${CX - 12} ${neckTop + 5} L ${CX - SHOULDER_W - 5} ${BUST_Y} L ${CX - SHOULDER_W + 10} ${BUST_Y} M ${CX + 12} ${neckTop + 5} L ${CX + SHOULDER_W + 5} ${BUST_Y} L ${CX + SHOULDER_W - 10} ${BUST_Y}`;
  }
}

function getHemY(length: SkirtLength | TopLength | PantsLength | string): number {
  switch (length) {
    case "crop": return WAIST_Y - 10;
    case "waist": return WAIST_Y + 5;
    case "hip": return HIP_Y + 10;
    case "tunic": return HIP_Y + 40;
    case "mini": return HIP_Y + 30;
    case "knee": return KNEE_Y;
    case "midi": return KNEE_Y + 50;
    case "maxi": return ANKLE_Y;
    case "shorts": return HIP_Y + 30;
    case "bermuda": return KNEE_Y - 20;
    case "cropped": return KNEE_Y + 40;
    case "full": return ANKLE_Y;
    default: return KNEE_Y;
  }
}

function fitOffset(fit: FitType): number {
  switch (fit) {
    case "loose": return 8;
    case "fitted": return -4;
    default: return 0;
  }
}

function bodyPath(hemY: number, fit: FitType, flare: number = 0): string {
  const fo = fitOffset(fit);
  const bw = BUST_W + fo;
  const ww = WAIST_W + fo;
  const hw = HIP_W + fo;
  const hemW = hw + flare;

  // Only draw to hemY
  const parts: string[] = [];

  if (hemY <= BUST_Y) {
    parts.push(`L ${CX - bw} ${BUST_Y}`);
    parts.push(`L ${CX + bw} ${BUST_Y}`);
  } else if (hemY <= WAIST_Y) {
    const t = (hemY - BUST_Y) / (WAIST_Y - BUST_Y);
    const hemWAtY = bw + (ww - bw) * t;
    parts.push(
      `L ${CX - bw} ${BUST_Y}`,
      `L ${CX - hemWAtY} ${hemY}`,
      `L ${CX + hemWAtY} ${hemY}`,
      `L ${CX + bw} ${BUST_Y}`
    );
  } else if (hemY <= HIP_Y) {
    const t = (hemY - WAIST_Y) / (HIP_Y - WAIST_Y);
    const hemWAtY = ww + (hw - ww) * t + flare * t;
    parts.push(
      `L ${CX - bw} ${BUST_Y}`,
      `L ${CX - ww} ${WAIST_Y}`,
      `L ${CX - hemWAtY} ${hemY}`,
      `L ${CX + hemWAtY} ${hemY}`,
      `L ${CX + ww} ${WAIST_Y}`,
      `L ${CX + bw} ${BUST_Y}`
    );
  } else {
    parts.push(
      `L ${CX - bw} ${BUST_Y}`,
      `L ${CX - ww} ${WAIST_Y}`,
      `L ${CX - hw} ${HIP_Y}`,
      `L ${CX - hemW} ${hemY}`,
      `L ${CX + hemW} ${hemY}`,
      `L ${CX + hw} ${HIP_Y}`,
      `L ${CX + ww} ${WAIST_Y}`,
      `L ${CX + bw} ${BUST_Y}`
    );
  }

  return parts.join(" ");
}

function getFlare(silhouette: SkirtSilhouette): number {
  switch (silhouette) {
    case "a-line": return 10;
    case "flared": return 25;
    case "circle": return 35;
    case "gathered": return 20;
    case "pencil": return -5;
    case "straight": default: return 0;
  }
}

function closureLine(type: ClosureType): string {
  if (type === "none") return "";
  if (type === "front-buttons") {
    // Button dots down center front
    const dots: string[] = [];
    for (let y = SHOULDER_Y + 15; y < HIP_Y; y += 20) {
      dots.push(`<circle cx="${CX}" cy="${y}" r="2" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`);
    }
    return dots.join("");
  }
  if (type === "back-zip") {
    return `<line x1="${CX}" y1="${SHOULDER_Y - 15}" x2="${CX}" y2="${WAIST_Y + 10}" stroke="hsl(var(--muted-foreground))" stroke-width="0.6" stroke-dasharray="2 2" />`;
  }
  if (type === "wrap") {
    return `<path d="M ${CX - 5} ${SHOULDER_Y} L ${CX + 10} ${WAIST_Y} L ${CX - 5} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`;
  }
  return "";
}

function detailElements(details: DetailType[], hemY: number): string {
  const els: string[] = [];
  const hw = HIP_W + 5;
  details.forEach(d => {
    switch (d) {
      case "lace-trim": {
        // Scalloped edge at hem
        let scallop = `M ${CX - hw} ${hemY}`;
        for (let x = CX - hw; x < CX + hw; x += 8) {
          scallop += ` Q ${x + 4} ${hemY + 5} ${x + 8} ${hemY}`;
        }
        els.push(`<path d="${scallop}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.7" opacity="0.6" />`);
        break;
      }
      case "ruffle": {
        let wave = `M ${CX - hw} ${hemY}`;
        for (let x = CX - hw; x < CX + hw; x += 6) {
          wave += ` Q ${x + 3} ${hemY + (Math.random() > 0.5 ? 6 : -3)} ${x + 6} ${hemY}`;
        }
        els.push(`<path d="${wave}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.7" opacity="0.5" />`);
        break;
      }
      case "pintucks": {
        for (let i = -2; i <= 2; i++) {
          els.push(`<line x1="${CX + i * 5}" y1="${SHOULDER_Y + 10}" x2="${CX + i * 5}" y2="${WAIST_Y - 5}" stroke="hsl(var(--muted-foreground))" stroke-width="0.4" opacity="0.4" />`);
        }
        break;
      }
      case "piping": {
        els.push(`<line x1="${CX - SHOULDER_W}" y1="${SHOULDER_Y}" x2="${CX - WAIST_W}" y2="${WAIST_Y}" stroke="hsl(var(--primary))" stroke-width="1" opacity="0.4" />`);
        els.push(`<line x1="${CX + SHOULDER_W}" y1="${SHOULDER_Y}" x2="${CX + WAIST_W}" y2="${WAIST_Y}" stroke="hsl(var(--primary))" stroke-width="1" opacity="0.4" />`);
        break;
      }
      case "embroidery-border": {
        let emb = `M ${CX - hw + 3} ${hemY - 8}`;
        for (let x = CX - hw + 3; x < CX + hw - 3; x += 5) {
          emb += ` L ${x + 2.5} ${hemY - 12} L ${x + 5} ${hemY - 8}`;
        }
        els.push(`<path d="${emb}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.6" opacity="0.5" />`);
        break;
      }
    }
  });
  return els.join("");
}

function pantsPath(style: PantsStyle, length: PantsLength, waistband: WaistbandType): string {
  const hemY = getHemY(length);
  const ww = WAIST_W;
  const hw = HIP_W;
  const crotchY = HIP_Y + 25;
  const gap = 3;

  let legW: number;
  switch (style) {
    case "slim": legW = 12; break;
    case "wide": legW = 25; break;
    case "tapered": legW = 10; break;
    case "flared": legW = 22; break;
    case "straight": default: legW = 16; break;
  }

  // Wider at hip for flared/wide
  const hipLegW = style === "wide" || style === "flared" ? hw : hw - 2;

  const leftLeg = `M ${CX - ww} ${WAIST_Y} L ${CX - hw} ${HIP_Y} L ${CX - hipLegW} ${crotchY} L ${CX - legW} ${hemY} L ${CX - gap} ${hemY} L ${CX - gap} ${crotchY}`;
  const rightLeg = `M ${CX + gap} ${crotchY} L ${CX + gap} ${hemY} L ${CX + legW} ${hemY} L ${CX + hipLegW} ${crotchY} L ${CX + hw} ${HIP_Y} L ${CX + ww} ${WAIST_Y}`;

  // Waistband
  const wbH = waistband === "yoke" ? 15 : 6;
  const wb = `M ${CX - ww} ${WAIST_Y} L ${CX - ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y}`;

  return `${wb} ${leftLeg} ${rightLeg}`;
}

export function renderSilhouette(garment: GarmentConfig): string {
  const paths: string[] = [];
  const extras: string[] = [];
  const strokeColor = "hsl(var(--primary))";
  const fillColor = "hsl(var(--primary) / 0.06)";
  const lightStroke = "hsl(var(--muted-foreground))";

  switch (garment.category) {
    case "top": {
      const c = garment.config;
      const hemY = getHemY(c.length);
      const neck = necklinePath(c.neckline);
      const body = bodyPath(hemY, c.fit);
      paths.push(`${neck} ${body} Z`);

      const slL = sleevePathLeft(c.sleeve);
      const slR = sleevePathRight(c.sleeve);
      if (slL) paths.push(slL);
      if (slR) paths.push(slR);

      const col = collarPath(c.collar);
      if (col) extras.push(`<path d="${col}" fill="none" stroke="${strokeColor}" stroke-width="1" />`);

      extras.push(closureLine(c.closure));
      extras.push(detailElements(c.details, hemY));
      break;
    }
    case "dress": {
      const c = garment.config;
      const hemY = getHemY(c.skirtLength);
      const flare = getFlare(c.skirtSilhouette);
      const neck = necklinePath(c.neckline);

      // Adjust waistline position
      let waistAdjust = "";
      if (c.waistline === "empire") {
        waistAdjust = `<line x1="${CX - BUST_W}" y1="${BUST_Y + 10}" x2="${CX + BUST_W}" y2="${BUST_Y + 10}" stroke="${lightStroke}" stroke-width="0.6" stroke-dasharray="3 2" />`;
      } else if (c.waistline === "drop") {
        waistAdjust = `<line x1="${CX - WAIST_W - 5}" y1="${HIP_Y - 10}" x2="${CX + WAIST_W + 5}" y2="${HIP_Y - 10}" stroke="${lightStroke}" stroke-width="0.6" stroke-dasharray="3 2" />`;
      } else {
        waistAdjust = `<line x1="${CX - WAIST_W}" y1="${WAIST_Y}" x2="${CX + WAIST_W}" y2="${WAIST_Y}" stroke="${lightStroke}" stroke-width="0.6" stroke-dasharray="3 2" />`;
      }
      extras.push(waistAdjust);

      const body = bodyPath(hemY, c.fit, flare);
      paths.push(`${neck} ${body} Z`);

      const slL = sleevePathLeft(c.sleeve);
      const slR = sleevePathRight(c.sleeve);
      if (slL) paths.push(slL);
      if (slR) paths.push(slR);

      const col = collarPath(c.collar);
      if (col) extras.push(`<path d="${col}" fill="none" stroke="${strokeColor}" stroke-width="1" />`);

      extras.push(closureLine(c.closure));
      extras.push(detailElements(c.details, hemY));
      break;
    }
    case "skirt": {
      const c = garment.config;
      const hemY = getHemY(c.length);
      const flare = getFlare(c.silhouette);
      const hw = HIP_W + flare;
      const ww = WAIST_W;
      const wbH = c.waistband === "yoke" ? 15 : 6;

      const skirt = `M ${CX - ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y} L ${CX + HIP_W} ${HIP_Y} L ${CX + hw} ${hemY} L ${CX - hw} ${hemY} L ${CX - HIP_W} ${HIP_Y} L ${CX - ww} ${WAIST_Y} Z`;
      paths.push(skirt);
      extras.push(detailElements(c.details, hemY));
      break;
    }
    case "pants": {
      const c = garment.config;
      const p = pantsPath(c.style, c.length, c.waistband);
      paths.push(p);
      extras.push(detailElements(c.details, getHemY(c.length)));
      break;
    }
  }

  const mainPaths = paths
    .map(d => `<path d="${d}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />`)
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="w-full h-full">
    ${mainPaths}
    ${extras.join("\n    ")}
  </svg>`;
}
