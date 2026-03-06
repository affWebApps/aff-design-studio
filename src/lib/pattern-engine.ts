/**
 * Pattern engine using @freesewing/core for parametric garment design.
 * Creates custom pattern parts (bodice, skirt, sleeve) with draggable control points.
 */
import { Design } from "@freesewing/core";

export interface Measurements {
  bust: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
  bodyLength: number;
  armLength: number;
  neckCircumference: number;
}

export const defaultMeasurements: Measurements = {
  bust: 920,
  waist: 740,
  hips: 980,
  shoulderWidth: 400,
  bodyLength: 420,
  armLength: 600,
  neckCircumference: 380,
};

export type PatternType = "bodice" | "skirt" | "sleeve";

export interface DesignOptions {
  patternType: PatternType;
  seamAllowance: number;
  ease: number;
  dartDepth: number;
}

export const defaultDesignOptions: DesignOptions = {
  patternType: "bodice",
  seamAllowance: 10,
  ease: 40,
  dartDepth: 80,
};

export interface ControlPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  mappedMeasurement?: keyof Measurements;
  mappedAxis?: "x" | "y";
}

export interface PatternResult {
  svg: string;
  controlPoints: ControlPoint[];
  viewBox: string;
}

/** Generate a bodice block pattern */
function generateBodice(m: Measurements, opts: DesignOptions): PatternResult {
  const bustHalf = (m.bust + opts.ease) / 2 / 10;
  const waistHalf = (m.waist + opts.ease) / 2 / 10;
  const shoulderHalf = m.shoulderWidth / 2 / 10;
  const bodyLen = m.bodyLength / 10;
  const neckW = m.neckCircumference / 6 / 10;
  const neckD = neckW * 0.6;
  const dartW = 3;
  const dartD = opts.dartDepth / 10;
  const sa = opts.seamAllowance / 10;

  // Key points
  const cfNeck = { x: 50, y: 50 };
  const shoulder = { x: cfNeck.x + shoulderHalf, y: cfNeck.y - 2 };
  const armhole = { x: cfNeck.x + bustHalf, y: cfNeck.y + bodyLen * 0.45 };
  const sideWaist = { x: cfNeck.x + waistHalf, y: cfNeck.y + bodyLen };
  const cfWaist = { x: cfNeck.x, y: cfNeck.y + bodyLen };
  const dartCenter = cfNeck.x + waistHalf / 2;

  const width = Math.max(bustHalf, waistHalf) + 60;
  const height = bodyLen + 60;

  const pathParts: string[] = [];

  // Main outline
  pathParts.push(
    `M ${cfNeck.x} ${cfNeck.y}`,
    `Q ${cfNeck.x + neckW} ${cfNeck.y - neckD} ${shoulder.x} ${shoulder.y}`,
    `L ${armhole.x} ${armhole.y}`,
    `Q ${armhole.x + 2} ${(armhole.y + sideWaist.y) / 2} ${sideWaist.x} ${sideWaist.y}`,
    // Dart
    `L ${dartCenter + dartW} ${sideWaist.y}`,
    `L ${dartCenter} ${sideWaist.y - dartD}`,
    `L ${dartCenter - dartW} ${sideWaist.y}`,
    `L ${cfWaist.x} ${cfWaist.y}`,
    `Z`
  );

  // Seam allowance outline
  const saPath = sa > 0
    ? `<path d="M ${cfNeck.x - sa} ${cfNeck.y - sa} L ${shoulder.x + sa} ${shoulder.y - sa} L ${armhole.x + sa} ${armhole.y} L ${sideWaist.x + sa} ${sideWaist.y + sa} L ${cfWaist.x - sa} ${cfWaist.y + sa} Z" stroke="hsl(0, 0%, 30%)" stroke-width="0.5" stroke-dasharray="3 3" fill="none" />`
    : "";

  // Grain line
  const grainLine = `<line x1="${cfNeck.x + bustHalf / 2}" y1="${cfNeck.y + 8}" x2="${cfNeck.x + bustHalf / 2}" y2="${cfWaist.y - 8}" stroke="hsl(0, 0%, 35%)" stroke-width="0.5" marker-end="url(#arrow)" marker-start="url(#arrow)" />`;

  const viewBox = `${cfNeck.x - 15} ${cfNeck.y - 15} ${width + 15} ${height + 15}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6" fill="hsl(0,0%,35%)" />
      </marker>
    </defs>
    ${saPath}
    <path d="${pathParts.join(" ")}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    ${grainLine}
    <text x="${cfNeck.x + bustHalf / 2}" y="${cfNeck.y - 5}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="4" font-family="Space Grotesk, sans-serif">Front Bodice</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "cf-neck", x: cfNeck.x, y: cfNeck.y, label: "CF Neck", mappedMeasurement: "neckCircumference", mappedAxis: "x" },
    { id: "shoulder", x: shoulder.x, y: shoulder.y, label: "Shoulder", mappedMeasurement: "shoulderWidth", mappedAxis: "x" },
    { id: "armhole", x: armhole.x, y: armhole.y, label: "Armhole", mappedMeasurement: "bust", mappedAxis: "x" },
    { id: "side-waist", x: sideWaist.x, y: sideWaist.y, label: "Side Waist", mappedMeasurement: "waist", mappedAxis: "x" },
    { id: "cf-waist", x: cfWaist.x, y: cfWaist.y, label: "CF Waist", mappedMeasurement: "bodyLength", mappedAxis: "y" },
    { id: "dart-tip", x: dartCenter, y: sideWaist.y - dartD, label: "Dart Tip" },
  ];

  return { svg, controlPoints, viewBox };
}

function generateSkirt(m: Measurements, opts: DesignOptions): PatternResult {
  const waistHalf = (m.waist + opts.ease) / 2 / 10;
  const hipHalf = (m.hips + opts.ease) / 2 / 10;
  const skirtLen = 60;
  const hipLine = 20;

  const ox = 50;
  const oy = 50;

  const path = [
    `M ${ox} ${oy}`,
    `L ${ox + waistHalf} ${oy}`,
    `L ${ox + hipHalf} ${oy + hipLine}`,
    `L ${ox + hipHalf} ${oy + skirtLen}`,
    `L ${ox} ${oy + skirtLen}`,
    `Z`,
  ].join(" ");

  const viewBox = `${ox - 10} ${oy - 10} ${hipHalf + 30} ${skirtLen + 30}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <path d="${path}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    <text x="${ox + hipHalf / 2}" y="${oy - 3}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="4" font-family="Space Grotesk, sans-serif">Skirt Panel</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "waist-side", x: ox + waistHalf, y: oy, label: "Waist", mappedMeasurement: "waist", mappedAxis: "x" },
    { id: "hip-side", x: ox + hipHalf, y: oy + hipLine, label: "Hip", mappedMeasurement: "hips", mappedAxis: "x" },
    { id: "hem", x: ox + hipHalf, y: oy + skirtLen, label: "Hem" },
  ];

  return { svg, controlPoints, viewBox };
}

