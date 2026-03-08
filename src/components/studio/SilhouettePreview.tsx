import { useMemo } from "react";
import { renderSilhouette } from "@/lib/silhouette-renderer";
import type { GarmentConfig } from "@/lib/garment-config";

interface SilhouettePreviewProps {
  garment: GarmentConfig;
}

export function SilhouettePreview({ garment }: SilhouettePreviewProps) {
  const svgHtml = useMemo(() => renderSilhouette(garment), [garment]);

  return (
    <div className="flex items-center justify-center w-full h-full p-6">
      <div
        className="w-full max-w-[280px] h-full max-h-[520px]"
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
    </div>
  );
}
