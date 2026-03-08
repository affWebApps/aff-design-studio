import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Scissors, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  GarmentCategory,
  GarmentConfig,
  TopConfig,
  DressConfig,
  SkirtConfig,
  PantsConfig,
  DetailType,
} from "@/lib/garment-config";
import { getDefaultConfig, optionLabels } from "@/lib/garment-config";

interface GarmentConfiguratorProps {
  garment: GarmentConfig;
  onChange: (garment: GarmentConfig) => void;
  onGeneratePattern: () => void;
}

const categories: { id: GarmentCategory; label: string; icon: string }[] = [
  { id: "top", label: "Top", icon: "👕" },
  { id: "dress", label: "Dress", icon: "👗" },
  { id: "skirt", label: "Skirt", icon: "🩳" },
  { id: "pants", label: "Pants", icon: "👖" },
];

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(options).map(([key, display]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
              value === key
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
            }`}
          >
            {display}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiOptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Record<string, string>;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((v) => v !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(options).map(([key, display]) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
              value.includes(key)
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
            }`}
          >
            {display}
          </button>
        ))}
      </div>
    </div>
  );
}

function TopOptions({
  config,
  onChange,
}: {
  config: TopConfig;
  onChange: (c: TopConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <OptionGroup label="Neckline" options={optionLabels.neckline} value={config.neckline} onChange={(v) => onChange({ ...config, neckline: v as any })} />
      <OptionGroup label="Sleeves" options={optionLabels.sleeve} value={config.sleeve} onChange={(v) => onChange({ ...config, sleeve: v as any })} />
      <OptionGroup label="Collar" options={optionLabels.collar} value={config.collar} onChange={(v) => onChange({ ...config, collar: v as any })} />
      <OptionGroup label="Fit" options={optionLabels.fit} value={config.fit} onChange={(v) => onChange({ ...config, fit: v as any })} />
      <OptionGroup label="Length" options={optionLabels.topLength} value={config.length} onChange={(v) => onChange({ ...config, length: v as any })} />
      <OptionGroup label="Closure" options={optionLabels.closure} value={config.closure} onChange={(v) => onChange({ ...config, closure: v as any })} />
      <MultiOptionGroup label="Details" options={optionLabels.details} value={config.details} onChange={(v) => onChange({ ...config, details: v as DetailType[] })} />
    </div>
  );
}

function DressOptions({
  config,
  onChange,
}: {
  config: DressConfig;
  onChange: (c: DressConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <OptionGroup label="Neckline" options={optionLabels.neckline} value={config.neckline} onChange={(v) => onChange({ ...config, neckline: v as any })} />
      <OptionGroup label="Sleeves" options={optionLabels.sleeve} value={config.sleeve} onChange={(v) => onChange({ ...config, sleeve: v as any })} />
      <OptionGroup label="Collar" options={optionLabels.collar} value={config.collar} onChange={(v) => onChange({ ...config, collar: v as any })} />
      <OptionGroup label="Fit" options={optionLabels.fit} value={config.fit} onChange={(v) => onChange({ ...config, fit: v as any })} />
      <OptionGroup label="Waistline" options={optionLabels.waistline} value={config.waistline} onChange={(v) => onChange({ ...config, waistline: v as any })} />
      <OptionGroup label="Skirt Shape" options={optionLabels.skirtSilhouette} value={config.skirtSilhouette} onChange={(v) => onChange({ ...config, skirtSilhouette: v as any })} />
      <OptionGroup label="Skirt Length" options={optionLabels.skirtLength} value={config.skirtLength} onChange={(v) => onChange({ ...config, skirtLength: v as any })} />
      <OptionGroup label="Closure" options={optionLabels.closure} value={config.closure} onChange={(v) => onChange({ ...config, closure: v as any })} />
      <MultiOptionGroup label="Details" options={optionLabels.details} value={config.details} onChange={(v) => onChange({ ...config, details: v as DetailType[] })} />
    </div>
  );
}

function SkirtOptions({
  config,
  onChange,
}: {
  config: SkirtConfig;
  onChange: (c: SkirtConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <OptionGroup label="Silhouette" options={optionLabels.skirtSilhouette} value={config.silhouette} onChange={(v) => onChange({ ...config, silhouette: v as any })} />
      <OptionGroup label="Length" options={optionLabels.skirtLength} value={config.length} onChange={(v) => onChange({ ...config, length: v as any })} />
      <OptionGroup label="Waistband" options={optionLabels.waistband} value={config.waistband} onChange={(v) => onChange({ ...config, waistband: v as any })} />
      <MultiOptionGroup label="Details" options={optionLabels.details} value={config.details} onChange={(v) => onChange({ ...config, details: v as DetailType[] })} />
    </div>
  );
}

function PantsOptions({
  config,
  onChange,
}: {
  config: PantsConfig;
  onChange: (c: PantsConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <OptionGroup label="Style" options={optionLabels.pantsStyle} value={config.style} onChange={(v) => onChange({ ...config, style: v as any })} />
      <OptionGroup label="Length" options={optionLabels.pantsLength} value={config.length} onChange={(v) => onChange({ ...config, length: v as any })} />
      <OptionGroup label="Waistband" options={optionLabels.waistband} value={config.waistband} onChange={(v) => onChange({ ...config, waistband: v as any })} />
      <OptionGroup label="Pockets" options={optionLabels.pockets} value={config.pockets} onChange={(v) => onChange({ ...config, pockets: v as any })} />
      <MultiOptionGroup label="Details" options={optionLabels.details} value={config.details} onChange={(v) => onChange({ ...config, details: v as DetailType[] })} />
    </div>
  );
}

export function GarmentConfigurator({
  garment,
  onChange,
  onGeneratePattern,
}: GarmentConfiguratorProps) {
  const handleCategoryChange = (cat: GarmentCategory) => {
    if (cat !== garment.category) {
      onChange(getDefaultConfig(cat));
    }
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Scissors className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">Design</span>
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
              garment.category === cat.id
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <span className="block text-base leading-none mb-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={garment.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              {garment.category === "top" && (
                <TopOptions
                  config={garment.config}
                  onChange={(c) => onChange({ category: "top", config: c })}
                />
              )}
              {garment.category === "dress" && (
                <DressOptions
                  config={garment.config}
                  onChange={(c) => onChange({ category: "dress", config: c })}
                />
              )}
              {garment.category === "skirt" && (
                <SkirtOptions
                  config={garment.config}
                  onChange={(c) => onChange({ category: "skirt", config: c })}
                />
              )}
              {garment.category === "pants" && (
                <PantsOptions
                  config={garment.config}
                  onChange={(c) => onChange({ category: "pants", config: c })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Generate button */}
      <div className="border-t border-border p-4">
        <Button
          onClick={onGeneratePattern}
          className="w-full gap-2 font-display font-semibold"
        >
          Generate Pattern Draft
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
