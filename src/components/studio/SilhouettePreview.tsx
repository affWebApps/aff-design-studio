import { useMemo } from "react";
import { renderSilhouette, type SketchTheme } from "@/lib/silhouette-renderer";
import type { GarmentConfig } from "@/lib/garment-config";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface SilhouettePreviewProps {
  garment: GarmentConfig;
  sketchTheme: SketchTheme;
  onToggleTheme: () => void;
}

export function SilhouettePreview({ garment, sketchTheme, onToggleTheme }: SilhouettePreviewProps) {
  const svgHtml = useMemo(() => renderSilhouette(garment, sketchTheme), [garment, sketchTheme]);

  return (
    <div className="relative flex items-center justify-center w-full h-full p-6">
      <div
        className="w-full max-w-[280px] h-full max-h-[560px]"
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
      {/* Theme toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-3 right-3 h-8 w-8"
        onClick={onToggleTheme}
        title={sketchTheme === "dark" ? "Switch to light sketch" : "Switch to dark sketch"}
      >
        {sketchTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
