import jsPDF from "jspdf";

/** Export SVG string as downloadable .svg file */
export function exportSVG(svgString: string, filename = "pattern.svg") {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  downloadBlob(blob, filename);
}

/** Export SVG pattern as tiled PDF at actual scale */
export function exportPDF(svgString: string, filename = "pattern.pdf") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.querySelector("svg");
  if (!svgEl) return;

  const vb = svgEl.getAttribute("viewBox")?.split(" ").map(Number) || [0, 0, 200, 200];
  const [, , svgW, svgH] = vb;

  // Convert SVG units (roughly mm/10) to mm for PDF
  const mmW = svgW * 10;
  const mmH = svgH * 10;

  const pdf = new jsPDF({
    orientation: mmW > mmH ? "landscape" : "portrait",
    unit: "mm",
    format: [Math.max(mmW, 210), Math.max(mmH, 297)],
  });

  // Render SVG to canvas, then to PDF
  const canvas = document.createElement("canvas");
  const scale = 4;
  canvas.width = svgW * scale;
  canvas.height = svgH * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, mmW, mmH);
    pdf.save(filename);
  };
  img.src = url;
}

/** Convert SVG to basic DXF format */
export function exportDXF(svgString: string, filename = "pattern.dxf") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const paths = doc.querySelectorAll("path");

  let dxf = `0\nSECTION\n2\nENTITIES\n`;

  paths.forEach((path) => {
    const d = path.getAttribute("d") || "";
    const coords = extractLineCoords(d);
    for (let i = 0; i < coords.length - 1; i++) {
      dxf += `0\nLINE\n8\n0\n`;
      dxf += `10\n${coords[i][0]}\n20\n${coords[i][1]}\n30\n0\n`;
      dxf += `11\n${coords[i + 1][0]}\n21\n${coords[i + 1][1]}\n31\n0\n`;
    }
  });

  dxf += `0\nENDSEC\n0\nEOF\n`;
  const blob = new Blob([dxf], { type: "application/dxf" });
  downloadBlob(blob, filename);
}

function extractLineCoords(d: string): number[][] {
  const coords: number[][] = [];
  const parts = d.replace(/[MLZQCmlzqc]/g, " ").trim().split(/\s+/);
  for (let i = 0; i < parts.length - 1; i += 2) {
    const x = parseFloat(parts[i]);
    const y = parseFloat(parts[i + 1]);
    if (!isNaN(x) && !isNaN(y)) coords.push([x, y]);
  }
  return coords;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
