/**
 * Fashion-illustration quality SVG silhouette renderer.
 * Renders a croquis (fashion figure) with garment overlay using smooth bezier curves,
 * realistic body proportions, and subtle shading for depth.
 */
import type {
  GarmentConfig, NecklineType, SleeveType, CollarType, FitType,
  SkirtSilhouette, SkirtLength, PantsStyle, PantsLength,
  DressWaistline, TopLength, ClosureType, DetailType, WaistbandType
} from "./garment-config";

const W = 260;
const H = 600;
const CX = W / 2;

// ── Anatomical landmarks (9-head fashion proportion) ──
const HEAD_TOP = 20;
const HEAD_H = 52;
const CHIN = HEAD_TOP + HEAD_H;
const NECK_BASE = CHIN + 12;
const SHOULDER_Y = NECK_BASE + 8;
const BUST_Y = SHOULDER_Y + 52;
const WAIST_Y = BUST_Y + 52;
const HIP_Y = WAIST_Y + 38;
const CROTCH_Y = HIP_Y + 32;
const KNEE_Y = CROTCH_Y + 80;
const ANKLE_Y = KNEE_Y + 90;
const FOOT_Y = ANKLE_Y + 16;

const SHOULDER_W = 42;
const NECK_W = 10;
const BUST_W = 38;
const WAIST_W = 28;
const HIP_W = 40;
const KNEE_W = 14;
const ANKLE_W = 10;

// Arm landmarks
const ARM_PIT_Y = BUST_Y - 8;
const ELBOW_Y = WAIST_Y + 15;
const WRIST_Y = HIP_Y + 20;
const HAND_Y = WRIST_Y + 22;

export type SketchTheme = "dark" | "light";

let currentTheme: SketchTheme = "dark";