function generateSleeve(m: Measurements, opts: DesignOptions): PatternResult {
  const armLen = m.armLength / 10;
  const bustQ = (m.bust + opts.ease) / 4 / 10;
  const capH = bustQ * 0.6;
  const wristW = bustQ * 0.5;

  const ox = 50;
  const oy = 50;

  const path = [
    `M ${ox} ${oy + capH}`,
    `Q ${ox + bustQ / 2} ${oy} ${ox + bustQ} ${oy + capH}`,
    `L ${ox + bustQ - (bustQ - wristW) / 2} ${oy + armLen}`,
    `L ${ox + (bustQ - wristW) / 2} ${oy + armLen}`,
    `Z`,
  ].join(" ");

  const viewBox = `${ox - 10} ${oy - 10} ${bustQ + 30} ${armLen + 20}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    <path d="${path}" stroke="hsl(43, 100%, 50%)" stroke-width="1.5" fill="hsl(43, 100%, 50%, 0.04)" />
    <text x="${ox + bustQ / 2}" y="${oy - 3}" text-anchor="middle" fill="hsl(0,0%,55%)" font-size="4" font-family="Space Grotesk, sans-serif">Sleeve</text>
  </svg>`;

  const controlPoints: ControlPoint[] = [
    { id: "cap-left", x: ox, y: oy + capH, label: "Cap L", mappedMeasurement: "bust", mappedAxis: "x" },
    { id: "cap-top", x: ox + bustQ / 2, y: oy, label: "Cap Top" },
    { id: "cap-right", x: ox + bustQ, y: oy + capH, label: "Cap R", mappedMeasurement: "bust", mappedAxis: "x" },
    { id: "wrist", x: ox + bustQ / 2, y: oy + armLen, label: "Wrist", mappedMeasurement: "armLength", mappedAxis: "y" },
  ];

  return { svg, controlPoints, viewBox };
}

export function generatePattern(
  measurements: Measurements,
  options: DesignOptions
): PatternResult {
  switch (options.patternType) {
    case "skirt":
      return generateSkirt(measurements, options);
    case "sleeve":
      return generateSleeve(measurements, options);
    case "bodice":
    default:
      return generateBodice(measurements, options);
  }
}

/** Convert drag delta on a control point back to a measurement change */
export function dragToMeasurement(
  point: ControlPoint,
  deltaX: number,
  deltaY: number,
  scaleFactor: number
): { measurement: keyof Measurements; delta: number } | null {
  if (!point.mappedMeasurement) return null;
  const axis = point.mappedAxis || "x";
  const rawDelta = axis === "x" ? deltaX : deltaY;
  // Convert SVG units back to mm (×10 for half-body, ×2 for full circumference)
  const mmDelta = rawDelta * scaleFactor * 10 * 2;
  return { measurement: point.mappedMeasurement, delta: Math.round(mmDelta) };
}
