import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

const canvas = { height: 900, width: 1600 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
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

const sheet = {
  appBarHeight: 52,
  columnHeaderHeight: 42,
  formulaBarHeight: 50,
  rowHeaderWidth: 50,
  x: 700,
  y: 147,
};
const columnWidths = [128, 228, 112, 144, 164, 180];
const rowHeight = 62;
const rowCount = 6;
const sheetWidth =
  sheet.rowHeaderWidth +
  columnWidths.reduce((total, width) => total + width, 0);
const gridY = sheet.y + sheet.formulaBarHeight;
const dataY = gridY + sheet.columnHeaderHeight;
const dataHeight = rowHeight * rowCount;
const tabBarY = dataY + dataHeight;
const sheetHeight =
  sheet.formulaBarHeight + sheet.columnHeaderHeight + dataHeight;
const selectedRowIndex = 3;

/** @type {(columnIndex: number) => number} */
const getColumnX = (columnIndex) => {
  let x = sheet.x + sheet.rowHeaderWidth;
  for (let index = 0; index < columnIndex; index += 1) {
    x += columnWidths[index] ?? 0;
  }
  return x;
};

/** @type {(options: { anchor?: "end" | "middle" | "start"; color?: string; family?: string; letterSpacing?: number; size?: number; text: string; weight?: number; x: number; y: number }) => string} */
const svgText = ({
  anchor = "start",
  color = palette.ink,
  family = "JetBrains Mono",
  letterSpacing = 0,
  size = 12,
  text,
  weight = 650,
  x,
  y,
}) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}em" text-anchor="${anchor}" dominant-baseline="middle">${text}</text>`;

const columnHeaders = [
  "TRIGGER",
  "TASK",
  "OWNER",
  "STATUS",
  "PROGRESS",
  "RESULT",
];
const headerCells = columnHeaders
  .map((header, columnIndex) => {
    const x = getColumnX(columnIndex);
    const width = columnWidths[columnIndex] ?? 0;
    return [
      `<rect x="${x}" y="${gridY}" width="${width}" height="${sheet.columnHeaderHeight}" fill="${palette.sheetChrome}" stroke="${palette.grid}" stroke-width="1"/>`,
      svgText({
        color: palette.body,
        letterSpacing: 0.09,
        size: 10,
        text: header,
        weight: 700,
        x: x + 14,
        y: gridY + sheet.columnHeaderHeight / 2,
      }),
    ].join("");
  })
  .join("");

const sheetRows = Array.from({ length: rowCount }, (_rowValue, rowIndex) => {
  const y = dataY + rowIndex * rowHeight;
  const isSelectedRow = rowIndex === selectedRowIndex;
  let rowFill = rowIndex % 2 === 0 ? palette.paper : "#FBFCFB";
  if (isSelectedRow) {
    rowFill = "#F8FDEB";
  }
  const rowHeader = [
    `<rect x="${sheet.x}" y="${y}" width="${sheet.rowHeaderWidth}" height="${rowHeight}" fill="${isSelectedRow ? "#E4F5CA" : palette.sheetChrome}" stroke="${palette.grid}" stroke-width="1"/>`,
    svgText({
      anchor: "middle",
      color: isSelectedRow ? palette.greenDark : palette.body,
      size: 10,
      text: String(rowIndex + 1).padStart(2, "0"),
      weight: isSelectedRow ? 800 : 650,
      x: sheet.x + sheet.rowHeaderWidth / 2,
      y: y + rowHeight / 2,
    }),
  ].join("");
  const cells = columnWidths
    .map((width, columnIndex) => {
      const x = getColumnX(columnIndex);
      return `<rect x="${x}" y="${y}" width="${width}" height="${rowHeight}" fill="${rowFill}" stroke="${palette.gridSoft}" stroke-width="1"/>`;
    })
    .join("");
  return `${rowHeader}${cells}`;
}).join("");

