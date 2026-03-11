/**
 * Fashion-illustration quality SVG silhouette renderer.
 * Renders a croquis (fashion figure) with garment overlay.
 * Uses the plugin registry for necklines, sleeves, collars, closures, and details.
 */
import type {
  GarmentConfig, FitType,
  SkirtSilhouette, SkirtLength, TopLength, PantsLength, PantsStyle,
  DressWaistline, WaistbandType
} from "./garment-config";
import {
  initializeFeatures, getFeature, getSleevePathForSide,
  W, H, CX,
  HEAD_TOP, HEAD_H, CHIN, NECK_BASE, SHOULDER_Y, BUST_Y, WAIST_Y, HIP_Y,
  CROTCH_Y, KNEE_Y, ANKLE_Y, FOOT_Y,
  SHOULDER_W, NECK_W, BUST_W, WAIST_W, HIP_W, KNEE_W, ANKLE_W,
  ARM_PIT_Y, ELBOW_Y, WRIST_Y, HAND_Y,
  fitExpand,
} from "./garment-features";
import type { FeatureRenderContext } from "./garment-features";

// Initialize all feature plugins on module load
initializeFeatures();

export type SketchTheme = "dark" | "light";
export type SketchView = "front" | "back";

let currentTheme: SketchTheme = "dark";
let currentView: SketchView = "front";

