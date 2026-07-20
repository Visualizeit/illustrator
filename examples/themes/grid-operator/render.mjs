import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

const canvas = { height: 900, width: 1600 };
const outputPath =
  process.argv[2] ??
  new URL("../../../docs/assets/grid-operator.png", import.meta.url);
const renderer = new Renderer();

const palette = {
  body: "#536158",
  canvas: "#F3F5F0",
  coral: "#FF7958",
  green: "#218B57",
  greenDark: "#12623C",
  grid: "#CAD4CC",
  gridSoft: "#E7ECE8",
  ink: "#14241B",
  lime: "#BDF36B",
  paper: "#FFFFFF",
  sheetChrome: "#EEF3EF",
};

const fontDefinitions = [
  [
    "../../../skills/illustrator/assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf",
    "Noto Sans SC",
  ],
  [
    "../../../skills/illustrator/assets/fonts/jetbrains-mono/JetBrainsMono-VF.ttf",
    "JetBrains Mono",
  ],
];

await Promise.all(
  fontDefinitions.map(async ([path, name]) =>
    renderer.registerFont({
      data: await readFile(new URL(path, import.meta.url)),
      name,
    })
  )
);

const sheet = {
  appBarHeight: 54,
  columnHeaderHeight: 42,
  formulaBarHeight: 50,
  rowHeaderWidth: 54,
  x: 790,
  y: 110,
};
const columnWidth = 136;
const columnCount = 7;
const rowHeight = 58;
const rowCount = 7;
const sheetWidth = sheet.rowHeaderWidth + columnWidth * columnCount;
const gridY = sheet.y + sheet.formulaBarHeight;
const dataY = gridY + sheet.columnHeaderHeight;
const dataHeight = rowHeight * rowCount;
const tabBarY = dataY + dataHeight;
const sheetHeight =
  sheet.formulaBarHeight + sheet.columnHeaderHeight + dataHeight;

const headerCells = Array.from(
  { length: columnCount },
  (_columnValue, columnIndex) => {
    const x = sheet.x + sheet.rowHeaderWidth + columnIndex * columnWidth;
    const markerWidth = 34 + (columnIndex % 3) * 14;
    return [
      `<rect x="${x}" y="${gridY}" width="${columnWidth}" height="${sheet.columnHeaderHeight}" fill="${palette.sheetChrome}" stroke="${palette.grid}" stroke-width="1"/>`,
      `<rect x="${x + (columnWidth - markerWidth) / 2}" y="${gridY + 19}" width="${markerWidth}" height="4" fill="${palette.body}" opacity="0.55"/>`,
    ].join("");
  }
).join("");

const sheetRows = Array.from({ length: rowCount }, (_rowValue, rowIndex) => {
  const y = dataY + rowIndex * rowHeight;
  const rowFill = rowIndex % 2 === 0 ? palette.paper : "#FBFCFB";
  const rowHeader = [
    `<rect x="${sheet.x}" y="${y}" width="${sheet.rowHeaderWidth}" height="${rowHeight}" fill="${palette.sheetChrome}" stroke="${palette.grid}" stroke-width="1"/>`,
    `<rect x="${sheet.x + 20}" y="${y + 27}" width="14" height="3" fill="${palette.body}" opacity="0.48"/>`,
  ].join("");
  const cells = Array.from(
    { length: columnCount },
    (_cellValue, columnIndex) => {
      const x = sheet.x + sheet.rowHeaderWidth + columnIndex * columnWidth;
      return `<rect x="${x}" y="${y}" width="${columnWidth}" height="${rowHeight}" fill="${rowFill}" stroke="${palette.gridSoft}" stroke-width="1"/>`;
    }
  ).join("");
  return `${rowHeader}${cells}`;
}).join("");

const semanticRows = [
  { metricHeights: [10, 18, 14], progress: 82, taskWidth: 82 },
  { metricHeights: [16, 11, 21], progress: 64, taskWidth: 104 },
  { metricHeights: [8, 15, 24], progress: 91, taskWidth: 70 },
  { metricHeights: [13, 22, 17], progress: 76, taskWidth: 94 },
  { metricHeights: [20, 12, 16], progress: 48, taskWidth: 62 },
];