const automationRows = [
  {
    owner: "OPS",
    progress: 1,
    progressLabel: "42 / 42",
    result: "PDF READY",
    source: "EMAIL 09:12",
    state: "DONE",
    task: "Weekly report",
  },
  {
    owner: "FIN",
    progress: 1,
    progressLabel: "318 / 318",
    result: "ROWS UPDATED",
    source: "FORM 09:18",
    state: "DONE",
    task: "Invoice sync",
  },
  {
    owner: "SALES",
    progress: 1,
    progressLabel: "24 / 24",
    result: "MAIL QUEUED",
    source: "CAL 09:24",
    state: "DONE",
    task: "Client follow-up",
  },
  {
    owner: "CX",
    progress: 0.75,
    progressLabel: "18 / 24",
    result: "6 RECORDS LEFT",
    source: "MAIL 09:31",
    state: "RUNNING",
    task: "Feedback digest",
  },
  {
    owner: "LEGAL",
    progress: 0.43,
    progressLabel: "3 / 7",
    result: "CHECK 02",
    source: "DRIVE 09:34",
    state: "REVIEW",
    task: "Contract review",
  },
  {
    owner: "OPS",
    progress: 0,
    progressLabel: "0 / 12",
    result: "WAITING",
    source: "API 09:41",
    state: "QUEUED",
    task: "Archive handoff",
  },
];

const automationCells = automationRows
  .map((row, rowIndex) => {
    const rowTop = dataY + rowIndex * rowHeight;
    const centerY = rowTop + rowHeight / 2;
    const isRunning = row.state === "RUNNING";
    const isReview = row.state === "REVIEW";
    const isQueued = row.state === "QUEUED";
    const stateColor = isReview ? palette.coral : palette.green;
    let stateBackground = "#DDF3E5";
    if (isReview) {
      stateBackground = "#FFE7E0";
    } else if (isRunning) {
      stateBackground = "#E8F8C9";
    }
    const triggerX = getColumnX(0);
    const taskX = getColumnX(1);
    const ownerX = getColumnX(2);
    const statusX = getColumnX(3);
    const progressX = getColumnX(4);
    const resultX = getColumnX(5);
    const progressTrackWidth = 92;
    const progressWidth = Math.max(0, progressTrackWidth * row.progress);
    const triggerFill = isRunning ? palette.lime : palette.paper;
    const triggerStroke = isReview ? palette.coral : palette.green;
    const statusPillWidth = isRunning ? 104 : 86;
    let resultColor = palette.body;
    if (isReview) {
      resultColor = palette.coral;
    } else if (isRunning) {
      resultColor = palette.greenDark;
    }
    const statusContent = isQueued
      ? `<circle cx="${statusX + 27}" cy="${centerY}" r="5" fill="none" stroke="${palette.body}" stroke-width="2"/><line x1="${statusX + 27}" y1="${centerY - 3}" x2="${statusX + 27}" y2="${centerY}" stroke="${palette.body}" stroke-width="2"/><line x1="${statusX + 27}" y1="${centerY}" x2="${statusX + 30}" y2="${centerY + 2}" stroke="${palette.body}" stroke-width="2"/>`
      : svgText({
          anchor: "middle",
          color: stateColor,
          letterSpacing: 0.04,
          size: 9,
          text: row.state,
          weight: 800,
          x: statusX + 14 + statusPillWidth / 2,
          y: centerY,
        });
    const queuedLabel = isQueued
      ? svgText({
          color: palette.body,
          letterSpacing: 0.04,
          size: 9,
          text: "QUEUED",
          weight: 750,
          x: statusX + 39,
          y: centerY,
        })
      : "";

    return [
      `<circle cx="${triggerX + 18}" cy="${centerY}" r="6" fill="${triggerFill}" stroke="${triggerStroke}" stroke-width="2"/>`,
      svgText({
        color: palette.body,
        size: 9,
        text: row.source,
        weight: 700,
        x: triggerX + 32,
        y: centerY,
      }),
      svgText({
        family: "Noto Sans SC",
        size: 14,
        text: row.task,
        weight: 620,
        x: taskX + 16,
        y: centerY - 7,
      }),
      svgText({
        color: palette.body,
        letterSpacing: 0.08,
        size: 8,
        text: `FLOW / ${String(rowIndex + 1).padStart(2, "0")}`,
        x: taskX + 16,
        y: centerY + 13,
      }),
      `<rect x="${ownerX + 18}" y="${centerY - 13}" width="62" height="26" rx="13" fill="${palette.sheetChrome}"/>`,
      svgText({
        anchor: "middle",
        color: palette.greenDark,
        letterSpacing: 0.04,
        size: 9,
        text: row.owner,
        weight: 750,
        x: ownerX + 49,
        y: centerY,
      }),
      `<rect x="${statusX + 14}" y="${centerY - 14}" width="${statusPillWidth}" height="28" rx="14" fill="${isQueued ? palette.sheetChrome : stateBackground}"/>`,
      statusContent,
      queuedLabel,
      `<rect x="${progressX + 16}" y="${centerY - 12}" width="${progressTrackWidth}" height="7" rx="4" fill="${palette.gridSoft}"/>`,
      `<rect x="${progressX + 16}" y="${centerY - 12}" width="${progressWidth}" height="7" rx="4" fill="${stateColor}" opacity="${isQueued ? 0 : 0.78}"/>`,
      svgText({
        color: isReview ? palette.coral : palette.body,
        size: 9,
        text: row.progressLabel,
        weight: 700,
        x: progressX + 16,
        y: centerY + 11,
      }),
      svgText({
        color: resultColor,
        letterSpacing: 0.04,
        size: 9,
        text: row.result,
        weight: isRunning ? 800 : 680,
        x: resultX + 16,
        y: centerY,
      }),
    ].join("");
  })
  .join("");