// ── Croquis (body figure) ──
function renderCroquis(): string {
  const skin = "hsl(var(--muted-foreground) / 0.15)";
  const skinStroke = "hsl(var(--muted-foreground) / 0.25)";
  const hairColor = "hsl(var(--muted-foreground) / 0.2)";

  const headCX = CX;
  const headCY = HEAD_TOP + HEAD_H / 2;
  const headRX = 18;
  const headRY = HEAD_H / 2;

  const hair = currentView === "back"
    ? `<ellipse cx="${headCX}" cy="${headCY}" rx="${headRX + 3}" ry="${headRY + 3}" fill="${hairColor}" />`
    : `<ellipse cx="${headCX}" cy="${headCY - 4}" rx="${headRX + 3}" ry="${headRY + 2}" fill="${hairColor}" />`;

  const head = `<ellipse cx="${headCX}" cy="${headCY}" rx="${headRX}" ry="${headRY}" fill="${skin}" stroke="${skinStroke}" stroke-width="0.8" />`;

  const features = currentView === "front" ? `
    <ellipse cx="${CX - 6}" cy="${headCY - 2}" rx="2" ry="1.2" fill="none" stroke="${skinStroke}" stroke-width="0.6" />
    <ellipse cx="${CX + 6}" cy="${headCY - 2}" rx="2" ry="1.2" fill="none" stroke="${skinStroke}" stroke-width="0.6" />
    <path d="M ${CX - 4} ${headCY + 8} Q ${CX} ${headCY + 11} ${CX + 4} ${headCY + 8}" fill="none" stroke="${skinStroke}" stroke-width="0.6" />
    <line x1="${CX - 1}" y1="${headCY + 2}" x2="${CX}" y2="${headCY + 5}" stroke="${skinStroke}" stroke-width="0.5" />
  ` : "";

  const neck = `<path d="M ${CX - NECK_W} ${CHIN} L ${CX - NECK_W} ${NECK_BASE} Q ${CX - NECK_W - 2} ${SHOULDER_Y} ${CX - SHOULDER_W} ${SHOULDER_Y} M ${CX + NECK_W} ${CHIN} L ${CX + NECK_W} ${NECK_BASE} Q ${CX + NECK_W + 2} ${SHOULDER_Y} ${CX + SHOULDER_W} ${SHOULDER_Y}" fill="none" stroke="${skinStroke}" stroke-width="0.8" />`;

  const torsoLeft = `M ${CX - SHOULDER_W} ${SHOULDER_Y} C ${CX - SHOULDER_W + 2} ${SHOULDER_Y + 20} ${CX - BUST_W - 2} ${BUST_Y - 15} ${CX - BUST_W} ${BUST_Y} C ${CX - BUST_W + 2} ${BUST_Y + 20} ${CX - WAIST_W - 4} ${WAIST_Y - 15} ${CX - WAIST_W} ${WAIST_Y} C ${CX - WAIST_W - 2} ${WAIST_Y + 15} ${CX - HIP_W - 2} ${HIP_Y - 10} ${CX - HIP_W} ${HIP_Y}`;
  const torsoRight = `M ${CX + SHOULDER_W} ${SHOULDER_Y} C ${CX + SHOULDER_W - 2} ${SHOULDER_Y + 20} ${CX + BUST_W + 2} ${BUST_Y - 15} ${CX + BUST_W} ${BUST_Y} C ${CX + BUST_W - 2} ${BUST_Y + 20} ${CX + WAIST_W + 4} ${WAIST_Y - 15} ${CX + WAIST_W} ${WAIST_Y} C ${CX + WAIST_W + 2} ${WAIST_Y + 15} ${CX + HIP_W + 2} ${HIP_Y - 10} ${CX + HIP_W} ${HIP_Y}`;
  const torso = `<path d="${torsoLeft}" fill="none" stroke="${skinStroke}" stroke-width="0.7" /><path d="${torsoRight}" fill="none" stroke="${skinStroke}" stroke-width="0.7" />`;

  const armOffX = 8;
  const leftArm = `M ${CX - SHOULDER_W} ${SHOULDER_Y} C ${CX - SHOULDER_W - armOffX} ${ARM_PIT_Y} ${CX - SHOULDER_W - armOffX - 4} ${ELBOW_Y - 20} ${CX - SHOULDER_W - armOffX - 2} ${ELBOW_Y} C ${CX - SHOULDER_W - armOffX} ${ELBOW_Y + 20} ${CX - SHOULDER_W - armOffX + 2} ${WRIST_Y - 10} ${CX - SHOULDER_W - armOffX + 4} ${WRIST_Y} L ${CX - SHOULDER_W - armOffX + 6} ${HAND_Y}`;
  const rightArm = `M ${CX + SHOULDER_W} ${SHOULDER_Y} C ${CX + SHOULDER_W + armOffX} ${ARM_PIT_Y} ${CX + SHOULDER_W + armOffX + 4} ${ELBOW_Y - 20} ${CX + SHOULDER_W + armOffX + 2} ${ELBOW_Y} C ${CX + SHOULDER_W + armOffX} ${ELBOW_Y + 20} ${CX + SHOULDER_W + armOffX - 2} ${WRIST_Y - 10} ${CX + SHOULDER_W + armOffX - 4} ${WRIST_Y} L ${CX + SHOULDER_W + armOffX - 6} ${HAND_Y}`;
  const arms = `<path d="${leftArm}" fill="none" stroke="${skinStroke}" stroke-width="2.5" stroke-linecap="round" /><path d="${rightArm}" fill="none" stroke="${skinStroke}" stroke-width="2.5" stroke-linecap="round" />`;

  const legGap = 4;
  const leftLeg = `M ${CX - HIP_W + 5} ${HIP_Y} C ${CX - HIP_W + 8} ${CROTCH_Y - 10} ${CX - legGap - KNEE_W} ${KNEE_Y - 20} ${CX - legGap - KNEE_W + 2} ${KNEE_Y} C ${CX - legGap - KNEE_W + 4} ${KNEE_Y + 20} ${CX - legGap - ANKLE_W} ${ANKLE_Y - 20} ${CX - legGap - ANKLE_W + 2} ${ANKLE_Y} L ${CX - legGap - ANKLE_W - 2} ${FOOT_Y} L ${CX - legGap + 4} ${FOOT_Y}`;
  const rightLeg = `M ${CX + HIP_W - 5} ${HIP_Y} C ${CX + HIP_W - 8} ${CROTCH_Y - 10} ${CX + legGap + KNEE_W} ${KNEE_Y - 20} ${CX + legGap + KNEE_W - 2} ${KNEE_Y} C ${CX + legGap + KNEE_W - 4} ${KNEE_Y + 20} ${CX + legGap + ANKLE_W} ${ANKLE_Y - 20} ${CX + legGap + ANKLE_W - 2} ${ANKLE_Y} L ${CX + legGap + ANKLE_W + 2} ${FOOT_Y} L ${CX + legGap - 4} ${FOOT_Y}`;
  const leftLegIn = `M ${CX - legGap} ${CROTCH_Y} C ${CX - legGap} ${KNEE_Y - 20} ${CX - legGap + 2} ${KNEE_Y} ${CX - legGap + 2} ${KNEE_Y} C ${CX - legGap + 2} ${KNEE_Y + 20} ${CX - legGap + 4} ${ANKLE_Y - 10} ${CX - legGap + 4} ${FOOT_Y}`;
  const rightLegIn = `M ${CX + legGap} ${CROTCH_Y} C ${CX + legGap} ${KNEE_Y - 20} ${CX + legGap - 2} ${KNEE_Y} ${CX + legGap - 2} ${KNEE_Y} C ${CX + legGap - 2} ${KNEE_Y + 20} ${CX + legGap - 4} ${ANKLE_Y - 10} ${CX + legGap - 4} ${FOOT_Y}`;
  const legs = `<path d="${leftLeg}" fill="none" stroke="${skinStroke}" stroke-width="0.8" /><path d="${rightLeg}" fill="none" stroke="${skinStroke}" stroke-width="0.8" /><path d="${leftLegIn}" fill="none" stroke="${skinStroke}" stroke-width="0.6" /><path d="${rightLegIn}" fill="none" stroke="${skinStroke}" stroke-width="0.6" />`;

  const backDetails = currentView === "back" ? `
    <line x1="${CX}" y1="${NECK_BASE}" x2="${CX}" y2="${WAIST_Y}" stroke="${skinStroke}" stroke-width="0.4" opacity="0.5" />
    <path d="M ${CX - 12} ${SHOULDER_Y + 20} Q ${CX - 14} ${SHOULDER_Y + 35} ${CX - 8} ${SHOULDER_Y + 45}" fill="none" stroke="${skinStroke}" stroke-width="0.3" opacity="0.4" />
    <path d="M ${CX + 12} ${SHOULDER_Y + 20} Q ${CX + 14} ${SHOULDER_Y + 35} ${CX + 8} ${SHOULDER_Y + 45}" fill="none" stroke="${skinStroke}" stroke-width="0.3" opacity="0.4" />
  ` : "";

  return `${hair}${head}${features}${neck}${torso}${arms}${legs}${backDetails}`;
}

