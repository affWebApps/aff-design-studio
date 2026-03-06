import { useRef, useState, useCallback, useEffect } from "react";
import { type ControlPoint, type PatternResult, dragToMeasurement, type Measurements } from "@/lib/pattern-engine";

interface PatternCanvasProps {
  pattern: PatternResult;
  zoom: number;
  onMeasurementDelta: (measurement: keyof Measurements, delta: number) => void;
}

export function PatternCanvas({ pattern, zoom, onMeasurementDelta }: PatternCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Parse viewBox for coordinate mapping
  const vbParts = pattern.viewBox.split(" ").map(Number);
  const [vbX, vbY, vbW, vbH] = vbParts;

  const getScaleFactor = useCallback(() => {
    if (!containerRef.current) return 1;
    const rect = containerRef.current.getBoundingClientRect();
    return vbW / (rect.width / zoom);
  }, [vbW, zoom]);

  const screenToSVG = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const sf = getScaleFactor();
      return {
        x: (clientX - rect.left) * sf / zoom + vbX - pan.x * sf / zoom,
        y: (clientY - rect.top) * sf / zoom + vbY - pan.y * sf / zoom,
      };
    },
    [getScaleFactor, vbX, vbY, zoom, pan]
  );

  const handlePointDown = useCallback(
    (e: React.MouseEvent, point: ControlPoint) => {
      e.stopPropagation();
      setDragging(point.id);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (dragging) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y });
    },
    [dragging, pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragging && dragStart) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        const sf = getScaleFactor();
        const point = pattern.controlPoints.find((p) => p.id === dragging);
        if (point) {
          const result = dragToMeasurement(point, dx * sf / zoom, dy * sf / zoom, 1);
          if (result && Math.abs(dx) + Math.abs(dy) > 3) {
            onMeasurementDelta(result.measurement, result.delta);
            setDragStart({ x: e.clientX, y: e.clientY });
          }
        }
      } else if (isPanning && panStart) {
        setPan({
          x: panStart.px + (e.clientX - panStart.x),
          y: panStart.py + (e.clientY - panStart.y),
        });
      }
    },
    [dragging, dragStart, isPanning, panStart, getScaleFactor, zoom, pattern.controlPoints, onMeasurementDelta]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setDragStart(null);
    setIsPanning(false);
    setPanStart(null);
  }, []);

  // Handle wheel zoom is done by parent

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full canvas-grid bg-canvas overflow-hidden"
      style={{ cursor: isPanning ? "grabbing" : dragging ? "move" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pattern SVG */}
        <div
          className="relative"
          style={{ width: "80%", maxWidth: "700px" }}
          dangerouslySetInnerHTML={{ __html: pattern.svg }}
        />
      </div>

      {/* Control point overlays */}
      {pattern.controlPoints.map((point) => {
        // We need to position these relative to the SVG
        // For simplicity, we'll render them inside the SVG transform
        return null; // Rendered below as SVG overlay
      })}

      {/* SVG overlay for control points */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={pattern.viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {pattern.controlPoints.map((point) => (
          <g key={point.id} style={{ pointerEvents: "all" }}>
            <circle
              cx={point.x}
              cy={point.y}
              r={4 / zoom}
              fill="hsl(43, 100%, 50%)"
              stroke="hsl(0, 0%, 10%)"
              strokeWidth={1.5 / zoom}
              className="cursor-move transition-all"
              style={{
                filter: dragging === point.id ? "drop-shadow(0 0 4px hsl(43, 100%, 60%))" : "none",
              }}
              onMouseDown={(e) => handlePointDown(e, point)}
            />
            {/* Label */}
            <text
              x={point.x}
              y={point.y - 6 / zoom}
              textAnchor="middle"
              fill="hsl(0, 0%, 65%)"
              fontSize={3.5 / zoom}
              fontFamily="Space Grotesk, sans-serif"
              style={{ pointerEvents: "none" }}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 rounded-md bg-secondary/80 px-2 py-1 text-xs text-muted-foreground font-mono backdrop-blur-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
