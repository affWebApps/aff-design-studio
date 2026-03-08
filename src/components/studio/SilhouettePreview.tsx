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
  const frontSvg = useMemo(() => renderSilhouette(garment, sketchTheme, "front"), [garment, sketchTheme]);
  const backSvg = useMemo(() => renderSilhouette(garment, sketchTheme, "back"), [garment, sketchTheme]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full p-4">
      <div className="flex items-center justify-center gap-2 w-full h-full">
        {/* Front view */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div
            className="w-full max-w-[220px] h-full max-h-[500px]"
            dangerouslySetInnerHTML={{ __html: frontSvg }}
          />
          <span className="mt-1 text-xs font-medium text-muted-foreground tracking-wide uppercase">Front</span>
        </div>

        {/* Back view */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div
            className="w-full max-w-[220px] h-full max-h-[500px]"
            dangerouslySetInnerHTML={{ __html: backSvg }}
          />
          <span className="mt-1 text-xs font-medium text-muted-foreground tracking-wide uppercase">Back</span>
        </div>
      </div>

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
