/**
 * Standard interfaces for garment feature modules.
 * Every neckline, sleeve, collar, closure, and detail implements these.
 */
import type { SketchView } from "../silhouette-renderer";

export interface FeatureRenderContext {
  fit: string;
  view: SketchView;
  hemY?: number;
  hemW?: number;
}

/** A silhouette feature that contributes SVG path data or decorative elements */
export interface SilhouetteFeature {
  id: string;
  category: FeatureCategory;
  label: string;
  /** Returns SVG path `d` attribute string (for garment outline paths) */
  renderPath?: (ctx: FeatureRenderContext) => string;
  /** Returns raw SVG elements (for decorative overlays like collars, buttons) */
  renderDecoration?: (ctx: FeatureRenderContext) => string;
  /** Which garment categories can use this feature */
  applicableTo?: string[];
}

export type FeatureCategory = "neckline" | "sleeve" | "collar" | "closure" | "detail";