// ── Croquis (body figure) ──
function renderCroquis(): string {
  const skin = "hsl(var(--muted-foreground) / 0.15)";
  const skinStroke = "hsl(var(--muted-foreground) / 0.25)";
  const hairColor = "hsl(var(--muted-foreground) / 0.2)";

  // Head - oval
  const headCX = CX;
  const headCY = HEAD_TOP + HEAD_H / 2;
  const headRX = 18;
  const headRY = HEAD_H / 2;

  // Hair (simple)
  const hair = `<ellipse cx="${headCX}" cy="${headCY - 4}" rx="${headRX + 3}" ry="${headRY + 2}" fill="${hairColor}" />`;

  // Head
  const head = `<ellipse cx="${headCX}" cy="${headCY}" rx="${headRX}" ry="${headRY}" fill="${skin}" stroke="${skinStroke}" stroke-width="0.8" />`;

  // Face features (subtle)
  const features = `
    <ellipse cx="${CX - 6}" cy="${headCY - 2}" rx="2" ry="1.2" fill="none" stroke="${skinStroke}" stroke-width="0.6" />
    <ellipse cx="${CX + 6}" cy="${headCY - 2}" rx="2" ry="1.2" fill="none" stroke="${skinStroke}" stroke-width="0.6" />
    <path d="M ${CX - 4} ${headCY + 8} Q ${CX} ${headCY + 11} ${CX + 4} ${headCY + 8}" fill="none" stroke="${skinStroke}" stroke-width="0.6" />
    <line x1="${CX - 1}" y1="${headCY + 2}" x2="${CX}" y2="${headCY + 5}" stroke="${skinStroke}" stroke-width="0.5" />
  `;

  // Neck
  const neck = `<path d="M ${CX - NECK_W} ${CHIN} L ${CX - NECK_W} ${NECK_BASE} Q ${CX - NECK_W - 2} ${SHOULDER_Y} ${CX - SHOULDER_W} ${SHOULDER_Y} M ${CX + NECK_W} ${CHIN} L ${CX + NECK_W} ${NECK_BASE} Q ${CX + NECK_W + 2} ${SHOULDER_Y} ${CX + SHOULDER_W} ${SHOULDER_Y}" fill="none" stroke="${skinStroke}" stroke-width="0.8" />`;

  // Torso outline (smooth curves)
  const torsoLeft = `M ${CX - SHOULDER_W} ${SHOULDER_Y} C ${CX - SHOULDER_W + 2} ${SHOULDER_Y + 20} ${CX - BUST_W - 2} ${BUST_Y - 15} ${CX - BUST_W} ${BUST_Y} C ${CX - BUST_W + 2} ${BUST_Y + 20} ${CX - WAIST_W - 4} ${WAIST_Y - 15} ${CX - WAIST_W} ${WAIST_Y} C ${CX - WAIST_W - 2} ${WAIST_Y + 15} ${CX - HIP_W - 2} ${HIP_Y - 10} ${CX - HIP_W} ${HIP_Y}`;
  const torsoRight = `M ${CX + SHOULDER_W} ${SHOULDER_Y} C ${CX + SHOULDER_W - 2} ${SHOULDER_Y + 20} ${CX + BUST_W + 2} ${BUST_Y - 15} ${CX + BUST_W} ${BUST_Y} C ${CX + BUST_W - 2} ${BUST_Y + 20} ${CX + WAIST_W + 4} ${WAIST_Y - 15} ${CX + WAIST_W} ${WAIST_Y} C ${CX + WAIST_W + 2} ${WAIST_Y + 15} ${CX + HIP_W + 2} ${HIP_Y - 10} ${CX + HIP_W} ${HIP_Y}`;
  const torso = `<path d="${torsoLeft}" fill="none" stroke="${skinStroke}" stroke-width="0.7" /><path d="${torsoRight}" fill="none" stroke="${skinStroke}" stroke-width="0.7" />`;

  // Arms (relaxed, slightly away from body)
  const armOffX = 8;
  const leftArm = `M ${CX - SHOULDER_W} ${SHOULDER_Y} C ${CX - SHOULDER_W - armOffX} ${ARM_PIT_Y} ${CX - SHOULDER_W - armOffX - 4} ${ELBOW_Y - 20} ${CX - SHOULDER_W - armOffX - 2} ${ELBOW_Y} C ${CX - SHOULDER_W - armOffX} ${ELBOW_Y + 20} ${CX - SHOULDER_W - armOffX + 2} ${WRIST_Y - 10} ${CX - SHOULDER_W - armOffX + 4} ${WRIST_Y} L ${CX - SHOULDER_W - armOffX + 6} ${HAND_Y}`;
  const rightArm = `M ${CX + SHOULDER_W} ${SHOULDER_Y} C ${CX + SHOULDER_W + armOffX} ${ARM_PIT_Y} ${CX + SHOULDER_W + armOffX + 4} ${ELBOW_Y - 20} ${CX + SHOULDER_W + armOffX + 2} ${ELBOW_Y} C ${CX + SHOULDER_W + armOffX} ${ELBOW_Y + 20} ${CX + SHOULDER_W + armOffX - 2} ${WRIST_Y - 10} ${CX + SHOULDER_W + armOffX - 4} ${WRIST_Y} L ${CX + SHOULDER_W + armOffX - 6} ${HAND_Y}`;
  const arms = `<path d="${leftArm}" fill="none" stroke="${skinStroke}" stroke-width="2.5" stroke-linecap="round" /><path d="${rightArm}" fill="none" stroke="${skinStroke}" stroke-width="2.5" stroke-linecap="round" />`;

  // Legs
  const legGap = 4;
  const leftLeg = `M ${CX - HIP_W + 5} ${HIP_Y} C ${CX - HIP_W + 8} ${CROTCH_Y - 10} ${CX - legGap - KNEE_W} ${KNEE_Y - 20} ${CX - legGap - KNEE_W + 2} ${KNEE_Y} C ${CX - legGap - KNEE_W + 4} ${KNEE_Y + 20} ${CX - legGap - ANKLE_W} ${ANKLE_Y - 20} ${CX - legGap - ANKLE_W + 2} ${ANKLE_Y} L ${CX - legGap - ANKLE_W - 2} ${FOOT_Y} L ${CX - legGap + 4} ${FOOT_Y}`;
  const rightLeg = `M ${CX + HIP_W - 5} ${HIP_Y} C ${CX + HIP_W - 8} ${CROTCH_Y - 10} ${CX + legGap + KNEE_W} ${KNEE_Y - 20} ${CX + legGap + KNEE_W - 2} ${KNEE_Y} C ${CX + legGap + KNEE_W - 4} ${KNEE_Y + 20} ${CX + legGap + ANKLE_W} ${ANKLE_Y - 20} ${CX + legGap + ANKLE_W - 2} ${ANKLE_Y} L ${CX + legGap + ANKLE_W + 2} ${FOOT_Y} L ${CX + legGap - 4} ${FOOT_Y}`;
  // Inner legs
  const leftLegIn = `M ${CX - legGap} ${CROTCH_Y} C ${CX - legGap} ${KNEE_Y - 20} ${CX - legGap + 2} ${KNEE_Y} ${CX - legGap + 2} ${KNEE_Y} C ${CX - legGap + 2} ${KNEE_Y + 20} ${CX - legGap + 4} ${ANKLE_Y - 10} ${CX - legGap + 4} ${FOOT_Y}`;
  const rightLegIn = `M ${CX + legGap} ${CROTCH_Y} C ${CX + legGap} ${KNEE_Y - 20} ${CX + legGap - 2} ${KNEE_Y} ${CX + legGap - 2} ${KNEE_Y} C ${CX + legGap - 2} ${KNEE_Y + 20} ${CX + legGap - 4} ${ANKLE_Y - 10} ${CX + legGap - 4} ${FOOT_Y}`;
  const legs = `<path d="${leftLeg}" fill="none" stroke="${skinStroke}" stroke-width="0.8" /><path d="${rightLeg}" fill="none" stroke="${skinStroke}" stroke-width="0.8" /><path d="${leftLegIn}" fill="none" stroke="${skinStroke}" stroke-width="0.6" /><path d="${rightLegIn}" fill="none" stroke="${skinStroke}" stroke-width="0.6" />`;

  return `${hair}${head}${features}${neck}${torso}${arms}${legs}`;
}

