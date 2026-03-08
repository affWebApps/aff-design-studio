/**
 * Garment configuration system.
 * Defines all garment categories, component options, and configuration interfaces.
 */

export type GarmentCategory = "top" | "dress" | "skirt" | "pants";

export type NecklineType = "round" | "v-neck" | "boat" | "square" | "sweetheart" | "mandarin";
export type SleeveType = "sleeveless" | "cap" | "short" | "three-quarter" | "long" | "bell" | "puff";
export type CollarType = "none" | "peter-pan" | "mandarin" | "shirt" | "sailor";
export type FitType = "loose" | "regular" | "fitted";
export type TopLength = "crop" | "waist" | "hip" | "tunic";
export type ClosureType = "none" | "front-buttons" | "back-zip" | "side-zip" | "wrap";

export type SkirtSilhouette = "a-line" | "straight" | "flared" | "circle" | "pencil" | "gathered";
export type SkirtLength = "mini" | "knee" | "midi" | "maxi";
export type WaistbandType = "fitted" | "elastic" | "yoke";

export type PantsStyle = "straight" | "slim" | "wide" | "tapered" | "flared";
export type PantsLength = "shorts" | "bermuda" | "cropped" | "full";
export type PocketType = "none" | "side-seam" | "patch" | "welt";

export type DressWaistline = "natural" | "empire" | "drop";

export type DetailType = "lace-trim" | "ruffle" | "pintucks" | "piping" | "embroidery-border";

export interface TopConfig {
  neckline: NecklineType;
  sleeve: SleeveType;
  collar: CollarType;
  fit: FitType;
  length: TopLength;
  closure: ClosureType;
  details: DetailType[];
}

export interface DressConfig {
  neckline: NecklineType;
  sleeve: SleeveType;
  collar: CollarType;
  fit: FitType;
  waistline: DressWaistline;
  skirtSilhouette: SkirtSilhouette;
  skirtLength: SkirtLength;
  closure: ClosureType;
  details: DetailType[];
}

export interface SkirtConfig {
  silhouette: SkirtSilhouette;
  length: SkirtLength;
  waistband: WaistbandType;
  details: DetailType[];
}

export interface PantsConfig {
  style: PantsStyle;
  length: PantsLength;
  waistband: WaistbandType;
  pockets: PocketType;
  details: DetailType[];
}

export type GarmentConfig =
  | { category: "top"; config: TopConfig }
  | { category: "dress"; config: DressConfig }
  | { category: "skirt"; config: SkirtConfig }
  | { category: "pants"; config: PantsConfig };

export const defaultTopConfig: TopConfig = {
  neckline: "round",
  sleeve: "short",
  collar: "none",
  fit: "regular",
  length: "hip",
  closure: "none",
  details: [],
};

export const defaultDressConfig: DressConfig = {
  neckline: "round",
  sleeve: "short",
  collar: "none",
  fit: "fitted",
  waistline: "natural",
  skirtSilhouette: "a-line",
  skirtLength: "knee",
  closure: "back-zip",
  details: [],
};

export const defaultSkirtConfig: SkirtConfig = {
  silhouette: "a-line",
  length: "knee",
  waistband: "fitted",
  details: [],
};

export const defaultPantsConfig: PantsConfig = {
  style: "straight",
  length: "full",
  waistband: "fitted",
  pockets: "side-seam",
  details: [],
};

export function getDefaultConfig(category: GarmentCategory): GarmentConfig {
  switch (category) {
    case "top": return { category: "top", config: { ...defaultTopConfig } };
    case "dress": return { category: "dress", config: { ...defaultDressConfig } };
    case "skirt": return { category: "skirt", config: { ...defaultSkirtConfig } };
    case "pants": return { category: "pants", config: { ...defaultPantsConfig } };
  }
}

/** Human-readable labels for each option */
export const optionLabels: Record<string, Record<string, string>> = {
  neckline: {
    round: "Round", "v-neck": "V-Neck", boat: "Boat", square: "Square",
    sweetheart: "Sweetheart", mandarin: "Mandarin",
  },
  sleeve: {
    sleeveless: "Sleeveless", cap: "Cap", short: "Short",
    "three-quarter": "¾ Length", long: "Long", bell: "Bell", puff: "Puff",
  },
  collar: {
    none: "None", "peter-pan": "Peter Pan", mandarin: "Mandarin",
    shirt: "Shirt Collar", sailor: "Sailor",
  },
  fit: { loose: "Loose", regular: "Regular", fitted: "Fitted" },
  topLength: { crop: "Crop", waist: "Waist", hip: "Hip", tunic: "Tunic" },
  closure: {
    none: "None", "front-buttons": "Front Buttons", "back-zip": "Back Zip",
    "side-zip": "Side Zip", wrap: "Wrap",
  },
  skirtSilhouette: {
    "a-line": "A-Line", straight: "Straight", flared: "Flared",
    circle: "Circle", pencil: "Pencil", gathered: "Gathered",
  },
  skirtLength: { mini: "Mini", knee: "Knee", midi: "Midi", maxi: "Maxi" },
  waistband: { fitted: "Fitted", elastic: "Elastic", yoke: "Yoke" },
  waistline: { natural: "Natural", empire: "Empire", drop: "Drop" },
  pantsStyle: {
    straight: "Straight", slim: "Slim", wide: "Wide Leg",
    tapered: "Tapered", flared: "Flared",
  },
  pantsLength: { shorts: "Shorts", bermuda: "Bermuda", cropped: "Cropped", full: "Full Length" },
  pockets: { none: "None", "side-seam": "Side Seam", patch: "Patch", welt: "Welt" },
  details: {
    "lace-trim": "Lace Trim", ruffle: "Ruffle", pintucks: "Pintucks",
    piping: "Piping", "embroidery-border": "Embroidery Border",
  },
};
