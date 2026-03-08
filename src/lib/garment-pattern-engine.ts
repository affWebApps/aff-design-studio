/**
 * Pattern draft generator from garment configurations.
 * Creates technical pattern pieces based on garment config + body measurements.
 */
import type { GarmentConfig, SkirtSilhouette, SleeveType, NecklineType, FitType, PantsStyle } from "./garment-config";
import type { Measurements, ControlPoint, PatternResult } from "./pattern-engine";

const SA = 10; // default seam allowance in mm

function easeForFit(fit: FitType): number {
  switch (fit) {
    case "fitted": return 20;
    case "loose": return 80;
    default: return 40;
  }
}

function generateTopPattern(garment: Extract<GarmentConfig, { category: "top" }>, m: Measurements): PatternResult {
  const c = garment.config;
  const ease = easeForFit(c.fit);
  const bustHalf = (m.bust + ease) / 2 / 10;
  const waistHalf = (m.waist + ease) / 2 / 10;
  const shoulderHalf = m.shoulderWidth / 2 / 10;
  const bodyLen = m.bodyLength / 10;
  const neckW = m.neckCircumference / 6 / 10;

  // Neckline depth varies
  let neckD = neckW * 0.6;
  if (c.neckline === "v-neck") neckD = neckW * 1.8;
  else if (c.neckline === "boat") neckD = neckW * 0.2;
  else if (c.neckline === "square") neckD = neckW * 1.0;
  else if (c.neckline === "sweetheart") neckD = neckW * 1.4;

  // Length factor
  let lenFactor = 1.0;
  if (c.length === "crop") lenFactor = 0.6;
  else if (c.length === "waist") lenFactor = 0.75;
  else if (c.length === "tunic") lenFactor = 1.4;

  const actualLen = bodyLen * lenFactor;
  const ox = 30, oy = 30;

  const cfNeck = { x: ox, y: oy };
  const shoulder = { x: ox + shoulderHalf, y: oy - 2 };
  const armhole = { x: ox + bustHalf, y: oy + actualLen * 0.45 };
  const sideHem = { x: ox + waistHalf + (c.fit === "loose" ? 5 : 0), y: oy + actualLen };
  const cfHem = { x: ox, y: oy + actualLen };

  const neckPath = c.neckline === "v-neck"
    ? `M ${cfNeck.x} ${cfNeck.y} L ${cfNeck.x} ${cfNeck.y + neckD} M ${cfNeck.x} ${cfNeck.y} Q ${cfNeck.x + neckW} ${cfNeck.y - neckD * 0.3} ${shoulder.x} ${shoulder.y}`
    : `M ${cfNeck.x} ${cfNeck.y} Q ${cfNeck.x + neckW} ${cfNeck.y - neckD} ${shoulder.x} ${shoulder.y}`;

  const mainPath = [
    neckPath,
    `L ${armhole.x} ${armhole.y}`,
    `Q ${armhole.x + 1} ${(armhole.y + sideHem.y) / 2} ${sideHem.x} ${sideHem.y}`,
    `L ${cfHem.x} ${cfHem.y}`,
    `Z`,
  ].join(" ");

  // Sleeve piece (separate)
  let sleeveSvg = "";
  if (c.sleeve !== "sleeveless") {
    const sleeveLen = getSleeveLength(c.sleeve, m.armLength);
    const capH = bustHalf * 0.25;
    const slW = bustHalf * 0.45;
    const sox = ox + bustHalf + 25;
    const soy = oy + 5;

    sleeveSvg = `<path d="M ${sox} ${soy + capH} Q ${sox + slW / 2} ${soy} ${sox + slW} ${soy + capH} L ${sox + slW - 3} ${soy + sleeveLen} L ${sox + 3} ${soy + sleeveLen} Z" stroke="hsl(43, 100%, 50%)" stroke-width="1.2" fill="hsl(43, 100%, 50%, 0.04)" />`;
    sleeveSvg += `<text x="${sox + slW / 2}" y="${soy - 3}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="3.5" font-family="Space Grotesk, sans-serif">Sleeve</text>`;
  }

  const width = bustHalf + (c.sleeve !== "sleeveless" ? bustHalf * 0.5 + 30 : 0) + 40;
  const height = actualLen + 30;
  const viewBox = `${ox - 10} ${oy - 15} ${width + 20} ${height + 20}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <path d="${mainPath}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    ${sleeveSvg}
    <text x="${ox + bustHalf / 2}" y="${oy - 7}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="3.5" font-family="Space Grotesk, sans-serif">Front Bodice</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "cf-neck", x: cfNeck.x, y: cfNeck.y, label: "CF Neck", mappedMeasurement: "neckCircumference", mappedAxis: "x" },
    { id: "shoulder", x: shoulder.x, y: shoulder.y, label: "Shoulder", mappedMeasurement: "shoulderWidth", mappedAxis: "x" },
    { id: "armhole", x: armhole.x, y: armhole.y, label: "Bust", mappedMeasurement: "bust", mappedAxis: "x" },
    { id: "side-hem", x: sideHem.x, y: sideHem.y, label: "Waist", mappedMeasurement: "waist", mappedAxis: "x" },
    { id: "cf-hem", x: cfHem.x, y: cfHem.y, label: "Length", mappedMeasurement: "bodyLength", mappedAxis: "y" },
  ];

  return { svg, controlPoints, viewBox };
}

function getSleeveLength(type: SleeveType, armLength: number): number {
  const full = armLength / 10;
  switch (type) {
    case "cap": return full * 0.15;
    case "short": return full * 0.35;
    case "three-quarter": return full * 0.7;
    case "bell": return full * 0.85;
    case "puff": return full * 0.3;
    case "long": default: return full;
  }
}

function generateDressPattern(garment: Extract<GarmentConfig, { category: "dress" }>, m: Measurements): PatternResult {
  const c = garment.config;
  const ease = easeForFit(c.fit);
  const bustHalf = (m.bust + ease) / 2 / 10;
  const waistHalf = (m.waist + ease) / 2 / 10;
  const hipHalf = (m.hips + ease) / 2 / 10;
  const shoulderHalf = m.shoulderWidth / 2 / 10;
  const bodyLen = m.bodyLength / 10;
  const neckW = m.neckCircumference / 6 / 10;

  const skirtLen = getSkirtLenCm(c.skirtLength);
  const flare = getSkirtFlare(c.skirtSilhouette);

  const ox = 30, oy = 30;
  const totalLen = bodyLen + skirtLen;

  const cfNeck = { x: ox, y: oy };
  const shoulder = { x: ox + shoulderHalf, y: oy - 2 };
  const armhole = { x: ox + bustHalf, y: oy + bodyLen * 0.45 };
  const sideWaist = { x: ox + waistHalf, y: oy + bodyLen };
  const sideHip = { x: ox + hipHalf, y: oy + bodyLen + 20 };
  const sideHem = { x: ox + hipHalf + flare, y: oy + totalLen };
  const cfHem = { x: ox, y: oy + totalLen };

  const mainPath = [
    `M ${cfNeck.x} ${cfNeck.y}`,
    `Q ${cfNeck.x + neckW} ${cfNeck.y - neckW * 0.6} ${shoulder.x} ${shoulder.y}`,
    `L ${armhole.x} ${armhole.y}`,
    `Q ${armhole.x + 1} ${(armhole.y + sideWaist.y) / 2} ${sideWaist.x} ${sideWaist.y}`,
    `L ${sideHip.x} ${sideHip.y}`,
    `L ${sideHem.x} ${sideHem.y}`,
    `L ${cfHem.x} ${cfHem.y}`,
    `Z`,
  ].join(" ");

  // Waistline marker
  const waistLine = `<line x1="${ox}" y1="${oy + bodyLen}" x2="${ox + waistHalf}" y2="${oy + bodyLen}" stroke="hsl(0,0%,40%)" stroke-width="0.5" stroke-dasharray="2 2" />`;

  const width = Math.max(bustHalf, hipHalf + flare) + 40;
  const height = totalLen + 30;
  const viewBox = `${ox - 10} ${oy - 15} ${width + 20} ${height + 20}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <path d="${mainPath}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    ${waistLine}
    <text x="${ox + bustHalf / 2}" y="${oy - 7}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="3.5" font-family="Space Grotesk, sans-serif">Front Dress</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "shoulder", x: shoulder.x, y: shoulder.y, label: "Shoulder", mappedMeasurement: "shoulderWidth", mappedAxis: "x" },
    { id: "bust", x: armhole.x, y: armhole.y, label: "Bust", mappedMeasurement: "bust", mappedAxis: "x" },
    { id: "waist", x: sideWaist.x, y: sideWaist.y, label: "Waist", mappedMeasurement: "waist", mappedAxis: "x" },
    { id: "hip", x: sideHip.x, y: sideHip.y, label: "Hip", mappedMeasurement: "hips", mappedAxis: "x" },
    { id: "hem", x: sideHem.x, y: sideHem.y, label: "Hem" },
  ];

  return { svg, controlPoints, viewBox };
}

