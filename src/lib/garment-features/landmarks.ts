/**
 * Shared anatomical landmarks for the 9-head fashion croquis.
 * All feature modules reference these constants for consistent positioning.
 */

export const W = 260;
export const H = 600;
export const CX = W / 2;

// Vertical landmarks
export const HEAD_TOP = 20;
export const HEAD_H = 52;
export const CHIN = HEAD_TOP + HEAD_H;
export const NECK_BASE = CHIN + 12;
export const SHOULDER_Y = NECK_BASE + 8;
export const BUST_Y = SHOULDER_Y + 52;
export const WAIST_Y = BUST_Y + 52;
export const HIP_Y = WAIST_Y + 38;
export const CROTCH_Y = HIP_Y + 32;
export const KNEE_Y = CROTCH_Y + 80;
export const ANKLE_Y = KNEE_Y + 90;
export const FOOT_Y = ANKLE_Y + 16;

// Horizontal half-widths
export const SHOULDER_W = 42;
export const NECK_W = 10;
export const BUST_W = 38;
export const WAIST_W = 28;
export const HIP_W = 40;
export const KNEE_W = 14;
export const ANKLE_W = 10;

// Arm landmarks
export const ARM_PIT_Y = BUST_Y - 8;
export const ELBOW_Y = WAIST_Y + 15;
export const WRIST_Y = HIP_Y + 20;
export const HAND_Y = WRIST_Y + 22;

/** Fit-based width expansion */
export function fitExpand(fit: string): number {
  switch (fit) {
    case "loose": return 10;
    case "fitted": return -3;
    default: return 2;
  }
}