// ── Garment rendering helpers ──

function fitExpand(fit: FitType): number {
  switch (fit) {
    case "loose": return 10;
    case "fitted": return -3;
    default: return 2;
  }
}

function necklinePath(type: NecklineType, fit: FitType): string {
  const fw = fitExpand(fit);
  const sw = SHOULDER_W + fw;
  const nBase = NECK_BASE;

  switch (type) {
    case "v-neck":
      return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 10} ${SHOULDER_Y - 4} ${CX - NECK_W} ${nBase - 2} ${CX - NECK_W} ${nBase} L ${CX} ${BUST_Y + 5} L ${CX + NECK_W} ${nBase} C ${CX + NECK_W} ${nBase - 2} ${CX + sw - 10} ${SHOULDER_Y - 4} ${CX + sw} ${SHOULDER_Y}`;
    case "boat":
      return `M ${CX - sw} ${SHOULDER_Y + 2} Q ${CX} ${SHOULDER_Y - 6} ${CX + sw} ${SHOULDER_Y + 2}`;
    case "square": {
      const sqW = 18;
      const sqD = 20;
      return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 3} ${CX - sqW - 2} ${SHOULDER_Y - 2} ${CX - sqW} ${SHOULDER_Y} L ${CX - sqW} ${SHOULDER_Y + sqD} L ${CX + sqW} ${SHOULDER_Y + sqD} L ${CX + sqW} ${SHOULDER_Y} C ${CX + sqW + 2} ${SHOULDER_Y - 2} ${CX + sw - 8} ${SHOULDER_Y - 3} ${CX + sw} ${SHOULDER_Y}`;
    }
    case "sweetheart":
      return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 4} ${CX - 16} ${SHOULDER_Y + 5} ${CX - 12} ${SHOULDER_Y + 22} Q ${CX} ${SHOULDER_Y + 32} ${CX + 12} ${SHOULDER_Y + 22} C ${CX + 16} ${SHOULDER_Y + 5} ${CX + sw - 8} ${SHOULDER_Y - 4} ${CX + sw} ${SHOULDER_Y}`;
    case "mandarin": {
      const mw = 12;
      const mh = 10;
      return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 3} ${CX - mw - 4} ${nBase + 2} ${CX - mw} ${nBase} L ${CX - mw} ${nBase - mh} Q ${CX} ${nBase - mh - 4} ${CX + mw} ${nBase - mh} L ${CX + mw} ${nBase} C ${CX + mw + 4} ${nBase + 2} ${CX + sw - 8} ${SHOULDER_Y - 3} ${CX + sw} ${SHOULDER_Y}`;
    }
    case "round":
    default: {
      const depth = 18;
      return `M ${CX - sw} ${SHOULDER_Y} C ${CX - sw + 8} ${SHOULDER_Y - 4} ${CX - 15} ${nBase - depth + 2} ${CX} ${nBase - depth + 8} C ${CX + 15} ${nBase - depth + 2} ${CX + sw - 8} ${SHOULDER_Y - 4} ${CX + sw} ${SHOULDER_Y}`;
    }
  }
}

