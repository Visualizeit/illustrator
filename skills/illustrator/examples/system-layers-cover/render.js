import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.js";

const canvas = { height: 1400, width: 1400 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();
const theme = await loadTheme(new URL("theme.css", import.meta.url));
const type = {
  layerLabel: theme.number("text-layer-label"),
};

const palette = {
  graphite: theme.color("graphite"),
  ink: theme.color("ink"),
  layerFiveFront: theme.color("layer-four-front"),
  layerFiveTop: theme.color("layer-four"),
  layerFourFront: theme.color("layer-three-front"),
  layerFourTop: theme.color("layer-three"),
  layerThreeFront: theme.color("layer-two-front"),
  layerThreeTop: theme.color("layer-two"),
  layerTop: theme.color("layer-top"),
  layerTwoFront: theme.color("layer-one-front"),
  layerTwoTop: theme.color("layer-one"),
  mid: theme.color("mid"),
  paper: theme.color("paper"),
  rule: theme.color("rule"),
  shadow: theme.color("shadow"),
  signal: theme.color("signal"),
  signalDark: theme.color("signal-dark"),
  white: theme.color("white"),
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
    `<polygon points="${x + 45 * scale},${y + 300 * scale} ${x + 520 * scale},${y + 268 * scale} ${x + 700 * scale},${y + 410 * scale} ${x + 140 * scale},${y + 465 * scale}" fill="${palette.shadow}" opacity=".6"/>`,
    layer(248, palette.signal, palette.signalDark),
    layer(199, palette.layerFiveTop, palette.layerFiveFront),
    layer(150, palette.layerFourTop, palette.layerFourFront),
    layer(101, palette.layerThreeTop, palette.layerThreeFront),
    layer(52, palette.layerTwoTop, palette.layerTwoFront),
    `<polygon points="${x + 20 * scale},${y + 52 * scale} ${x + 510 * scale},${y + 18 * scale} ${x + 640 * scale},${y + 217 * scale} ${x + 145 * scale},${y + 252 * scale}" fill="${palette.layerTop}" stroke="${palette.ink}" stroke-width="${2.2 * scale}"/>`,
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
      return `<div style="position:absolute;left:${x + (180 + shift) * scale}px;top:${y + (offset + 199) * scale}px;transform:rotate(-4deg);font-family:var(--font-mono);font-size:${type.layerLabel * scale}px;font-weight:var(--font-weight-layer);letter-spacing:${3.1 * scale}px;color:${color}">${label}</div>`;
    })
    .join("");
};

const html = [
  '<div style="width:100%;height:100%;position:relative;overflow:hidden;background:var(--color-paper);color:var(--color-ink);font-family:var(--font-display)">',
  '<div style="position:absolute;inset:31px;border:1px dashed var(--color-rule)"></div>',
  '<div style="position:absolute;left:85px;right:85px;top:69px;height:45px;border-bottom:3px solid var(--color-ink);display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:var(--text-header);font-weight:var(--font-weight-header);letter-spacing:.22em">',
  '<span>OPENCODE / SYSTEM REVIEW</span><span style="font-size:var(--text-kicker);color:var(--color-graphite)">COVER CONCEPT 04</span>',
  "</div>",
  '<div style="position:absolute;left:86px;top:157px;font-size:var(--text-display);font-weight:var(--font-weight-display);line-height:var(--leading-display);letter-spacing:var(--tracking-display)">为什么我不推荐使用</div>',
  '<img src="asset:wordmark" style="position:absolute;left:85px;top:260px;width:760px;height:137px;object-fit:contain;object-position:left top"/>',
  layerStackSvg({ scale: 1.47, x: 232, y: 489 }),
  layerLabels({ scale: 1.47, x: 232, y: 489 }),
  '<div style="position:absolute;left:85px;bottom:63px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-meta);line-height:1.75;letter-spacing:.18em;color:var(--color-mid)">AGENT HARNESS / SYSTEM LAYERS<br/>SOURCE SNAPSHOT / baef5cd4</div>',
  '<div style="position:absolute;right:85px;bottom:72px;font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-label);letter-spacing:.16em;color:var(--color-graphite)">FIVE LAYERS / ONE SHELL</div>',
  "</div>",
].join("");
const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  images: [{ data: wordmark, src: "asset:wordmark" }],
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
