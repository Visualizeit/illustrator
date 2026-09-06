import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.mjs";

const canvas = { height: 1400, width: 1400 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();
const theme = await loadTheme(new URL("theme.css", import.meta.url));
const type = {
  layerLabel: theme.number("text-layer-label"),
};

const palette = {
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
  shadow: theme.color("shadow"),
  signal: theme.color("signal"),
  signalDark: theme.color("signal-dark"),
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
    [52, "PROMPT", "ink"],
    [101, "CONTEXT", "ink"],
    [150, "AGENT", "white"],
    [199, "PERMISSION", "white"],
    [248, "SHELL", "white"],
  ];

  return labels
    .map(([offset, label, color]) => {
      const shift = (offset - 52) * 0.4;
      return `<div tw="absolute font-mono text-${color}" style="left:${x + (180 + shift) * scale}px;top:${y + (offset + 199) * scale}px;transform:rotate(-4deg);font-size:${type.layerLabel * scale}px;font-weight:var(--font-weight-layer);letter-spacing:${3.1 * scale}px">${label}</div>`;
    })
    .join("");
};

const html = [
  '<div tw="w-full h-full relative overflow-hidden bg-paper text-ink font-display">',
  '<div tw="absolute border-rule border border-dashed" style="inset:31px"></div>',
  '<div tw="absolute left-gutter right-gutter flex justify-between font-mono text-header flex-row border-b-ink border-b-3" style="top:69px;height:45px;font-weight:var(--font-weight-header);letter-spacing:var(--tracking-kicker)">',
  '<span>OPENCODE / SYSTEM REVIEW</span><span tw="text-kicker text-graphite">COVER CONCEPT 04</span>',
  "</div>",
  '<div tw="absolute text-display leading-display tracking-display" style="left:86px;top:157px;font-weight:var(--font-weight-display)">为什么我不推荐使用</div>',
  '<img src="asset:wordmark" tw="absolute left-gutter object-contain" style="top:260px;width:760px;height:137px;object-position:left top">',
  layerStackSvg({ scale: 1.47, x: 232, y: 489 }),
  layerLabels({ scale: 1.47, x: 232, y: 489 }),
  '<div tw="absolute left-gutter font-mono text-meta text-mid" style="bottom:63px;font-weight:var(--font-weight-meta);line-height:var(--leading-airy);letter-spacing:var(--tracking-meta)">AGENT HARNESS / SYSTEM LAYERS<br/>SOURCE SNAPSHOT / baef5cd4</div>',
  '<div tw="absolute right-gutter font-mono text-label text-graphite" style="bottom:72px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-label)">FIVE LAYERS / ONE SHELL</div>',
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
