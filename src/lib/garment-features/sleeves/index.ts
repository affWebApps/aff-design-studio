import { registerFeature } from "../registry";
import type { SilhouetteFeature, FeatureRenderContext } from "../types";
import { CX, SHOULDER_W, SHOULDER_Y, ARM_PIT_Y, BUST_Y, ELBOW_Y, WAIST_Y, HIP_Y, WRIST_Y, fitExpand } from "../landmarks";

function sleeveBase(type: string, side: "left" | "right", fit: string): string {
  const fw = fitExpand(fit);
  const dir = side === "left" ? -1 : 1;
  const sx = CX + dir * (SHOULDER_W + fw);
  const sy = SHOULDER_Y;
  const armOff = dir * 8;
  const elbowX = sx + dir * 6 + armOff;
  const wristX = sx + dir * 4 + armOff;
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
      const endY = ELBOW_Y + 25;
      const outerX = elbowX + dir * (sleeveW / 2);
      const innerX = elbowX - dir * (sleeveW / 2 - 4);
      return `M ${sx} ${sy} C ${sx + dir * 16} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${outerX + dir * 4} ${ARM_PIT_Y + 10} C ${outerX + dir * 2} ${ELBOW_Y - 10} ${outerX} ${endY - 15} ${outerX} ${endY} L ${innerX} ${endY} C ${innerX} ${endY - 15} ${sx - dir * 2} ${ARM_PIT_Y + 15} ${sx} ${ARM_PIT_Y}`;
    }
    case "long": {
      const endY = WRIST_Y + 5;
      const outerElbowX = elbowX + dir * (sleeveW / 2);
      const outerWristX = wristX + dir * (sleeveW / 2 - 2);
      const innerWristX = wristX - dir * (sleeveW / 2 - 5);
      return `M ${sx} ${sy} C ${sx + dir * 16} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${outerElbowX + dir * 2} ${ARM_PIT_Y + 10} C ${outerElbowX} ${ELBOW_Y - 10} ${outerWristX + dir * 2} ${endY - 40} ${outerWristX} ${endY} L ${innerWristX} ${endY} C ${innerWristX} ${endY - 30} ${elbowX - dir * (sleeveW / 2 - 5)} ${ELBOW_Y - 10} ${sx} ${ARM_PIT_Y}`;
    }
    case "bell": {
      const endY = WRIST_Y + 8;
      const bellFlare = 28;
      const outerElbowX = elbowX + dir * (sleeveW / 2);
      const outerWristX = wristX + dir * bellFlare;
      const innerWristX = wristX - dir * (bellFlare - 10);
      return `M ${sx} ${sy} C ${sx + dir * 16} ${sy - 6} ${sx + dir * 22} ${sy + 10} ${outerElbowX + dir * 2} ${ARM_PIT_Y + 10} C ${outerElbowX} ${ELBOW_Y - 10} ${outerWristX - dir * 8} ${endY - 40} ${outerWristX} ${endY} Q ${wristX + dir * 6} ${endY + 6} ${innerWristX} ${endY} C ${innerWristX + dir * 4} ${endY - 30} ${elbowX - dir * 4} ${ELBOW_Y - 5} ${sx} ${ARM_PIT_Y}`;
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

function makeSleeve(id: string, label: string): SilhouetteFeature {
  return {
    id,
    category: "sleeve",
    label,
    renderPath({ fit }) {
      // Sleeves are rendered per-side, so this returns left side.
      // The renderer calls getSleevePathForSide() directly.
      return sleeveBase(id, "left", fit);
    },
  };
}

/** Get sleeve path for a specific side - used by the renderer */
export function getSleevePathForSide(type: string, side: "left" | "right", fit: string): string {
  if (type === "sleeveless") return "";
  return sleeveBase(type, side, fit);
}

const sleeves: SilhouetteFeature[] = [
  { id: "sleeveless", category: "sleeve", label: "Sleeveless" },
  makeSleeve("cap", "Cap"),
  makeSleeve("short", "Short"),
  makeSleeve("three-quarter", "¾ Length"),
  makeSleeve("long", "Long"),
  makeSleeve("bell", "Bell"),
  makeSleeve("puff", "Puff"),
];

export function registerSleeves(): void {
  sleeves.forEach(registerFeature);
}
