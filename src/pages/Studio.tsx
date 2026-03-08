import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GarmentConfigurator } from "@/components/studio/GarmentConfigurator";
import { SilhouettePreview } from "@/components/studio/SilhouettePreview";
import { MeasurementsPanel } from "@/components/studio/MeasurementsPanel";
import { PatternCanvas } from "@/components/studio/PatternCanvas";
import { Toolbar } from "@/components/studio/Toolbar";
import { getDefaultConfig, type GarmentConfig } from "@/lib/garment-config";
import { generatePatternFromConfig } from "@/lib/garment-pattern-engine";
import {
  defaultMeasurements,
  defaultDesignOptions,
  type Measurements,
  type DesignOptions,
} from "@/lib/pattern-engine";
import { exportSVG, exportPDF, exportDXF } from "@/lib/export-utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { SketchTheme } from "@/lib/silhouette-renderer";

type StudioMode = "configure" | "pattern";

interface HistoryEntry {
  measurements: Measurements;
}

export default function Studio() {
  const [mode, setMode] = useState<StudioMode>("configure");
  const [garment, setGarment] = useState<GarmentConfig>(getDefaultConfig("top"));
  const [sketchTheme, setSketchTheme] = useState<SketchTheme>("dark");
  const [measurements, setMeasurements] = useState<Measurements>({ ...defaultMeasurements });
  const [options] = useState<DesignOptions>({ ...defaultDesignOptions });
  const [zoom, setZoom] = useState(1);

  // Undo/redo for pattern mode
  const [history, setHistory] = useState<HistoryEntry[]>([{ measurements: { ...defaultMeasurements } }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback(
    (m: Measurements) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, { measurements: { ...m } }];
      });
      setHistoryIndex((i) => i + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    setMeasurements({ ...prev.measurements });
    setHistoryIndex((i) => i - 1);
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setMeasurements({ ...next.measurements });
    setHistoryIndex((i) => i + 1);
  }, [historyIndex, history]);

  const handleMeasurementChange = useCallback(
    (key: keyof Measurements, value: number) => {
      setMeasurements((prev) => {
        const next = { ...prev, [key]: value };
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  const handleMeasurementDelta = useCallback(
    (measurement: keyof Measurements, delta: number) => {
      setMeasurements((prev) => ({
        ...prev,
        [measurement]: Math.max(100, prev[measurement] + delta),
      }));
    },
    []
  );

  const handleOptionChange = useCallback(
    <K extends keyof DesignOptions>(key: K, value: DesignOptions[K]) => {
      // Options are handled through garment config now, keep for MeasurementsPanel compat
    },
    []
  );

  const pattern = useMemo(
    () => generatePatternFromConfig(garment, measurements),
    [garment, measurements]
  );

  const handleGeneratePattern = () => {
    setMode("pattern");
    setZoom(1);
  };

  const handleBackToConfig = () => {
    setMode("configure");
  };

  const handleExportSVG = () => exportSVG(pattern.svg);
  const handleExportPDF = () => exportPDF(pattern.svg);
  const handleExportDXF = () => exportDXF(pattern.svg);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Toolbar
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.25, 5))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
        onZoomReset={() => setZoom(1)}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onExportSVG={handleExportSVG}
        onExportPDF={handleExportPDF}
        onExportDXF={handleExportDXF}
      />
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === "configure" ? (
            <motion.div
              key="configure"
              className="flex flex-1 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Left: Configurator */}
              <div className="w-80 flex-shrink-0 overflow-hidden">
                <GarmentConfigurator
                  garment={garment}
                  onChange={setGarment}
                  onGeneratePattern={handleGeneratePattern}
                />
              </div>
              {/* Center: Silhouette preview */}
              <div className="flex-1 bg-canvas canvas-grid flex items-center justify-center">
                <motion.div
                  key={JSON.stringify(garment)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <SilhouettePreview garment={garment} />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pattern"
              className="flex flex-1 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Left: Measurements + back button */}
              <div className="w-72 flex-shrink-0 overflow-hidden flex flex-col">
                <div className="p-3 border-b border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={handleBackToConfig}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Design
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <MeasurementsPanel
                    measurements={measurements}
                    options={options}
                    onMeasurementChange={handleMeasurementChange}
                    onOptionChange={handleOptionChange}
                  />
                </div>
              </div>
              {/* Canvas */}
              <div className="flex-1">
                <PatternCanvas
                  pattern={pattern}
                  zoom={zoom}
                  onMeasurementDelta={handleMeasurementDelta}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
