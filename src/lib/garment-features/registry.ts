/**
 * Central feature registry.
 * All garment features register here and are looked up by category + id.
 */
import type { SilhouetteFeature, FeatureCategory } from "./types";

const features = new Map<string, SilhouetteFeature>();

function key(category: FeatureCategory, id: string): string {
  return `${category}:${id}`;
}

export function registerFeature(feature: SilhouetteFeature): void {
  features.set(key(feature.category, feature.id), feature);
}

export function getFeature(category: FeatureCategory, id: string): SilhouetteFeature | undefined {
  return features.get(key(category, id));
}

export function getFeaturesByCategory(category: FeatureCategory): SilhouetteFeature[] {
  return Array.from(features.values()).filter(f => f.category === category);
}

export function getAllFeatures(): SilhouetteFeature[] {
  return Array.from(features.values());
}
