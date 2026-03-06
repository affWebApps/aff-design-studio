import { Ruler } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Measurements, PatternType, DesignOptions } from "@/lib/pattern-engine";

interface MeasurementsPanelProps {
  measurements: Measurements;
  options: DesignOptions;
  onMeasurementChange: (key: keyof Measurements, value: number) => void;
  onOptionChange: <K extends keyof DesignOptions>(key: K, value: DesignOptions[K]) => void;
}

const measurementLabels: Record<keyof Measurements, string> = {
  bust: "Bust",
  waist: "Waist",
  hips: "Hips",
  shoulderWidth: "Shoulder Width",
  bodyLength: "Body Length",
  armLength: "Arm Length",
  neckCircumference: "Neck",
};

const measurementRanges: Record<keyof Measurements, [number, number]> = {
  bust: [700, 1400],
  waist: [550, 1200],
  hips: [750, 1400],
  shoulderWidth: [300, 550],
  bodyLength: [300, 550],
  armLength: [400, 750],
  neckCircumference: [300, 500],
};

export function MeasurementsPanel({
  measurements,
  options,
  onMeasurementChange,
  onOptionChange,
}: MeasurementsPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Ruler className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">Pattern</span>
      </div>

      {/* Pattern type */}
      <div className="p-4 space-y-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Pattern Type</Label>
        <Select
          value={options.patternType}
          onValueChange={(v) => onOptionChange("patternType", v as PatternType)}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bodice">Bodice Block</SelectItem>
            <SelectItem value="skirt">Skirt Panel</SelectItem>
            <SelectItem value="sleeve">Sleeve</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Measurements */}
      <div className="p-4 space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Measurements (mm)</Label>
        {(Object.keys(measurementLabels) as Array<keyof Measurements>).map((key) => {
          const [min, max] = measurementRanges[key];
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-foreground">{measurementLabels[key]}</label>
                <Input
                  type="number"
                  value={measurements[key]}
                  onChange={(e) => onMeasurementChange(key, Number(e.target.value))}
                  className="h-7 w-20 text-xs text-right bg-secondary border-border"
                />
              </div>
              <Slider
                value={[measurements[key]]}
                min={min}
                max={max}
                step={5}
                onValueChange={([v]) => onMeasurementChange(key, v)}
                className="py-0"
              />
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Design options */}
      <div className="p-4 space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Options</Label>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Seam Allowance</label>
            <span className="text-xs text-muted-foreground">{options.seamAllowance}mm</span>
          </div>
          <Slider
            value={[options.seamAllowance]}
            min={0}
            max={25}
            step={1}
            onValueChange={([v]) => onOptionChange("seamAllowance", v)}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Ease</label>
            <span className="text-xs text-muted-foreground">{options.ease}mm</span>
          </div>
          <Slider
            value={[options.ease]}
            min={0}
            max={100}
            step={5}
            onValueChange={([v]) => onOptionChange("ease", v)}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Dart Depth</label>
            <span className="text-xs text-muted-foreground">{options.dartDepth}mm</span>
          </div>
          <Slider
            value={[options.dartDepth]}
            min={30}
            max={150}
            step={5}
            onValueChange={([v]) => onOptionChange("dartDepth", v)}
          />
        </div>
      </div>
    </div>
  );
}