// ── Garment body shape helpers (kept in renderer — tightly coupled to anatomy) ──

function garmentBodyPaths(hemY: number, fit: FitType, flare: number = 0, waistlineShift: number = 0): string[] {
  const fw = fitExpand(fit);
  const bw = BUST_W + fw;
  const ww = WAIST_W + fw;
  const hw = HIP_W + fw;
  const actualWaistY = WAIST_Y + waistlineShift;
  const hemW = hw + flare;

  if (hemY <= BUST_Y + 10) {
    const tw = bw - (bw - ww) * ((hemY - SHOULDER_Y) / (WAIST_Y - SHOULDER_Y));
    return [
      `M ${CX - bw} ${BUST_Y} C ${CX - bw + 1} ${BUST_Y + 5} ${CX - tw - 2} ${hemY - 5} ${CX - tw} ${hemY}`,
      `M ${CX - tw} ${hemY} L ${CX + tw} ${hemY}`,
      `M ${CX + tw} ${hemY} C ${CX + tw + 2} ${hemY - 5} ${CX + bw - 1} ${BUST_Y + 5} ${CX + bw} ${BUST_Y}`,
    ];
  }
  if (hemY <= actualWaistY + 5) {
    return [
      `M ${CX - bw} ${BUST_Y} C ${CX - bw + 2} ${BUST_Y + 18} ${CX - ww - 3} ${hemY - 15} ${CX - ww} ${hemY}`,
      `M ${CX - ww} ${hemY} L ${CX + ww} ${hemY}`,
      `M ${CX + ww} ${hemY} C ${CX + ww + 3} ${hemY - 15} ${CX + bw - 2} ${BUST_Y + 18} ${CX + bw} ${BUST_Y}`,
    ];
  }
  if (hemY <= HIP_Y + 10) {
    const t = (hemY - actualWaistY) / (HIP_Y - actualWaistY);
    const hemWAtY = ww + (hw - ww) * t + flare * t;
    return [
      `M ${CX - bw} ${BUST_Y} C ${CX - bw + 2} ${BUST_Y + 18} ${CX - ww - 3} ${actualWaistY - 15} ${CX - ww} ${actualWaistY} C ${CX - ww - 2} ${actualWaistY + 12} ${CX - hemWAtY - 2} ${hemY - 10} ${CX - hemWAtY} ${hemY}`,
      `M ${CX - hemWAtY} ${hemY} L ${CX + hemWAtY} ${hemY}`,
      `M ${CX + hemWAtY} ${hemY} C ${CX + hemWAtY + 2} ${hemY - 10} ${CX + ww + 2} ${actualWaistY + 12} ${CX + ww} ${actualWaistY} C ${CX + ww + 3} ${actualWaistY - 15} ${CX + bw - 2} ${BUST_Y + 18} ${CX + bw} ${BUST_Y}`,
    ];
  }
  return [
    `M ${CX - bw} ${BUST_Y} C ${CX - bw + 2} ${BUST_Y + 18} ${CX - ww - 3} ${actualWaistY - 15} ${CX - ww} ${actualWaistY} C ${CX - ww - 2} ${actualWaistY + 12} ${CX - hw - 2} ${HIP_Y - 8} ${CX - hw} ${HIP_Y} C ${CX - hw - 1} ${HIP_Y + 10} ${CX - hemW - 1} ${hemY - 15} ${CX - hemW} ${hemY}`,
    `M ${CX - hemW} ${hemY} L ${CX + hemW} ${hemY}`,
    `M ${CX + hemW} ${hemY} C ${CX + hemW + 1} ${hemY - 15} ${CX + hw + 1} ${HIP_Y + 10} ${CX + hw} ${HIP_Y} C ${CX + hw + 2} ${HIP_Y - 8} ${CX + ww + 2} ${actualWaistY + 12} ${CX + ww} ${actualWaistY} C ${CX + ww + 3} ${actualWaistY - 15} ${CX + bw - 2} ${BUST_Y + 18} ${CX + bw} ${BUST_Y}`,
  ];
}