function getSkirtLenCm(length: string): number {
  switch (length) {
    case "mini": return 35;
    case "knee": return 55;
    case "midi": return 75;
    case "maxi": return 100;
    default: return 55;
  }
}

function getSkirtFlare(silhouette: SkirtSilhouette): number {
  switch (silhouette) {
    case "a-line": return 5;
    case "flared": return 12;
    case "circle": return 20;
    case "gathered": return 10;
    case "pencil": return -3;
    case "straight": default: return 0;
  }
}

function generateSkirtPattern(garment: Extract<GarmentConfig, { category: "skirt" }>, m: Measurements): PatternResult {
  const c = garment.config;
  const waistHalf = (m.waist + 30) / 2 / 10;
  const hipHalf = (m.hips + 30) / 2 / 10;
  const skirtLen = getSkirtLenCm(c.length);
  const flare = getSkirtFlare(c.silhouette);
  const hipLine = 20;

  const ox = 30, oy = 30;

  const path = [
    `M ${ox} ${oy}`,
    `L ${ox + waistHalf} ${oy}`,
    `L ${ox + hipHalf} ${oy + hipLine}`,
    `L ${ox + hipHalf + flare} ${oy + skirtLen}`,
    `L ${ox} ${oy + skirtLen}`,
    `Z`,
  ].join(" ");

  const viewBox = `${ox - 10} ${oy - 10} ${hipHalf + flare + 30} ${skirtLen + 25}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <path d="${path}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    <text x="${ox + hipHalf / 2}" y="${oy - 4}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="3.5" font-family="Space Grotesk, sans-serif">Skirt Panel</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "waist-side", x: ox + waistHalf, y: oy, label: "Waist", mappedMeasurement: "waist", mappedAxis: "x" },
    { id: "hip-side", x: ox + hipHalf, y: oy + hipLine, label: "Hip", mappedMeasurement: "hips", mappedAxis: "x" },
    { id: "hem", x: ox + hipHalf + flare, y: oy + skirtLen, label: "Hem" },
  ];

  return { svg, controlPoints, viewBox };
}

function generatePantsPattern(garment: Extract<GarmentConfig, { category: "pants" }>, m: Measurements): PatternResult {
  const c = garment.config;
  const waistHalf = (m.waist + 30) / 2 / 10;
  const hipHalf = (m.hips + 30) / 2 / 10;
  const crotchDepth = hipHalf * 0.7;

  let legLen: number;
  switch (c.length) {
    case "shorts": legLen = 25; break;
    case "bermuda": legLen = 40; break;
    case "cropped": legLen = 65; break;
    default: legLen = 85; break;
  }

  let legW: number;
  switch (c.style) {
    case "slim": legW = waistHalf * 0.4; break;
    case "wide": legW = hipHalf * 0.7; break;
    case "tapered": legW = waistHalf * 0.35; break;
    case "flared": legW = hipHalf * 0.65; break;
    default: legW = waistHalf * 0.5; break;
  }

  const ox = 30, oy = 30;
  const totalH = crotchDepth + legLen;

  // Front panel (one leg)
  const path = [
    `M ${ox} ${oy}`,
    `L ${ox + waistHalf} ${oy}`,
    `L ${ox + hipHalf} ${oy + 15}`,
    `L ${ox + hipHalf + 3} ${oy + crotchDepth}`,
    `L ${ox + legW + 5} ${oy + totalH}`,
    `L ${ox + 2} ${oy + totalH}`,
    `L ${ox} ${oy + crotchDepth}`,
    `Z`,
  ].join(" ");

  const viewBox = `${ox - 10} ${oy - 10} ${hipHalf + 30} ${totalH + 25}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <path d="${path}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    <text x="${ox + hipHalf / 2}" y="${oy - 4}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="3.5" font-family="Space Grotesk, sans-serif">Front Leg Panel</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "waist", x: ox + waistHalf, y: oy, label: "Waist", mappedMeasurement: "waist", mappedAxis: "x" },
    { id: "hip", x: ox + hipHalf, y: oy + 15, label: "Hip", mappedMeasurement: "hips", mappedAxis: "x" },
    { id: "hem", x: ox + legW + 5, y: oy + totalH, label: "Hem" },
  ];

  return { svg, controlPoints, viewBox };
}

export function generatePatternFromConfig(
  garment: GarmentConfig,
  measurements: Measurements
): PatternResult {
  switch (garment.category) {
    case "top": return generateTopPattern(garment, measurements);
    case "dress": return generateDressPattern(garment, measurements);
    case "skirt": return generateSkirtPattern(garment, measurements);
    case "pants": return generatePantsPattern(garment, measurements);
  }
}
