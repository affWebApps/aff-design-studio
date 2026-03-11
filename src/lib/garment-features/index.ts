/**
 * Garment feature registry - barrel file.
 * Imports and registers all feature modules on first load.
 */
import { registerNecklines } from "./necklines";
import { registerSleeves } from "./sleeves";
import { registerCollars } from "./collars";
import { registerClosures } from "./closures";
import { registerDetails } from "./details";

export { getFeature, getFeaturesByCategory, getAllFeatures } from "./registry";
export { getSleevePathForSide } from "./sleeves";
export type { SilhouetteFeature, FeatureRenderContext, FeatureCategory } from "./types";
export * from "./landmarks";

let initialized = false;

export function initializeFeatures(): void {
  if (initialized) return;
  registerNecklines();
  registerSleeves();
  registerCollars();
  registerClosures();
  registerDetails();
  initialized = true;
}