function getHemY(length: SkirtLength | TopLength | PantsLength | string): number {
  switch (length) {
    case "crop": return BUST_Y + 15;
    case "waist": return WAIST_Y + 5;
    case "hip": return HIP_Y + 15;
    case "tunic": return HIP_Y + 50;
    case "mini": return HIP_Y + 35;
    case "knee": return KNEE_Y;
    case "midi": return KNEE_Y + 50;
    case "maxi": return ANKLE_Y - 5;
    case "shorts": return HIP_Y + 35;
    case "bermuda": return KNEE_Y - 15;
    case "cropped": return KNEE_Y + 45;
    case "full": return ANKLE_Y;
    default: return KNEE_Y;
  }
}

function getFlare(silhouette: SkirtSilhouette): number {
  switch (silhouette) {
    case "a-line": return 14;
    case "flared": return 30;
    case "circle": return 45;
    case "gathered": return 25;
    case "pencil": return -6;
    case "straight": default: return 0;
  }
}

function waistlineIndicator(waistline: DressWaistline): string {
  const stroke = "hsl(var(--muted-foreground) / 0.35)";
  const w = 0.7;
  switch (waistline) {
    case "empire":
      return `<path d="M ${CX - BUST_W + 5} ${BUST_Y + 12} Q ${CX} ${BUST_Y + 8} ${CX + BUST_W - 5} ${BUST_Y + 12}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-dasharray="4 3" />`;
    case "drop":
      return `<path d="M ${CX - HIP_W + 5} ${HIP_Y - 8} Q ${CX} ${HIP_Y - 12} ${CX + HIP_W - 5} ${HIP_Y - 8}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-dasharray="4 3" />`;
    default:
      return `<path d="M ${CX - WAIST_W} ${WAIST_Y} Q ${CX} ${WAIST_Y - 3} ${CX + WAIST_W} ${WAIST_Y}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-dasharray="4 3" />`;
  }
}

