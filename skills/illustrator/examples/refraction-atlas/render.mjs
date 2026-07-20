import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

const canvas = { height: 1000, width: 1600 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();

const palette = {
  body: "#4F5664",
  canvas: "#FFFFFF",
  cobalt: "#315CF5",
  coral: "#FF6B78",
  cyan: "#42C7DB",
  ice: "#EAF3FF",
  ink: "#11131A",
  muted: "#9298A8",
  rule: "#E8EAF0",
  violet: "#846CFF",
};

/** @type {Array<[string, string]>} */
const fontDefinitions = [
  ["../../assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf", "Noto Sans SC"],
  ["../../assets/fonts/jetbrains-mono/JetBrainsMono-VF.ttf", "JetBrains Mono"],
];

await Promise.all(
  fontDefinitions.map(async ([path, name]) =>
    renderer.registerFont({
      data: await readFile(new URL(path, import.meta.url)),
      name,
    })
  )
);

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const upperValues = [72, 69, 76, 74, 82, 79, 87, 84, 92, 89, 95, 91];
const signalValues = [61, 63, 57, 68, 62, 73, 69, 80, 75, 85, 81, 88];
const lowerValues = [51, 56, 42, 58, 49, 65, 57, 71, 64, 78, 70, 82];
const zeroValues = Array.from({ length: months.length }, () => 0);
const plot = { height: 500, width: 1120, x: 80, y: 320 };
const detailPlot = { height: 220, width: 250, x: 1270, y: 590 };
const detailUpperValues = upperValues.slice(-8);
const detailSignalValues = signalValues.slice(-8);
const detailLowerValues = lowerValues.slice(-8);
const detailZeroValues = Array.from(
  { length: detailUpperValues.length },
  () => 0
);
const railX = 1240;

/** @typedef {{ height: number; width: number; x: number; y: number }} Plot */
/** @typedef {{ x: number; y: number }} Point */

/** @type {(options: { align?: string; color?: string; family?: string; letterSpacing?: number; size?: number; text: string; weight?: number; width?: number; x: number; y: number }) => string} */
const htmlText = ({
  align = "left",
  color = palette.ink,
  family = "Noto Sans SC",
  letterSpacing = 0,
  size = 14,
  text,
  weight = 500,
  width = 320,
  x,
  y,
}) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${width}px;color:${color};font-family:${family};font-size:${size}px;font-weight:${weight};line-height:1.15;letter-spacing:${letterSpacing}em;text-align:${align};white-space:nowrap">${text}</div>`;

/** @type {(values: number[], targetPlot?: Plot) => Point[]} */
const seriesPoints = (values, targetPlot = plot) =>
  values.map((value, index) => ({
    x:
      targetPlot.x +
      (index / Math.max(values.length - 1, 1)) * targetPlot.width,
    y: targetPlot.y + targetPlot.height - (value / 100) * targetPlot.height,
  }));

/** @type {(points: Point[]) => string} */
const straightLinePath = (points) => {
  const [firstPoint] = points;
  if (!firstPoint) {
    return "";
  }

  const commands = [`M${firstPoint.x} ${firstPoint.y}`];
  for (const point of points.slice(1)) {
    commands.push(`L${point.x} ${point.y}`);
  }
  return commands.join("");
};

/** @type {(upperSeries: number[], lowerSeries: number[], targetPlot?: Plot) => string} */
const surfacePath = (upperSeries, lowerSeries, targetPlot = plot) => {
  const upperPath = straightLinePath(seriesPoints(upperSeries, targetPlot));
  const lowerPath = straightLinePath(
    seriesPoints(lowerSeries, targetPlot).toReversed()
  );
  return `${upperPath}${lowerPath.replace(/^M/u, "L")}Z`;
};

const upperLine = straightLinePath(seriesPoints(upperValues));
const signalLine = straightLinePath(seriesPoints(signalValues));
const lowerLine = straightLinePath(seriesPoints(lowerValues));
const upperArea = surfacePath(upperValues, zeroValues);
const signalArea = surfacePath(signalValues, zeroValues);
const lowerArea = surfacePath(lowerValues, zeroValues);
const detailUpperLine = straightLinePath(
  seriesPoints(detailUpperValues, detailPlot)
);
const detailSignalLine = straightLinePath(
  seriesPoints(detailSignalValues, detailPlot)
);
const detailLowerLine = straightLinePath(
  seriesPoints(detailLowerValues, detailPlot)
);
const detailUpperArea = surfacePath(
  detailUpperValues,
  detailZeroValues,
  detailPlot
);
const detailSignalArea = surfacePath(
  detailSignalValues,
  detailZeroValues,
  detailPlot
);
const detailLowerArea = surfacePath(
  detailLowerValues,
  detailZeroValues,
  detailPlot
);

/** @type {(value: number, targetPlot?: Plot) => number} */
const plotY = (value, targetPlot = plot) =>
  targetPlot.y + targetPlot.height - (value / 100) * targetPlot.height;

const gridLines = [0, 25, 50, 75, 100]
  .map((value) => {
    const y = plotY(value);
    return `<line x1="${plot.x}" y1="${y}" x2="${plot.x + plot.width}" y2="${y}" stroke="${palette.rule}" stroke-width="1" stroke-dasharray="4 7"/>`;
  })
  .join("");

const xAxisLabels = months
  .map((month, index) => {
    const x =
      plot.x + (index / Math.max(months.length - 1, 1)) * plot.width - 24;
    return htmlText({
      align: "center",
      color: palette.muted,
      family: "JetBrains Mono",
      size: 10,
      text: month,
      width: 48,
      x,
      y: plot.y + plot.height + 20,
    });
  })
  .join("");

const yAxisLabels = [0, 25, 50, 75, 100]
  .map((value) =>
    htmlText({
      align: "right",
      color: palette.muted,
      family: "JetBrains Mono",
      size: 10,
      text: String(value),
      width: 34,
      x: plot.x - 50,
      y: plotY(value) - 6,
    })
  )
  .join("");

const lastUpperPoint = seriesPoints(upperValues).at(-1) ?? {
  x: plot.x + plot.width,
  y: plot.y,
};
const lastSignalPoint = seriesPoints(signalValues).at(-1) ?? {
  x: plot.x + plot.width,
  y: plot.y,
};
const lastLowerPoint = seriesPoints(lowerValues).at(-1) ?? {
  x: plot.x + plot.width,
  y: plot.y,
};
const lastDetailUpperPoint = seriesPoints(detailUpperValues, detailPlot).at(
  -1
) ?? {
  x: detailPlot.x + detailPlot.width,
  y: detailPlot.y,
};
const lastDetailSignalPoint = seriesPoints(detailSignalValues, detailPlot).at(
  -1
) ?? {
  x: detailPlot.x + detailPlot.width,
  y: detailPlot.y,
};
const lastDetailLowerPoint = seriesPoints(detailLowerValues, detailPlot).at(
  -1
) ?? {
  x: detailPlot.x + detailPlot.width,
  y: detailPlot.y,
};
const targetY = plotY(80);

const detailGridLines = [25, 50, 75, 100]
  .map((value) => {
    const y = plotY(value, detailPlot);
    return `<line x1="${detailPlot.x}" y1="${y}" x2="${detailPlot.x + detailPlot.width}" y2="${y}" stroke="${palette.rule}" stroke-width="1" stroke-dasharray="3 6"/>`;
  })
  .join("");

const svg = [
  `<svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" style="position:absolute;left:0;top:0">`,
  "<defs>",
  `<linearGradient id="upper-field" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${palette.cobalt}" stop-opacity="0.18"/><stop offset="100%" stop-color="${palette.cobalt}" stop-opacity="0"/></linearGradient>`,
  `<linearGradient id="signal-field" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${palette.violet}" stop-opacity="0.16"/><stop offset="100%" stop-color="${palette.violet}" stop-opacity="0"/></linearGradient>`,
  `<linearGradient id="lower-field" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${palette.cyan}" stop-opacity="0.16"/><stop offset="100%" stop-color="${palette.cyan}" stop-opacity="0"/></linearGradient>`,
  "</defs>",
  `<rect x="0" y="0" width="${canvas.width}" height="${canvas.height}" fill="${palette.canvas}"/>`,
  `<line x1="48" y1="195" x2="1552" y2="195" stroke="${palette.ink}" stroke-width="1.5"/>`,
  `<line x1="${railX}" y1="220" x2="${railX}" y2="910" stroke="${palette.rule}" stroke-width="1"/>`,
  gridLines,
  `<line x1="${plot.x}" y1="${targetY}" x2="${plot.x + plot.width}" y2="${targetY}" stroke="${palette.coral}" stroke-width="1" stroke-dasharray="5 7" opacity="0.34"/>`,
  `<path d="${upperArea}" fill="url(#upper-field)"/>`,
  `<path d="${signalArea}" fill="url(#signal-field)"/>`,
  `<path d="${lowerArea}" fill="url(#lower-field)"/>`,
  `<path d="${upperLine}" fill="none" stroke="${palette.cobalt}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<path d="${signalLine}" fill="none" stroke="${palette.violet}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<path d="${lowerLine}" fill="none" stroke="${palette.cyan}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<circle cx="${lastUpperPoint.x}" cy="${lastUpperPoint.y}" r="5.5" fill="#FFFFFF" stroke="${palette.cobalt}" stroke-width="2.2"/>`,
  `<circle cx="${lastSignalPoint.x}" cy="${lastSignalPoint.y}" r="5.5" fill="#FFFFFF" stroke="${palette.violet}" stroke-width="2.2"/>`,
  `<circle cx="${lastLowerPoint.x}" cy="${lastLowerPoint.y}" r="5.5" fill="#FFFFFF" stroke="${palette.cyan}" stroke-width="2.2"/>`,
  detailGridLines,
  `<path d="${detailUpperArea}" fill="url(#upper-field)"/>`,
  `<path d="${detailSignalArea}" fill="url(#signal-field)"/>`,
  `<path d="${detailLowerArea}" fill="url(#lower-field)"/>`,
  `<path d="${detailUpperLine}" fill="none" stroke="${palette.cobalt}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<path d="${detailSignalLine}" fill="none" stroke="${palette.violet}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<path d="${detailLowerLine}" fill="none" stroke="${palette.cyan}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<circle cx="${lastDetailUpperPoint.x}" cy="${lastDetailUpperPoint.y}" r="4.5" fill="#FFFFFF" stroke="${palette.cobalt}" stroke-width="2"/>`,
  `<circle cx="${lastDetailSignalPoint.x}" cy="${lastDetailSignalPoint.y}" r="4.5" fill="#FFFFFF" stroke="${palette.violet}" stroke-width="2"/>`,
  `<circle cx="${lastDetailLowerPoint.x}" cy="${lastDetailLowerPoint.y}" r="4.5" fill="#FFFFFF" stroke="${palette.cyan}" stroke-width="2"/>`,
  `<line x1="48" y1="930" x2="1552" y2="930" stroke="${palette.ink}" stroke-width="1.5"/>`,
  "</svg>",
].join("");

const textLayer = [
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    letterSpacing: 0.13,
    size: 11,
    text: "REFRACTION ATLAS / VOL. 01",
    width: 390,
    x: 48,
    y: 48,
  }),
  htmlText({
    letterSpacing: -0.05,
    size: 54,
    text: "MOMENTUM, RANGE & CHANGE",
    weight: 700,
    width: 980,
    x: 44,
    y: 78,
  }),
  htmlText({
    color: palette.body,
    size: 14,
    text: "THREE CRISP SIGNALS / OVERLAPPING FIELDS / ONE SHARED SCALE",
    width: 620,
    x: 48,
    y: 146,
  }),
  htmlText({
    align: "right",
    color: palette.muted,
    family: "JetBrains Mono",
    letterSpacing: 0.08,
    size: 11,
    text: "REPORT / 2026",
    width: 220,
    x: 1330,
    y: 58,
  }),
  htmlText({
    align: "right",
    family: "JetBrains Mono",
    letterSpacing: -0.04,
    size: 28,
    text: "12 / MONTHS",
    weight: 700,
    width: 260,
    x: 1290,
    y: 96,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    letterSpacing: 0.1,
    size: 11,
    text: "01 / MOMENTUM FIELD",
    width: 260,
    x: 80,
    y: 226,
  }),
  htmlText({
    size: 27,
    text: "THREE-SIGNAL FIELD",
    weight: 700,
    width: 440,
    x: 80,
    y: 254,
  }),
  htmlText({
    align: "right",
    color: palette.muted,
    family: "JetBrains Mono",
    size: 10,
    text: "COBALT / UPPER · VIOLET / SIGNAL · CYAN / LOWER",
    width: 360,
    x: 840,
    y: 268,
  }),
  xAxisLabels,
  yAxisLabels,
  htmlText({
    align: "right",
    color: palette.coral,
    family: "JetBrains Mono",
    size: 9,
    text: "TARGET / 80",
    width: 100,
    x: plot.x + plot.width - 100,
    y: targetY - 17,
  }),
  `<div style="position:absolute;left:${lastUpperPoint.x - 60}px;top:${lastUpperPoint.y - 58}px;width:80px;height:34px;border:1px solid ${palette.rule};border-radius:999px;background:rgba(255,255,255,0.9);box-shadow:7px 9px 0 ${palette.cobalt}12;display:flex;align-items:center;justify-content:center;color:${palette.ink};font-family:JetBrains Mono;font-size:12px;font-weight:700">91.0</div>`,
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    letterSpacing: 0.1,
    size: 11,
    text: "02 / FIELD SUMMARY",
    width: 260,
    x: 1280,
    y: 226,
  }),
  htmlText({
    family: "JetBrains Mono",
    letterSpacing: -0.055,
    size: 46,
    text: "+24.8%",
    weight: 700,
    width: 280,
    x: 1276,
    y: 268,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    size: 11,
    text: "MOMENTUM",
    width: 160,
    x: 1280,
    y: 322,
  }),
  htmlText({
    family: "JetBrains Mono",
    letterSpacing: -0.05,
    size: 36,
    text: "14.2",
    weight: 700,
    width: 200,
    x: 1276,
    y: 370,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    size: 11,
    text: "RANGE WIDTH",
    width: 180,
    x: 1280,
    y: 415,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    letterSpacing: 0.1,
    size: 11,
    text: "03 / DETAIL WINDOW",
    width: 260,
    x: 1280,
    y: 474,
  }),
  htmlText({
    color: palette.ink,
    family: "JetBrains Mono",
    letterSpacing: -0.035,
    size: 22,
    text: "LAST 8 / SERIES",
    weight: 700,
    width: 250,
    x: 1270,
    y: 506,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    size: 9,
    text: "T−7",
    width: 70,
    x: detailPlot.x,
    y: detailPlot.y + detailPlot.height + 18,
  }),
  htmlText({
    align: "right",
    color: palette.cobalt,
    family: "JetBrains Mono",
    size: 9,
    text: "NOW / 91",
    width: 90,
    x: detailPlot.x + detailPlot.width - 90,
    y: detailPlot.y + detailPlot.height + 18,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    size: 9,
    text: "THREE SERIES / SAME SCALE",
    width: 250,
    x: detailPlot.x,
    y: detailPlot.y + detailPlot.height + 48,
  }),
  htmlText({
    color: palette.muted,
    family: "JetBrains Mono",
    size: 10,
    text: "SOURCE / SAMPLE DATA · NORMALIZED 0—100",
    width: 430,
    x: 48,
    y: 955,
  }),
  htmlText({
    align: "right",
    color: palette.muted,
    family: "JetBrains Mono",
    size: 10,
    text: "SOLID STROKES / 2.6PX · FIELD OPACITY / 00—18%",
    width: 430,
    x: 1122,
    y: 955,
  }),
].join("");

const html = `<div style="position:relative;width:100%;height:100%;overflow:hidden;background:${palette.canvas};color:${palette.ink};font-family:Noto Sans SC">${svg}${textLayer}</div>`;

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