function sleevePath(type: SleeveType, side: "left" | "right", fit: FitType): string {
  if (type === "sleeveless") return "";

  const fw = fitExpand(fit);
  const dir = side === "left" ? -1 : 1;
  const sx = CX + dir * (SHOULDER_W + fw);
  const sy = SHOULDER_Y;
  const armOff = dir * 8;

  // Arm center line points (matching croquis)
  const elbowX = sx + dir * 6 + armOff;
  const elbowYPos = ELBOW_Y;
  const wristX = sx + dir * 4 + armOff;
  const wristYPos = WRIST_Y;

  const sleeveW = (type === "puff" || type === "bell") ? 18 : 12 + fw;

  switch (type) {
    case "cap": {
      const capEnd = sy + 28;
      return `M ${sx} ${sy} C ${sx + dir * 14} ${sy - 8} ${sx + dir * 20} ${sy + 5} ${sx + dir * 16} ${capEnd} C ${sx + dir * 12} ${capEnd + 5} ${sx + dir * 4} ${capEnd + 2} ${sx} ${capEnd - 5}`;
    }
    case "short": {
      const endY = sy + 48;
      return `M ${sx} ${sy} C ${sx + dir * 15} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${sx + dir * 18} ${endY} L ${sx + dir * 4} ${endY} C ${sx + dir * 2} ${endY - 8} ${sx - dir * 2} ${ARM_PIT_Y + 10} ${sx} ${ARM_PIT_Y}`;
    }
    case "three-quarter": {
      const endY = elbowYPos + 25;
      const outerX = elbowX + dir * (sleeveW / 2);
      const innerX = elbowX - dir * (sleeveW / 2 - 4);
      return `M ${sx} ${sy} C ${sx + dir * 16} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${outerX + dir * 4} ${ARM_PIT_Y + 10} C ${outerX + dir * 2} ${elbowYPos - 10} ${outerX} ${endY - 15} ${outerX} ${endY} L ${innerX} ${endY} C ${innerX} ${endY - 15} ${sx - dir * 2} ${ARM_PIT_Y + 15} ${sx} ${ARM_PIT_Y}`;
    }
    case "long": {
      const endY = wristYPos + 5;
      const outerElbowX = elbowX + dir * (sleeveW / 2);
      const outerWristX = wristX + dir * (sleeveW / 2 - 2);
      const innerWristX = wristX - dir * (sleeveW / 2 - 5);
      const innerElbowX = elbowX - dir * (sleeveW / 2 - 5);
      return `M ${sx} ${sy} C ${sx + dir * 16} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${outerElbowX + dir * 2} ${ARM_PIT_Y + 10} C ${outerElbowX} ${elbowYPos - 10} ${outerWristX + dir * 2} ${endY - 40} ${outerWristX} ${endY} L ${innerWristX} ${endY} C ${innerWristX} ${endY - 30} ${innerElbowX} ${elbowYPos - 10} ${sx} ${ARM_PIT_Y}`;
    }
    case "bell": {
      const endY = wristYPos + 8;
      const bellFlare = 28;
      const outerElbowX = elbowX + dir * (sleeveW / 2);
      const outerWristX = wristX + dir * bellFlare;
      const innerWristX = wristX - dir * (bellFlare - 10);
      return `M ${sx} ${sy} C ${sx + dir * 16} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${outerElbowX + dir * 2} ${ARM_PIT_Y + 10} C ${outerElbowX} ${elbowYPos - 10} ${outerWristX - dir * 8} ${endY - 40} ${outerWristX} ${endY} Q ${wristX + dir * 6} ${endY + 6} ${innerWristX} ${endY} C ${innerWristX + dir * 4} ${endY - 30} ${elbowX - dir * 4} ${elbowYPos - 5} ${sx} ${ARM_PIT_Y}`;
    }
    case "puff": {
      const endY = sy + 40;
      const puffW = 24;
      return `M ${sx} ${sy} C ${sx + dir * puffW} ${sy - 12} ${sx + dir * (puffW + 6)} ${sy + 10} ${sx + dir * puffW} ${sy + 20} C ${sx + dir * (puffW - 2)} ${sy + 30} ${sx + dir * 14} ${endY + 2} ${sx + dir * 12} ${endY} L ${sx + dir * 2} ${endY} C ${sx} ${endY - 5} ${sx - dir * 2} ${ARM_PIT_Y + 10} ${sx} ${ARM_PIT_Y}`;
    }
    default:
      return "";
  }
}