const selection = {
  height: rowHeight,
  width: (columnWidths[3] ?? 0) + (columnWidths[4] ?? 0),
  x: getColumnX(3),
  y: dataY + rowHeight * selectedRowIndex,
};

const spreadsheetSvg = [
  '<g transform="rotate(-3 1240 445)">',
  `<rect x="${sheet.x + 10}" y="${sheet.y - sheet.appBarHeight + 13}" width="${sheetWidth}" height="${sheetHeight + sheet.appBarHeight + 46}" fill="${palette.lime}" opacity="0.2"/>`,
  `<rect x="${sheet.x}" y="${sheet.y - sheet.appBarHeight}" width="${sheetWidth}" height="${sheetHeight + sheet.appBarHeight + 46}" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="2"/>`,
  `<rect x="${sheet.x}" y="${sheet.y - sheet.appBarHeight}" width="${sheetWidth}" height="${sheet.appBarHeight}" fill="${palette.greenDark}"/>`,
  `<rect x="${sheet.x}" y="${sheet.y - sheet.appBarHeight}" width="258" height="${sheet.appBarHeight}" fill="${palette.green}"/>`,
  `<rect x="${sheet.x + 20}" y="${sheet.y - 34}" width="20" height="18" fill="none" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 27}" y1="${sheet.y - 33}" x2="${sheet.x + 27}" y2="${sheet.y - 17}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 34}" y1="${sheet.y - 33}" x2="${sheet.x + 34}" y2="${sheet.y - 17}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 21}" y1="${sheet.y - 27}" x2="${sheet.x + 39}" y2="${sheet.y - 27}" stroke="${palette.paper}" stroke-width="2"/>`,
  svgText({
    color: palette.paper,
    letterSpacing: 0.1,
    size: 10,
    text: "AUTOMATION RUN / 024",
    weight: 750,
    x: sheet.x + 57,
    y: sheet.y - 25,
  }),
  `<circle cx="${sheet.x + sheetWidth - 302}" cy="${sheet.y - 25}" r="6" fill="${palette.lime}"/>`,
  svgText({
    color: "#D9F0E2",
    letterSpacing: 0.1,
    size: 9,
    text: "LIVE / 09:41:08",
    weight: 700,
    x: sheet.x + sheetWidth - 286,
    y: sheet.y - 25,
  }),
  `<rect x="${sheet.x}" y="${sheet.y}" width="${sheetWidth}" height="${sheet.formulaBarHeight}" fill="#F8FAF8" stroke="${palette.grid}" stroke-width="1"/>`,
  `<rect x="${sheet.x + 14}" y="${sheet.y + 10}" width="76" height="30" fill="${palette.paper}" stroke="${palette.grid}" stroke-width="1"/>`,
  svgText({
    anchor: "middle",
    color: palette.greenDark,
    size: 10,
    text: "D04:E04",
    weight: 750,
    x: sheet.x + 52,
    y: sheet.y + 25,
  }),
  svgText({
    color: palette.green,
    family: "Noto Sans SC",
    size: 18,
    text: "ƒx",
    weight: 750,
    x: sheet.x + 105,
    y: sheet.y + 25,
  }),
  `<rect x="${sheet.x + 140}" y="${sheet.y + 10}" width="${sheetWidth - 156}" height="30" fill="${palette.paper}" stroke="${palette.grid}" stroke-width="1"/>`,
  svgText({
    color: palette.body,
    letterSpacing: 0.02,
    size: 10,
    text: "=AUTOFLOW(Feedback_digest, RUN_024)",
    weight: 650,
    x: sheet.x + 158,
    y: sheet.y + 25,
  }),
  `<rect x="${sheet.x}" y="${gridY}" width="${sheet.rowHeaderWidth}" height="${sheet.columnHeaderHeight}" fill="${palette.green}" stroke="${palette.grid}" stroke-width="1"/>`,
  headerCells,
  sheetRows,
  automationCells,
  `<rect x="${selection.x}" y="${selection.y}" width="${selection.width}" height="${selection.height}" fill="${palette.lime}" fill-opacity="0.1" stroke="${palette.green}" stroke-width="4"/>`,
  `<rect x="${selection.x + selection.width - 7}" y="${selection.y + selection.height - 7}" width="14" height="14" fill="${palette.green}" stroke="${palette.paper}" stroke-width="2"/>`,
  `<line x1="${sheet.x}" y1="${dataY}" x2="${sheet.x + sheetWidth}" y2="${dataY}" stroke="${palette.greenDark}" stroke-width="2" opacity="0.28"/>`,
  `<rect x="${sheet.x}" y="${tabBarY}" width="${sheetWidth}" height="46" fill="#F7F9F7" stroke="${palette.grid}" stroke-width="1"/>`,
  `<rect x="${sheet.x + 66}" y="${tabBarY}" width="148" height="46" fill="${palette.paper}"/>`,
  `<rect x="${sheet.x + 66}" y="${tabBarY + 42}" width="148" height="4" fill="${palette.green}"/>`,
  svgText({
    color: palette.greenDark,
    letterSpacing: 0.05,
    size: 9,
    text: "ACTIVE FLOWS",
    weight: 750,
    x: sheet.x + 88,
    y: tabBarY + 23,
  }),
  `<circle cx="${sheet.x + 30}" cy="${tabBarY + 23}" r="8" fill="none" stroke="${palette.green}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 25}" y1="${tabBarY + 23}" x2="${sheet.x + 35}" y2="${tabBarY + 23}" stroke="${palette.green}" stroke-width="2"/>`,
  `<line x1="${sheet.x + 30}" y1="${tabBarY + 18}" x2="${sheet.x + 30}" y2="${tabBarY + 28}" stroke="${palette.green}" stroke-width="2"/>`,
  "</g>",
].join("");