const semanticCells = semanticRows
  .map(({ metricHeights, progress, taskWidth }, rowIndex) => {
    const rowTop = dataY + rowIndex * rowHeight;
    const centerY = rowTop + rowHeight / 2;
    const firstColumnX = sheet.x + sheet.rowHeaderWidth;
    const triggerX = firstColumnX + 20;
    const taskX = firstColumnX + columnWidth + 16;
    const metricX = firstColumnX + columnWidth * 2 + 35;
    const statusX = firstColumnX + columnWidth * 3 + 22;
    const progressX = firstColumnX + columnWidth * 4 + 16;
    const flowX = firstColumnX + columnWidth * 5 + 30;
    const stateColor = rowIndex === 4 ? palette.coral : palette.green;
    const stateBackground = rowIndex === 4 ? "#FFE7E0" : "#DDF3E5";
    const stateIcon =
      rowIndex === 4
        ? `<path d="M${statusX + 7} ${centerY - 7} L${statusX + 21} ${centerY + 7} M${statusX + 21} ${centerY - 7} L${statusX + 7} ${centerY + 7}" stroke="${stateColor}" stroke-width="3" stroke-linecap="round"/>`
        : `<path d="M${statusX + 6} ${centerY} L${statusX + 12} ${centerY + 6} L${statusX + 23} ${centerY - 7}" fill="none" stroke="${stateColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    const metricBars = metricHeights
      .map(
        (height, metricIndex) =>
          `<rect x="${metricX + metricIndex * 16}" y="${centerY + 12 - height}" width="9" height="${height}" fill="${metricIndex === 2 ? palette.green : palette.body}" opacity="${metricIndex === 2 ? 0.78 : 0.42}"/>`
      )
      .join("");

    return [
      `<circle cx="${triggerX}" cy="${centerY}" r="7" fill="${rowIndex === 3 ? palette.lime : palette.paper}" stroke="${palette.green}" stroke-width="2"/>`,
      `<line x1="${triggerX + 15}" y1="${centerY}" x2="${triggerX + 63}" y2="${centerY}" stroke="${palette.body}" stroke-width="5" opacity="0.4"/>`,
      `<rect x="${taskX}" y="${centerY - 11}" width="${taskWidth}" height="6" fill="${palette.ink}" opacity="0.5"/>`,
      `<rect x="${taskX}" y="${centerY + 5}" width="${Math.max(taskWidth - 28, 30)}" height="4" fill="${palette.body}" opacity="0.24"/>`,
      metricBars,
      `<circle cx="${statusX + 14}" cy="${centerY}" r="17" fill="${stateBackground}"/>`,
      stateIcon,
      `<rect x="${progressX}" y="${centerY - 5}" width="100" height="10" rx="5" fill="${palette.gridSoft}"/>`,
      `<rect x="${progressX}" y="${centerY - 5}" width="${progress}" height="10" rx="5" fill="${stateColor}" opacity="0.72"/>`,
      `<line x1="${flowX}" y1="${centerY}" x2="${flowX + 52}" y2="${centerY}" stroke="${palette.grid}" stroke-width="2"/>`,
      `<circle cx="${flowX}" cy="${centerY}" r="5" fill="${palette.paper}" stroke="${palette.green}" stroke-width="2"/>`,
      `<circle cx="${flowX + 26}" cy="${centerY}" r="5" fill="${palette.lime}" stroke="${palette.green}" stroke-width="2"/>`,
      `<circle cx="${flowX + 52}" cy="${centerY}" r="5" fill="${palette.paper}" stroke="${palette.green}" stroke-width="2"/>`,
    ].join("");
  })
  .join("");

const selection = {
  height: rowHeight,
  width: columnWidth,
  x: sheet.x + sheet.rowHeaderWidth + columnWidth * 3,
  y: dataY + rowHeight * 3,
};

const spreadsheetSvg = [
  `<g transform="rotate(-5 1210 430)">`,
  `<rect x="${sheet.x + 13}" y="${sheet.y - sheet.appBarHeight + 15}" width="${sheetWidth}" height="${sheetHeight + sheet.appBarHeight + 48}" fill="${palette.lime}" opacity="0.24"/>`,
  `<rect x="${sheet.x}" y="${sheet.y - sheet.appBarHeight}" width="${sheetWidth}" height="${sheetHeight + sheet.appBarHeight + 48}" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="2"/>`,
  `<rect x="${sheet.x}" y="${sheet.y - sheet.appBarHeight}" width="${sheetWidth}" height="${sheet.appBarHeight}" fill="${palette.greenDark}"/>`,
  `<rect x="${sheet.x}" y="${sheet.y - sheet.appBarHeight}" width="205" height="${sheet.appBarHeight}" fill="${palette.green}"/>`,
  `<rect x="${sheet.x + 22}" y="${sheet.y - 34}" width="20" height="18" fill="none" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 29}" y1="${sheet.y - 33}" x2="${sheet.x + 29}" y2="${sheet.y - 17}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 36}" y1="${sheet.y - 33}" x2="${sheet.x + 36}" y2="${sheet.y - 17}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 23}" y1="${sheet.y - 27}" x2="${sheet.x + 41}" y2="${sheet.y - 27}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<rect x="${sheet.x + 60}" y="${sheet.y - 30}" width="86" height="4" fill="#D6F0E0"/>`,
  `<rect x="${sheet.x + 60}" y="${sheet.y - 20}" width="54" height="3" fill="#D6F0E0" opacity="0.66"/>`,
  `<circle cx="${sheet.x + sheetWidth - 92}" cy="${sheet.y - 27}" r="6" fill="${palette.lime}"/>`,
  `<rect x="${sheet.x + sheetWidth - 74}" y="${sheet.y - 30}" width="44" height="6" fill="#CBE7D6" opacity="0.72"/>`,
  `<rect x="${sheet.x}" y="${sheet.y}" width="${sheetWidth}" height="${sheet.formulaBarHeight}" fill="#F8FAF8" stroke="${palette.grid}" stroke-width="1"/>`,
  `<rect x="${sheet.x + 14}" y="${sheet.y + 10}" width="76" height="30" fill="${palette.paper}" stroke="${palette.grid}" stroke-width="1"/>`,
  `<rect x="${sheet.x + 32}" y="${sheet.y + 23}" width="34" height="4" fill="${palette.body}" opacity="0.58"/>`,
  `<path d="M${sheet.x + 112} ${sheet.y + 16} L${sheet.x + 102} ${sheet.y + 34} M${sheet.x + 103} ${sheet.y + 23} L${sheet.x + 116} ${sheet.y + 23}" stroke="${palette.green}" stroke-width="3" stroke-linecap="round"/>`,
  `<rect x="${sheet.x + 132}" y="${sheet.y + 10}" width="${sheetWidth - 148}" height="30" fill="${palette.paper}" stroke="${palette.grid}" stroke-width="1"/>`,
  `<rect x="${sheet.x + 150}" y="${sheet.y + 23}" width="226" height="4" fill="${palette.body}" opacity="0.28"/>`,
  `<rect x="${sheet.x}" y="${gridY}" width="${sheet.rowHeaderWidth}" height="${sheet.columnHeaderHeight}" fill="${palette.green}" stroke="${palette.grid}" stroke-width="1"/>`,
  headerCells,
  sheetRows,
  semanticCells,
  `<rect x="${selection.x}" y="${selection.y}" width="${selection.width}" height="${selection.height}" fill="${palette.lime}" fill-opacity="0.16" stroke="${palette.green}" stroke-width="4"/>`,
  `<rect x="${selection.x + selection.width - 7}" y="${selection.y + selection.height - 7}" width="14" height="14" fill="${palette.green}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x}" y1="${dataY}" x2="${sheet.x + sheetWidth}" y2="${dataY}" stroke="${palette.greenDark}" stroke-width="2" opacity="0.32"/>`,
  `<rect x="${sheet.x}" y="${tabBarY}" width="${sheetWidth}" height="48" fill="#F7F9F7" stroke="${palette.grid}" stroke-width="1"/>`,
  `<rect x="${sheet.x + 72}" y="${tabBarY}" width="126" height="48" fill="${palette.paper}"/>`,
  `<rect x="${sheet.x + 72}" y="${tabBarY + 44}" width="126" height="4" fill="${palette.green}"/>`,
  `<rect x="${sheet.x + 94}" y="${tabBarY + 22}" width="72" height="5" fill="${palette.greenDark}" opacity="0.62"/>`,
  `<circle cx="${sheet.x + 32}" cy="${tabBarY + 24}" r="9" fill="none" stroke="${palette.green}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 26}" y1="${tabBarY + 24}" x2="${sheet.x + 38}" y2="${tabBarY + 24}" stroke="${palette.green}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 32}" y1="${tabBarY + 18}" x2="${sheet.x + 32}" y2="${tabBarY + 30}" stroke="${palette.green}" stroke-width="2"/>`,
  "</g>",
].join("");

const cursorPath = "M0 0 L2 142 L36 108 L68 174 L101 158 L69 94 L118 91 Z";
const cursorX = 1363;
const cursorY = 392;

const clickEffectSvg = [
  `<circle cx="${cursorX}" cy="${cursorY}" r="11" fill="none" stroke="${palette.lime}" stroke-width="3"/>`,
].join("");

const cursorSvg = [
  `<path d="${cursorPath}" transform="translate(${cursorX + 11} ${cursorY + 13})" fill="${palette.lime}" stroke="${palette.lime}" stroke-width="8" stroke-linejoin="round"/>`,
  `<path d="${cursorPath}" transform="translate(${cursorX} ${cursorY})" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round"/>`,
].join("");