function gatheredTexture(hemY: number, hemW: number, silhouette: SkirtSilhouette): string {
  if (silhouette !== "gathered" && silhouette !== "circle") return "";
  const lines: string[] = [];
  const startY = WAIST_Y + 5;
  const count = silhouette === "circle" ? 12 : 8;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x1 = CX - WAIST_W + t * WAIST_W * 2;
    const x2 = CX - hemW + t * hemW * 2;
    const cp1x = x1 + (Math.sin(i * 2.1) * 3);
    const cp1y = (startY + hemY) / 2 + Math.sin(i * 1.7) * 5;
    lines.push(`<path d="M ${x1} ${startY} Q ${cp1x} ${cp1y} ${x2} ${hemY}" fill="none" stroke="hsl(var(--primary) / 0.12)" stroke-width="0.5" />`);
  }
  return lines.join("");
}

function pantsBody(style: PantsStyle, length: PantsLength, waistband: WaistbandType, fit: FitType): string[] {
  const fw = fitExpand(fit || "regular");
  const hemY = getHemY(length);
  const ww = WAIST_W + fw;
  const hw = HIP_W + fw;
  const crotchY = CROTCH_Y;
  const gap = 4;

  let legW: number;
  switch (style) {
    case "slim": legW = 13; break;
    case "wide": legW = 28; break;
    case "tapered": legW = 11; break;
    case "flared": legW = 26; break;
    case "straight": default: legW = 17; break;
  }

  const wbH = waistband === "yoke" ? 16 : 7;
  const hipLegW = style === "wide" || style === "flared" ? hw + 2 : hw - 1;
  const paths: string[] = [];

  paths.push(`M ${CX - ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y - wbH}`);
  paths.push(`M ${CX - ww} ${WAIST_Y - wbH} L ${CX - ww} ${WAIST_Y} C ${CX - ww - 1} ${WAIST_Y + 10} ${CX - hw - 2} ${HIP_Y - 8} ${CX - hw} ${HIP_Y} C ${CX - hipLegW - 1} ${HIP_Y + 10} ${CX - hipLegW - 2} ${crotchY - 5} ${CX - hipLegW} ${crotchY} C ${CX - hipLegW + 2} ${crotchY + 20} ${CX - legW - 2} ${hemY - 20} ${CX - legW} ${hemY}`);
  paths.push(`M ${CX - legW} ${hemY} L ${CX - gap} ${hemY} C ${CX - gap} ${hemY - 20} ${CX - gap} ${crotchY + 10} ${CX - gap} ${crotchY}`);
  paths.push(`M ${CX - gap} ${crotchY} Q ${CX} ${crotchY + 8} ${CX + gap} ${crotchY}`);
  paths.push(`M ${CX + gap} ${crotchY} C ${CX + gap} ${crotchY + 10} ${CX + gap} ${hemY - 20} ${CX + gap} ${hemY} L ${CX + legW} ${hemY}`);
  paths.push(`M ${CX + legW} ${hemY} C ${CX + legW + 2} ${hemY - 20} ${CX + hipLegW - 2} ${crotchY + 20} ${CX + hipLegW} ${crotchY} C ${CX + hipLegW + 2} ${crotchY - 5} ${CX + hipLegW + 1} ${HIP_Y + 10} ${CX + hw} ${HIP_Y} C ${CX + hw + 2} ${HIP_Y - 8} ${CX + ww + 1} ${WAIST_Y + 10} ${CX + ww} ${WAIST_Y} L ${CX + ww} ${WAIST_Y - wbH}`);

  return paths;
}