const cursorPath = "M0 0 L2 142 L36 108 L68 174 L101 158 L69 94 L118 91 Z";
const cursorX = 1434;
const cursorY = 449;
const cursorScale = 0.78;

const clickEffectSvg = `<circle cx="${cursorX}" cy="${cursorY}" r="12" fill="${palette.lime}" fill-opacity="0.18" stroke="${palette.lime}" stroke-width="3"/>`;

const cursorSvg = [
  `<path d="${cursorPath}" transform="translate(${cursorX + 9} ${cursorY + 11}) scale(${cursorScale})" fill="${palette.lime}" stroke="${palette.lime}" stroke-width="8" stroke-linejoin="round"/>`,
  `<path d="${cursorPath}" transform="translate(${cursorX} ${cursorY}) scale(${cursorScale})" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round"/>`,
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

/** @type {(options: { color?: string; letterSpacing?: number; size?: number; text: string; width?: number; x: number; y: number }) => string} */
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

/** @type {(options: { align?: "center" | "left" | "right"; color?: string; family?: string; letterSpacing?: number; size?: number; text: string; weight?: number; width?: number; x: number; y: number }) => string} */
const sheetHtmlText = ({
  align = "left",
  color = palette.ink,
  family = "JetBrains Mono",
  letterSpacing = 0,
  size = 10,
  text,
  weight = 650,
  width = 160,
  x,
  y,
}) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${width}px;color:${color};font-family:${family};font-size:${size}px;font-weight:${weight};line-height:1;letter-spacing:${letterSpacing}em;text-align:${align};white-space:nowrap">${text}</div>`;

const sheetHeaderText = columnHeaders
  .map((header, columnIndex) =>
    sheetHtmlText({
      color: palette.body,
      letterSpacing: 0.09,
      size: 10,
      text: header,
      weight: 700,
      width: (columnWidths[columnIndex] ?? 0) - 28,
      x: getColumnX(columnIndex) + 14,
      y: gridY + 16,
    })
  )
  .join("");

const sheetRowText = automationRows
  .map((row, rowIndex) => {
    const centerY = dataY + rowIndex * rowHeight + rowHeight / 2;
    const isRunning = row.state === "RUNNING";
    const isReview = row.state === "REVIEW";
    const isSelected = rowIndex === selectedRowIndex;
    let stateColor = palette.green;
    let resultColor = palette.body;
    if (isReview) {
      stateColor = palette.coral;
      resultColor = palette.coral;
    } else if (isRunning) {
      resultColor = palette.greenDark;
    }
    const statusPillWidth = isRunning ? 104 : 86;
    return [
      sheetHtmlText({
        align: "center",
        color: isSelected ? palette.greenDark : palette.body,
        size: 10,
        text: String(rowIndex + 1).padStart(2, "0"),
        weight: isSelected ? 800 : 650,
        width: sheet.rowHeaderWidth,
        x: sheet.x,
        y: centerY - 5,
      }),
      sheetHtmlText({
        color: palette.body,
        size: 9,
        text: row.source,
        weight: 700,
        width: 92,
        x: getColumnX(0) + 32,
        y: centerY - 5,
      }),
      sheetHtmlText({
        family: "Noto Sans SC",
        size: 14,
        text: row.task,
        weight: 620,
        width: 196,
        x: getColumnX(1) + 16,
        y: centerY - 15,
      }),
      sheetHtmlText({
        color: palette.body,
        letterSpacing: 0.08,
        size: 8,
        text: `FLOW / ${String(rowIndex + 1).padStart(2, "0")}`,
        width: 120,
        x: getColumnX(1) + 16,
        y: centerY + 9,
      }),
      sheetHtmlText({
        align: "center",
        color: palette.greenDark,
        letterSpacing: 0.04,
        size: 9,
        text: row.owner,
        weight: 750,
        width: 62,
        x: getColumnX(2) + 18,
        y: centerY - 5,
      }),
      sheetHtmlText({
        align: "center",
        color: row.state === "QUEUED" ? palette.body : stateColor,
        letterSpacing: 0.04,
        size: 9,
        text: row.state,
        weight: 800,
        width: statusPillWidth,
        x: getColumnX(3) + 14,
        y: centerY - 5,
      }),
      sheetHtmlText({
        color: isReview ? palette.coral : palette.body,
        size: 9,
        text: row.progressLabel,
        weight: 700,
        width: 90,
        x: getColumnX(4) + 16,
        y: centerY + 6,
      }),
      sheetHtmlText({
        color: resultColor,
        letterSpacing: 0.04,
        size: 9,
        text: row.result,
        weight: isRunning ? 800 : 680,
        width: 150,
        x: getColumnX(5) + 16,
        y: centerY - 5,
      }),
    ].join("");
  })
  .join("");

const sheetChromeText = [
  sheetHtmlText({
    color: palette.paper,
    letterSpacing: 0.1,
    size: 10,
    text: "AUTOMATION RUN / 024",
    weight: 750,
    width: 190,
    x: sheet.x + 57,
    y: sheet.y - 30,
  }),
  sheetHtmlText({
    color: "#D9F0E2",
    letterSpacing: 0.1,
    size: 9,
    text: "LIVE / 09:41:08",
    weight: 700,
    width: 140,
    x: sheet.x + sheetWidth - 286,
    y: sheet.y - 30,
  }),
  sheetHtmlText({
    align: "center",
    color: palette.greenDark,
    size: 10,
    text: "D04:E04",
    weight: 750,
    width: 76,
    x: sheet.x + 14,
    y: sheet.y + 20,
  }),
  sheetHtmlText({
    color: palette.body,
    letterSpacing: 0.02,
    size: 10,
    text: "=AUTOFLOW(Feedback_digest, RUN_024)",
    width: 410,
    x: sheet.x + 158,
    y: sheet.y + 20,
  }),
  sheetHtmlText({
    color: palette.greenDark,
    letterSpacing: 0.05,
    size: 9,
    text: "ACTIVE FLOWS",
    weight: 750,
    width: 112,
    x: sheet.x + 88,
    y: tabBarY + 18,
  }),
].join("");

const sheetTextLayer = `<div style="position:absolute;left:0;top:0;width:${canvas.width}px;height:${canvas.height}px;transform:rotate(-3deg);transform-origin:1240px 445px">${sheetChromeText}${sheetHeaderText}${sheetRowText}</div>`;

const metrics = [
  ["42 / 48", "TASKS COMPLETE"],
  ["00", "MANUAL STEPS"],
  ["09:41", "LAST SYNC"],
]
  .map(
    ([value, metricLabel], index) =>
      `<div style="position:absolute;left:${80 + index * 174}px;top:438px;width:148px;border-top:2px solid ${index === 0 ? palette.green : palette.grid};padding-top:16px"><div style="font-family:JetBrains Mono;font-size:27px;font-weight:760;line-height:1;color:${index === 0 ? palette.greenDark : palette.ink};letter-spacing:-0.035em">${value}</div><div style="margin-top:11px;font-family:JetBrains Mono;font-size:9px;font-weight:700;line-height:1.2;color:${palette.body};letter-spacing:0.11em">${metricLabel}</div></div>`
  )
  .join("");

const textLayer = [
  label({
    color: palette.greenDark,
    text: "GRID OPERATOR / RUN 024",
    width: 390,
    x: 80,
    y: 70,
  }),
  `<div style="position:absolute;left:76px;top:130px;width:650px;color:${palette.ink};font-family:Noto Sans SC;font-size:82px;font-weight:820;line-height:0.98;letter-spacing:-0.055em;white-space:nowrap">让工作自己流转</div>`,
  `<div style="position:absolute;left:80px;top:260px;width:600px;color:${palette.greenDark};font-family:Noto Sans SC;font-size:34px;font-weight:650;line-height:1.2;letter-spacing:-0.025em">一次编排，持续执行</div>`,
  `<div style="position:absolute;left:80px;top:330px;width:530px;color:${palette.body};font-family:Noto Sans SC;font-size:18px;font-weight:450;line-height:1.6">邮件触发任务，表格记录进度，文档自动交付。<br/>每一步都在同一条流程里继续发生。</div>`,
  metrics,
  `<div style="position:absolute;left:80px;top:592px;width:496px;border-left:3px solid ${palette.lime};padding-left:18px">`,
  `<div style="font-family:JetBrains Mono;font-size:10px;font-weight:750;line-height:1.2;letter-spacing:0.12em;color:${palette.greenDark}">CURRENT / FEEDBACK DIGEST</div>`,
  `<div style="margin-top:12px;font-family:Noto Sans SC;font-size:20px;font-weight:620;line-height:1.25;color:${palette.ink}">正在处理客户反馈</div>`,
  `<div style="margin-top:8px;font-family:JetBrains Mono;font-size:11px;font-weight:700;line-height:1.2;letter-spacing:0.06em;color:${palette.body}">18 OF 24 RECORDS · 6 LEFT</div>`,
  `<div style="margin-top:18px;width:360px;height:6px;border-radius:3px;background:${palette.gridSoft}"><div style="width:270px;height:6px;border-radius:3px;background:${palette.green}"></div></div>`,
  "</div>",
  label({
    text: "RUN 024 / 6 FLOWS / 48 TASKS",
    width: 380,
    x: 80,
    y: 850,
  }),
  label({
    color: palette.greenDark,
    text: "SELECTED / FEEDBACK DIGEST",
    width: 320,
    x: 1248,
    y: 850,
  }),
].join("");

const html = `<div style="position:relative;width:100%;height:100%;overflow:hidden;background:${palette.canvas};color:${palette.ink};font-family:Noto Sans SC">${illustrationSvg}${sheetTextLayer}${textLayer}</div>`;

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