const illustrationSvg = [
  `<svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" style="position:absolute;left:0;top:0">`,
  `<rect x="0" y="0" width="${canvas.width}" height="${canvas.height}" fill="${palette.canvas}"/>`,
  spreadsheetSvg,
  clickEffectSvg,
  cursorSvg,
  `<line x1="80" y1="824" x2="1520" y2="824" stroke="${palette.ink}" stroke-width="2"/>`,
  "</svg>",
].join("");

const label = ({
  color = palette.body,
  letterSpacing = 0.11,
  size = 11,
  text,
  width = 300,
  x,
  y,
}) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${width}px;color:${color};font-family:JetBrains Mono;font-size:${size}px;font-weight:700;line-height:1.2;letter-spacing:${letterSpacing}em;white-space:nowrap">${text}</div>`;

const textLayer = [
  label({
    color: palette.greenDark,
    text: "GRID OPERATOR / AI OFFICE",
    width: 390,
    x: 80,
    y: 70,
  }),
  `<div style="position:absolute;left:76px;top:132px;width:700px;color:${palette.ink};font-family:Noto Sans SC;font-size:88px;font-weight:800;line-height:1;letter-spacing:-0.055em;white-space:nowrap">AI 办公自动化</div>`,
  `<div style="position:absolute;left:80px;top:268px;width:620px;color:${palette.greenDark};font-family:Noto Sans SC;font-size:36px;font-weight:650;line-height:1.2;letter-spacing:-0.025em">重复的，不必再重复</div>`,
  `<div style="position:absolute;left:80px;top:342px;width:500px;color:${palette.body};font-family:Noto Sans SC;font-size:18px;font-weight:450;line-height:1.55">表格、邮件和文档，交给 AI 接着做。</div>`,
  `<div style="position:absolute;left:80px;top:434px;width:42px;height:3px;background:${palette.green}"></div>`,
  label({
    color: palette.greenDark,
    text: "AUTO FLOW / RUNNING",
    width: 260,
    x: 142,
    y: 428,
  }),
  label({
    text: "LESS REPEAT / MORE FOCUS",
    width: 360,
    x: 80,
    y: 850,
  }),
  label({
    color: palette.greenDark,
    text: "POINTER → ACTIVE CELL",
    width: 320,
    x: 1290,
    y: 850,
  }),
].join("");

const html = `<div style="position:relative;width:100%;height:100%;overflow:hidden;background:${palette.canvas};color:${palette.ink};font-family:Noto Sans SC">${illustrationSvg}${textLayer}</div>`;

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