function pantsPocketDecor(pockets: string, style: PantsStyle): string {
  if (pockets === "none") return "";
  const fw = 2;
  const hw = HIP_W + fw;
  switch (pockets) {
    case "side-seam":
      return `<path d="M ${CX - hw + 3} ${WAIST_Y + 5} L ${CX - hw + 1} ${WAIST_Y + 22}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="0.6" /><path d="M ${CX + hw - 3} ${WAIST_Y + 5} L ${CX + hw - 1} ${WAIST_Y + 22}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="0.6" />`;
    case "patch":
      return `<rect x="${CX - hw + 6}" y="${HIP_Y - 5}" width="14" height="16" rx="2" fill="none" stroke="hsl(var(--primary) / 0.35)" stroke-width="0.6" /><rect x="${CX + hw - 20}" y="${HIP_Y - 5}" width="14" height="16" rx="2" fill="none" stroke="hsl(var(--primary) / 0.35)" stroke-width="0.6" />`;
    case "welt":
      return `<line x1="${CX - hw + 5}" y1="${HIP_Y}" x2="${CX - hw + 18}" y2="${HIP_Y}" stroke="hsl(var(--primary) / 0.4)" stroke-width="0.7" /><line x1="${CX + hw - 18}" y1="${HIP_Y}" x2="${CX + hw - 5}" y2="${HIP_Y}" stroke="hsl(var(--primary) / 0.4)" stroke-width="0.7" />`;
    default: return "";
  }
}

function gradientDefs(): string {
  return `<defs>
    <linearGradient id="garment-shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.08" />
      <stop offset="40%" stop-color="hsl(var(--primary))" stop-opacity="0.02" />
      <stop offset="60%" stop-color="hsl(var(--primary))" stop-opacity="0.02" />
      <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0.08" />
    </linearGradient>
    <linearGradient id="garment-vshade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.04" />
      <stop offset="50%" stop-color="hsl(var(--primary))" stop-opacity="0.01" />
      <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0.06" />
    </linearGradient>
  </defs>`;
}

// ── Helper to get feature decoration ──
function featureDecoration(category: "collar" | "closure" | "detail", id: string, ctx: FeatureRenderContext): string {
  const feature = getFeature(category, id);
  if (!feature?.renderDecoration) return "";
  return feature.renderDecoration(ctx);
}

function featurePath(category: "neckline", id: string, ctx: FeatureRenderContext): string {
  const feature = getFeature(category, id);
  if (!feature?.renderPath) return "";
  return feature.renderPath(ctx);
}