/** Returns an array of separate path strings (each with its own M command) for the garment body. */
function garmentBodyPaths(hemY: number, fit: FitType, flare: number = 0, waistlineShift: number = 0): string[] {
  const fw = fitExpand(fit);
  const bw = BUST_W + fw;
  const ww = WAIST_W + fw;
  const hw = HIP_W + fw;

  const actualWaistY = WAIST_Y + waistlineShift;
  const hemW = hw + flare;

  if (hemY <= BUST_Y + 10) {
    const tw = bw - (bw - ww) * ((hemY - SHOULDER_Y) / (WAIST_Y - SHOULDER_Y));
    // Left side
    const left = `M ${CX - bw} ${BUST_Y} C ${CX - bw + 1} ${BUST_Y + 5} ${CX - tw - 2} ${hemY - 5} ${CX - tw} ${hemY}`;
    // Hem
    const hem = `M ${CX - tw} ${hemY} L ${CX + tw} ${hemY}`;
    // Right side
    const right = `M ${CX + tw} ${hemY} C ${CX + tw + 2} ${hemY - 5} ${CX + bw - 1} ${BUST_Y + 5} ${CX + bw} ${BUST_Y}`;
    return [left, hem, right];
  }

  if (hemY <= actualWaistY + 5) {
    const left = `M ${CX - bw} ${BUST_Y} C ${CX - bw + 2} ${BUST_Y + 18} ${CX - ww - 3} ${hemY - 15} ${CX - ww} ${hemY}`;
    const hem = `M ${CX - ww} ${hemY} L ${CX + ww} ${hemY}`;
    const right = `M ${CX + ww} ${hemY} C ${CX + ww + 3} ${hemY - 15} ${CX + bw - 2} ${BUST_Y + 18} ${CX + bw} ${BUST_Y}`;
    return [left, hem, right];
  }

  if (hemY <= HIP_Y + 10) {
    const t = (hemY - actualWaistY) / (HIP_Y - actualWaistY);
    const hemWAtY = ww + (hw - ww) * t + flare * t;
    const left = `M ${CX - bw} ${BUST_Y} C ${CX - bw + 2} ${BUST_Y + 18} ${CX - ww - 3} ${actualWaistY - 15} ${CX - ww} ${actualWaistY} C ${CX - ww - 2} ${actualWaistY + 12} ${CX - hemWAtY - 2} ${hemY - 10} ${CX - hemWAtY} ${hemY}`;
    const hem = `M ${CX - hemWAtY} ${hemY} L ${CX + hemWAtY} ${hemY}`;
    const right = `M ${CX + hemWAtY} ${hemY} C ${CX + hemWAtY + 2} ${hemY - 10} ${CX + ww + 2} ${actualWaistY + 12} ${CX + ww} ${actualWaistY} C ${CX + ww + 3} ${actualWaistY - 15} ${CX + bw - 2} ${BUST_Y + 18} ${CX + bw} ${BUST_Y}`;
    return [left, hem, right];
  }

  // Below hip
  const left = `M ${CX - bw} ${BUST_Y} C ${CX - bw + 2} ${BUST_Y + 18} ${CX - ww - 3} ${actualWaistY - 15} ${CX - ww} ${actualWaistY} C ${CX - ww - 2} ${actualWaistY + 12} ${CX - hw - 2} ${HIP_Y - 8} ${CX - hw} ${HIP_Y} C ${CX - hw - 1} ${HIP_Y + 10} ${CX - hemW - 1} ${hemY - 15} ${CX - hemW} ${hemY}`;
  const hem = `M ${CX - hemW} ${hemY} L ${CX + hemW} ${hemY}`;
  const right = `M ${CX + hemW} ${hemY} C ${CX + hemW + 1} ${hemY - 15} ${CX + hw + 1} ${HIP_Y + 10} ${CX + hw} ${HIP_Y} C ${CX + hw + 2} ${HIP_Y - 8} ${CX + ww + 2} ${actualWaistY + 12} ${CX + ww} ${actualWaistY} C ${CX + ww + 3} ${actualWaistY - 15} ${CX + bw - 2} ${BUST_Y + 18} ${CX + bw} ${BUST_Y}`;
  return [left, hem, right];
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

function collarPath(type: CollarType, fit: FitType): string {
  const fw = fitExpand(fit);
  const sw = SHOULDER_W + fw;
  switch (type) {
    case "none": return "";
    case "peter-pan": {
      return `<path d="M ${CX - 12} ${NECK_BASE} C ${CX - 18} ${SHOULDER_Y + 3} ${CX - sw + 8} ${SHOULDER_Y + 8} ${CX - sw + 3} ${SHOULDER_Y + 3} M ${CX + 12} ${NECK_BASE} C ${CX + 18} ${SHOULDER_Y + 3} ${CX + sw - 8} ${SHOULDER_Y + 8} ${CX + sw - 3} ${SHOULDER_Y + 3}" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary))" stroke-width="1" />`;
    }
    case "mandarin": {
      return `<path d="M ${CX - 10} ${NECK_BASE - 2} L ${CX - 10} ${NECK_BASE - 14} Q ${CX} ${NECK_BASE - 18} ${CX + 10} ${NECK_BASE - 14} L ${CX + 10} ${NECK_BASE - 2}" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary))" stroke-width="1" />`;
    }
    case "shirt": {
      return `<path d="M ${CX - 10} ${NECK_BASE - 2} L ${CX - 22} ${SHOULDER_Y + 14} L ${CX - 10} ${SHOULDER_Y + 8} M ${CX + 10} ${NECK_BASE - 2} L ${CX + 22} ${SHOULDER_Y + 14} L ${CX + 10} ${SHOULDER_Y + 8}" fill="none" stroke="hsl(var(--primary))" stroke-width="1" />`;
    }
    case "sailor": {
      return `<path d="M ${CX - 12} ${NECK_BASE} L ${CX - sw - 8} ${BUST_Y + 5} L ${CX - sw + 12} ${BUST_Y + 5} Z M ${CX + 12} ${NECK_BASE} L ${CX + sw + 8} ${BUST_Y + 5} L ${CX + sw - 12} ${BUST_Y + 5} Z" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary))" stroke-width="1" />`;
    }
    default: return "";
  }
}

function closureDecoration(type: ClosureType, hemY: number): string {
  if (type === "none") return "";
  if (type === "front-buttons") {
    const dots: string[] = [];
    for (let y = SHOULDER_Y + 20; y < hemY - 10; y += 22) {
      dots.push(`<circle cx="${CX}" cy="${y}" r="2.5" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`);
      dots.push(`<circle cx="${CX}" cy="${y}" r="0.8" fill="hsl(var(--primary))" />`);
    }
    return dots.join("");
  }
  if (type === "back-zip") {
    return `<line x1="${CX}" y1="${NECK_BASE}" x2="${CX}" y2="${Math.min(hemY - 10, WAIST_Y + 15)}" stroke="hsl(var(--muted-foreground) / 0.4)" stroke-width="0.6" stroke-dasharray="3 2" />`;
  }
  if (type === "wrap") {
    return `<path d="M ${CX - 8} ${SHOULDER_Y + 5} C ${CX} ${BUST_Y} ${CX + 5} ${BUST_Y + 10} ${CX + 12} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" /><path d="M ${CX + 12} ${WAIST_Y} L ${CX + 20} ${WAIST_Y + 15} L ${CX + 12} ${WAIST_Y + 30}" fill="none" stroke="hsl(var(--primary))" stroke-width="0.8" />`;
  }
  if (type === "side-zip") {
    const fw = 2;
    return `<line x1="${CX + WAIST_W + fw}" y1="${BUST_Y + 10}" x2="${CX + WAIST_W + fw}" y2="${WAIST_Y + 10}" stroke="hsl(var(--muted-foreground) / 0.3)" stroke-width="0.5" stroke-dasharray="2 2" />`;
  }
  return "";
}

function detailElements(details: DetailType[], hemY: number, hemW: number): string {
  const els: string[] = [];
  details.forEach(d => {
    switch (d) {
      case "lace-trim": {
        let scallop = `M ${CX - hemW} ${hemY}`;
        for (let x = CX - hemW; x < CX + hemW; x += 7) {
          scallop += ` Q ${x + 3.5} ${hemY + 5} ${x + 7} ${hemY}`;
        }
        els.push(`<path d="${scallop}" fill="none" stroke="hsl(var(--primary) / 0.5)" stroke-width="0.8" />`);
        let inner = `M ${CX - hemW + 2} ${hemY - 3}`;
        for (let x = CX - hemW + 2; x < CX + hemW - 2; x += 5) {
          inner += ` Q ${x + 2.5} ${hemY + 1} ${x + 5} ${hemY - 3}`;
        }
        els.push(`<path d="${inner}" fill="none" stroke="hsl(var(--primary) / 0.3)" stroke-width="0.5" />`);
        break;
      }
      case "ruffle": {
        for (let row = 0; row < 2; row++) {
          let wave = `M ${CX - hemW} ${hemY - row * 5}`;
          for (let x = CX - hemW; x < CX + hemW; x += 8) {
            const amp = 4 + Math.sin(x * 0.3) * 2;
            wave += ` C ${x + 2} ${hemY - row * 5 + amp} ${x + 6} ${hemY - row * 5 - amp * 0.5} ${x + 8} ${hemY - row * 5}`;
          }
          els.push(`<path d="${wave}" fill="none" stroke="hsl(var(--primary) / ${0.4 - row * 0.15})" stroke-width="0.7" />`);
        }
        break;
      }
      case "pintucks": {
        for (let i = -3; i <= 3; i++) {
          els.push(`<line x1="${CX + i * 5}" y1="${SHOULDER_Y + 15}" x2="${CX + i * 5}" y2="${WAIST_Y - 5}" stroke="hsl(var(--muted-foreground) / 0.25)" stroke-width="0.4" />`);
        }
        break;
      }
      case "piping": {
        els.push(`<path d="M ${CX - SHOULDER_W} ${SHOULDER_Y} C ${CX - BUST_W - 2} ${BUST_Y - 5} ${CX - WAIST_W - 2} ${WAIST_Y - 10} ${CX - WAIST_W} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="1.2" />`);
        els.push(`<path d="M ${CX + SHOULDER_W} ${SHOULDER_Y} C ${CX + BUST_W + 2} ${BUST_Y - 5} ${CX + WAIST_W + 2} ${WAIST_Y - 10} ${CX + WAIST_W} ${WAIST_Y}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="1.2" />`);
        break;
      }
      case "embroidery-border": {
        let emb = `M ${CX - hemW + 4} ${hemY - 10}`;
        for (let x = CX - hemW + 4; x < CX + hemW - 4; x += 6) {
          emb += ` C ${x + 1.5} ${hemY - 14} ${x + 3} ${hemY - 6} ${x + 6} ${hemY - 10}`;
        }
        els.push(`<path d="${emb}" fill="none" stroke="hsl(var(--primary) / 0.4)" stroke-width="0.7" />`);
        let dots = "";
        for (let x = CX - hemW + 7; x < CX + hemW - 7; x += 12) {
          dots += `<circle cx="${x}" cy="${hemY - 16}" r="1" fill="hsl(var(--primary) / 0.3)" />`;
        }
        els.push(dots);
        break;
      }
    }
  });
  return els.join("");
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

function pantsBody(style: PantsStyle, length: PantsLength, waistband: WaistbandType, fit: FitType): string {
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

  // Left leg
  const leftOuter = `M ${CX - ww} ${WAIST_Y - wbH} L ${CX - ww} ${WAIST_Y} C ${CX - ww - 1} ${WAIST_Y + 10} ${CX - hw - 2} ${HIP_Y - 8} ${CX - hw} ${HIP_Y} C ${CX - hipLegW - 1} ${HIP_Y + 10} ${CX - hipLegW - 2} ${crotchY - 5} ${CX - hipLegW} ${crotchY} C ${CX - hipLegW + 2} ${crotchY + 20} ${CX - legW - 2} ${hemY - 20} ${CX - legW} ${hemY}`;
  const leftInner = `L ${CX - gap} ${hemY} C ${CX - gap} ${hemY - 20} ${CX - gap} ${crotchY + 10} ${CX - gap} ${crotchY}`;

  // Right leg
  const rightInner = `M ${CX + gap} ${crotchY} C ${CX + gap} ${crotchY + 10} ${CX + gap} ${hemY - 20} ${CX + gap} ${hemY}`;
  const rightOuter = `L ${CX + legW} ${hemY} C ${CX + legW + 2} ${hemY - 20} ${CX + hipLegW - 2} ${crotchY + 20} ${CX + hipLegW} ${crotchY} C ${CX + hipLegW + 2} ${crotchY - 5} ${CX + hipLegW + 1} ${HIP_Y + 10} ${CX + hw} ${HIP_Y} C ${CX + hw + 2} ${HIP_Y - 8} ${CX + ww + 1} ${WAIST_Y + 10} ${CX + ww} ${WAIST_Y} L ${CX + ww} ${WAIST_Y - wbH}`;

  // Waistband
  const wband = `M ${CX - ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y - wbH}`;

  // Crotch curve
  const crotchCurve = `M ${CX - gap} ${crotchY} Q ${CX} ${crotchY + 8} ${CX + gap} ${crotchY}`;

  return `${leftOuter} ${leftInner} ${crotchCurve} ${rightInner} ${rightOuter} ${wband}`;
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

// ── Subtle shading gradient definitions ──
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

// ── Main renderer ──
export function renderSilhouette(garment: GarmentConfig, theme: SketchTheme = "dark"): string {
  currentTheme = theme;
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
      const sw = SHOULDER_W + fw;
      const hemW = WAIST_W + fw + (hemY > HIP_Y ? (HIP_W - WAIST_W + fw) : 0);

      garmentPaths.push(necklinePath(c.neckline, c.fit));
      garmentBodyPaths(hemY, c.fit).forEach(p => garmentPaths.push(p));

      const slL = sleevePath(c.sleeve, "left", c.fit);
      const slR = sleevePath(c.sleeve, "right", c.fit);
      if (slL) garmentPaths.push(slL);
      if (slR) garmentPaths.push(slR);

      extras.push(collarPath(c.collar, c.fit));
      extras.push(closureDecoration(c.closure, hemY));
      extras.push(detailElements(c.details, hemY, hemW));
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

      const neck = necklinePath(c.neckline, c.fit);
      const body = garmentBodyPath(hemY, c.fit, flare, waistShift);
      // Keep subpaths open: avoid top-crossing close-stroke artifacts.
      garmentPaths.push(`${neck} ${body}`);

      const slL = sleevePath(c.sleeve, "left", c.fit);
      const slR = sleevePath(c.sleeve, "right", c.fit);
      if (slL) garmentPaths.push(slL);
      if (slR) garmentPaths.push(slR);

      extras.push(waistlineIndicator(c.waistline));
      extras.push(collarPath(c.collar, c.fit));
      extras.push(closureDecoration(c.closure, hemY));
      extras.push(detailElements(c.details, hemY, hemW));
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

      const skirt = `M ${CX - ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y - wbH} L ${CX + ww} ${WAIST_Y} C ${CX + ww + 2} ${WAIST_Y + 12} ${CX + HIP_W + 2} ${HIP_Y - 8} ${CX + HIP_W} ${HIP_Y} C ${CX + HIP_W + 1} ${HIP_Y + 10} ${CX + hw + 1} ${hemY - 15} ${CX + hw} ${hemY} L ${CX - hw} ${hemY} C ${CX - hw - 1} ${hemY - 15} ${CX - HIP_W - 1} ${HIP_Y + 10} ${CX - HIP_W} ${HIP_Y} C ${CX - HIP_W - 2} ${HIP_Y - 8} ${CX - ww - 2} ${WAIST_Y + 12} ${CX - ww} ${WAIST_Y} Z`;
      garmentPaths.push(skirt);

      // Waistband line
      extras.push(`<line x1="${CX - ww}" y1="${WAIST_Y}" x2="${CX + ww}" y2="${WAIST_Y}" stroke="hsl(var(--primary) / 0.3)" stroke-width="0.5" />`);
      extras.push(detailElements(c.details, hemY, hw));
      extras.push(gatheredTexture(hemY, hw, c.silhouette));
      break;
    }
    case "pants": {
      const c = garment.config;
      const p = pantsBody(c.style, c.length, c.waistband, "regular");
      garmentPaths.push(p);

      extras.push(pantsPocketDecor(c.pockets, c.style));
      extras.push(detailElements(c.details, getHemY(c.length), 17));

      // Center crease for tailored styles
      if (c.style === "straight" || c.style === "tapered" || c.style === "slim") {
        const hemY = getHemY(c.length);
        extras.push(`<line x1="${CX - 12}" y1="${CROTCH_Y + 15}" x2="${CX - 12}" y2="${hemY - 5}" stroke="hsl(var(--muted-foreground) / 0.15)" stroke-width="0.4" />`);
        extras.push(`<line x1="${CX + 12}" y1="${CROTCH_Y + 15}" x2="${CX + 12}" y2="${hemY - 5}" stroke="hsl(var(--muted-foreground) / 0.15)" stroke-width="0.4" />`);
      }
      break;
    }
  }

  const mainPaths = garmentPaths
    .map(d => `<path d="${d}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" />`)
    .join("\n    ");

  // For light theme, inject CSS overrides so all hsl(var(--...)) refs resolve to dark sketch colors
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
