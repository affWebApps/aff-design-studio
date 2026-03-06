import { useState, useCallback, useMemo } from "react";
import { MeasurementsPanel } from "@/components/studio/MeasurementsPanel";
import { PatternCanvas } from "@/components/studio/PatternCanvas";
import { Toolbar } from "@/components/studio/Toolbar";
import {
  generatePattern,
  defaultMeasurements,
  defaultDesignOptions,
  type Measurements,
  type DesignOptions,
} from "@/lib/pattern-engine";
import { exportSVG, exportPDF, exportDXF } from "@/lib/export-utils";

interface HistoryEntry {
  measurements: Measurements;
  options: DesignOptions;
}

export default function Studio() {
  const [measurements, setMeasurements] = useState<Measurements>({ ...defaultMeasurements });
  const [options, setOptions] = useState<DesignOptions>({ ...defaultDesignOptions });
  const [zoom, setZoom] = useState(1);

  // Undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([{ measurements: { ...defaultMeasurements }, options: { ...defaultDesignOptions } }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback(
    (m: Measurements, o: DesignOptions) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, { measurements: { ...m }, options: { ...o } }];
      });
      setHistoryIndex((i) => i + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    setMeasurements({ ...prev.measurements });
    setOptions({ ...prev.options });
    setHistoryIndex((i) => i - 1);
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setMeasurements({ ...next.measurements });
    setOptions({ ...next.options });
    setHistoryIndex((i) => i + 1);
  }, [historyIndex, history]);

  const handleMeasurementChange = useCallback(
    (key: keyof Measurements, value: number) => {
      setMeasurements((prev) => {
        const next = { ...prev, [key]: value };
        pushHistory(next, options);
        return next;
      });
    },
    [options, pushHistory]
  );

  const handleOptionChange = useCallback(
    <K extends keyof DesignOptions>(key: K, value: DesignOptions[K]) => {
      setOptions((prev) => {
        const next = { ...prev, [key]: value };
        pushHistory(measurements, next);
        return next;
      });
    },
    [measurements, pushHistory]
  );

  const handleMeasurementDelta = useCallback(
    (measurement: keyof Measurements, delta: number) => {
      setMeasurements((prev) => {
        const next = { ...prev, [measurement]: Math.max(100, prev[measurement] + delta) };
        // Don't push to history on every drag tick — only on mouseUp via canvas
        return next;
      });
    },
    []
  );

  const pattern = useMemo(
    () => generatePattern(measurements, options),
    [measurements, options]
  );

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
        {/* Left panel */}
        <div className="w-72 flex-shrink-0 overflow-hidden">
          <MeasurementsPanel
            measurements={measurements}
            options={options}
            onMeasurementChange={handleMeasurementChange}
            onOptionChange={handleOptionChange}
          />
        </div>
        {/* Canvas */}
        <div className="flex-1">
          <PatternCanvas
            pattern={pattern}
            zoom={zoom}
            onMeasurementDelta={handleMeasurementDelta}
          />
        </div>
      </div>
    </div>
  );
}