// ── Main renderer ──
export function renderSilhouette(garment: GarmentConfig, theme: SketchTheme = "dark", view: SketchView = "front"): string {
  currentTheme = theme;
  currentView = view;
  const croquis = renderCroquis();
  const garmentPaths: string[] = [];
  const extras: string[] = [];
  const strokeColor = "hsl(var(--primary))";
  const fillColor = "url(#garment-shade)";

  switch (garment.category) {
    case "top": {
      const c = garment.config;
      const hemY = getHemY(c.length);
      const fw = fitExpand(c.fit);
      const hemW = WAIST_W + fw + (hemY > HIP_Y ? (HIP_W - WAIST_W + fw) : 0);
      const ctx: FeatureRenderContext = { fit: c.fit, view, hemY, hemW };

      garmentPaths.push(featurePath("neckline", c.neckline, ctx));
      garmentBodyPaths(hemY, c.fit).forEach(p => garmentPaths.push(p));

      const slL = getSleevePathForSide(c.sleeve, "left", c.fit);
      const slR = getSleevePathForSide(c.sleeve, "right", c.fit);
      if (slL) garmentPaths.push(slL);
      if (slR) garmentPaths.push(slR);

      extras.push(featureDecoration("collar", c.collar, ctx));
      extras.push(featureDecoration("closure", c.closure, ctx));
      c.details.forEach(d => extras.push(featureDecoration("detail", d, ctx)));
      break;
    }
    case "dress": {
      const c = garment.config;
      const hemY = getHemY(c.skirtLength);
      const flare = getFlare(c.skirtSilhouette);
      const fw = fitExpand(c.fit);
      const hemW = HIP_W + fw + flare;
      let waistShift = 0;
      if (c.waistline === "empire") waistShift = -(WAIST_Y - BUST_Y) + 12;
      else if (c.waistline === "drop") waistShift = (HIP_Y - WAIST_Y) - 8;
      const ctx: FeatureRenderContext = { fit: c.fit, view, hemY, hemW };

      garmentPaths.push(featurePath("neckline", c.neckline, ctx));
      garmentBodyPaths(hemY, c.fit, flare, waistShift).forEach(p => garmentPaths.push(p));

      const slL = getSleevePathForSide(c.sleeve, "left", c.fit);
      const slR = getSleevePathForSide(c.sleeve, "right", c.fit);
      if (slL) garmentPaths.push(slL);
      if (slR) garmentPaths.push(slR);

      extras.push(waistlineIndicator(c.waistline));
      extras.push(featureDecoration("collar", c.collar, ctx));
      extras.push(featureDecoration("closure", c.closure, ctx));
      c.details.forEach(d => extras.push(featureDecoration("detail", d, ctx)));
      extras.push(gatheredTexture(hemY, hemW, c.skirtSilhouette));
      break;
    }
    case "skirt": {
      const c = garment.config;
      const hemY = getHemY(c.length);
      const flare = getFlare(c.silhouette);
      const hw = HIP_W + flare;
      const ww = WAIST_W;
      const wbH = c.waistband === "yoke" ? 16 : 7;
      const ctx: FeatureRenderContext = { fit: "regular", view, hemY, hemW: hw };

      const skirt = `M ${CX - ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y} C ${CX + ww + 2} ${WAIST_Y + 12} ${CX + HIP_W + 2} ${HIP_Y - 8} ${CX + HIP_W} ${HIP_Y} C ${CX + HIP_W + 1} ${HIP_Y + 10} ${CX + hw + 1} ${hemY - 15} ${CX + hw} ${hemY} L ${CX - hw} ${hemY} C ${CX - hw - 1} ${hemY - 15} ${CX - HIP_W - 1} ${HIP_Y + 10} ${CX - HIP_W} ${HIP_Y} C ${CX - HIP_W - 2} ${HIP_Y - 8} ${CX - ww - 2} ${WAIST_Y + 12} ${CX - ww} ${WAIST_Y} Z`;
      garmentPaths.push(skirt);

      extras.push(`<line x1="${CX - ww}" y1="${WAIST_Y}" x2="${CX + ww}" y2="${WAIST_Y}" stroke="hsl(var(--primary) / 0.3)" stroke-width="0.5" />`);
      c.details.forEach(d => extras.push(featureDecoration("detail", d, ctx)));
      extras.push(gatheredTexture(hemY, hw, c.silhouette));
      break;
    }
    case "pants": {
      const c = garment.config;
      const hemY = getHemY(c.length);
      const ctx: FeatureRenderContext = { fit: "regular", view, hemY, hemW: 17 };
      pantsBody(c.style, c.length, c.waistband, "regular").forEach(p => garmentPaths.push(p));

      extras.push(pantsPocketDecor(c.pockets, c.style));
      c.details.forEach(d => extras.push(featureDecoration("detail", d, ctx)));

      if (c.style === "straight" || c.style === "tapered" || c.style === "slim") {
        extras.push(`<line x1="${CX - 12}" y1="${CROTCH_Y + 15}" x2="${CX - 12}" y2="${hemY - 5}" stroke="hsl(var(--muted-foreground) / 0.15)" stroke-width="0.4" />`);
        extras.push(`<line x1="${CX + 12}" y1="${CROTCH_Y + 15}" x2="${CX + 12}" y2="${hemY - 5}" stroke="hsl(var(--muted-foreground) / 0.15)" stroke-width="0.4" />`);
      }
      break;
    }
  }

  const mainPaths = garmentPaths
    .map(d => `<path d="${d}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" />`)
    .join("\n    ");

  const themeStyle = currentTheme === "light" ? `<style>
    svg { --primary: 20 8% 15%; --primary-foreground: 0 0% 96%; --muted-foreground: 20 6% 35%; --muted: 20 5% 85%; --border: 20 5% 75%; }
  </style>` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="w-full h-full">
    ${themeStyle}
    ${gradientDefs()}
    ${croquis}
    ${mainPaths}
    ${extras.join("\n    ")}
  </svg>`;
}
