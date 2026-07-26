import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

const canvas = { height: 1400, width: 1400 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();

const palette = {
  graphite: "#656161",
  ink: "#211E1E",
  mid: "#989292",
  paper: "#F1ECEC",
  rule: "#C7C1C1",
  signal: "#E65A47",
  signalDark: "#B93C2F",
  white: "#FAF8F7",
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

const wordmark = await readFile(new URL("source.svg", import.meta.url));

/** @typedef {{ scale: number; x: number; y: number }} StackPosition */

/** @param {StackPosition} position - Canvas position and scale. */
const layerStackSvg = ({ scale, x, y }) => {
  /**
   * @param {number} offset - Vertical layer offset.
   * @param {string} top - Top-face fill color.
   * @param {string} front - Front-face fill color.
   */
  const layer = (offset, top, front) => {
    const shift = (offset - 52) * 0.4;
    return [
      `<polygon points="${x + (20 + shift) * scale},${y + offset * scale} ${x + (510 + shift) * scale},${y + (offset - 34) * scale} ${x + (640 + shift) * scale},${y + (offset + 165) * scale} ${x + (145 + shift) * scale},${y + (offset + 200) * scale}" fill="${top}" stroke="${palette.ink}" stroke-width="${2.2 * scale}"/>`,
      `<polygon points="${x + (145 + shift) * scale},${y + (offset + 200) * scale} ${x + (640 + shift) * scale},${y + (offset + 165) * scale} ${x + (640 + shift) * scale},${y + (offset + 196) * scale} ${x + (145 + shift) * scale},${y + (offset + 231) * scale}" fill="${front}" stroke="${palette.ink}" stroke-width="${2.2 * scale}"/>`,
    ].join("");
  };

  return [
    '<svg width="1800" height="1400" viewBox="0 0 1800 1400" style="position:absolute;left:0;top:0;overflow:visible">',
    `<polygon points="${x + 45 * scale},${y + 300 * scale} ${x + 520 * scale},${y + 268 * scale} ${x + 700 * scale},${y + 410 * scale} ${x + 140 * scale},${y + 465 * scale}" fill="#D7D1D1" opacity=".6"/>`,
    layer(248, palette.signal, palette.signalDark),
    layer(199, "#4A4646", "#2D2929"),
    layer(150, "#716D6D", "#4B4747"),
    layer(101, "#AAA5A5", "#8A8585"),
    layer(52, "#D8D3D3", "#BBB5B5"),
    `<polygon points="${x + 20 * scale},${y + 52 * scale} ${x + 510 * scale},${y + 18 * scale} ${x + 640 * scale},${y + 217 * scale} ${x + 145 * scale},${y + 252 * scale}" fill="#E5E0E0" stroke="${palette.ink}" stroke-width="${2.2 * scale}"/>`,
    "</svg>",
  ].join("");
};

/** @param {StackPosition} position - Canvas position and scale. */
const layerLabels = ({ scale, x, y }) => {
  /** @type {Array<[number, string, string]>} */
  const labels = [
    [52, "PROMPT", palette.ink],
    [101, "CONTEXT", palette.ink],
    [150, "AGENT", palette.white],
    [199, "PERMISSION", palette.white],
    [248, "SHELL", palette.white],
  ];

  return labels
    .map(([offset, label, color]) => {
      const shift = (offset - 52) * 0.4;
      return `<div style="position:absolute;left:${x + (180 + shift) * scale}px;top:${y + (offset + 199) * scale}px;transform:rotate(-4deg);font-family:'JetBrains Mono','Noto Sans SC';font-size:${14 * scale}px;font-weight:750;letter-spacing:${3.1 * scale}px;color:${color}">${label}</div>`;
    })
    .join("");
};

const html = [
  `<div style="width:100%;height:100%;position:relative;overflow:hidden;background:${palette.paper};color:${palette.ink};font-family:'Noto Sans SC'">`,
  `<div style="position:absolute;inset:31px;border:1px dashed ${palette.rule}"></div>`,
  `<div style="position:absolute;left:85px;right:85px;top:69px;height:45px;border-bottom:3px solid ${palette.ink};display:flex;justify-content:space-between;font-family:'JetBrains Mono','Noto Sans SC';font-size:17px;font-weight:700;letter-spacing:.22em">`,
  `<span>OPENCODE / SYSTEM REVIEW</span><span style="font-size:14px;color:${palette.graphite}">COVER CONCEPT 04</span>`,
  "</div>",
  '<div style="position:absolute;left:86px;top:157px;font-size:68px;font-weight:780;line-height:1.1;letter-spacing:-.045em">为什么我不推荐使用</div>',
  '<img src="asset:wordmark" style="position:absolute;left:85px;top:260px;width:760px;height:137px;object-fit:contain;object-position:left top"/>',
  layerStackSvg({ scale: 1.47, x: 232, y: 489 }),
  layerLabels({ scale: 1.47, x: 232, y: 489 }),
  `<div style="position:absolute;left:85px;bottom:63px;font-family:'JetBrains Mono','Noto Sans SC';font-size:11px;font-weight:700;line-height:1.75;letter-spacing:.18em;color:${palette.mid}">AGENT HARNESS / SYSTEM LAYERS<br/>SOURCE SNAPSHOT / baef5cd4</div>`,
  `<div style="position:absolute;right:85px;bottom:72px;font-family:'JetBrains Mono','Noto Sans SC';font-size:12px;font-weight:700;letter-spacing:.16em;color:${palette.graphite}">FIVE LAYERS / ONE SHELL</div>`,
  "</div>",
].join("");

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  images: [{ data: wordmark, src: "asset:wordmark" }],
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
