import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.mjs";

const canvas = { height: 900, width: 1600 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();
const theme = await loadTheme(new URL("theme.css", import.meta.url));

const palette = {
  blue: theme.color("blue"),
  coral: theme.color("coral"),
  cyan: theme.color("cyan"),
  graphite: theme.color("graphite"),
  ink: theme.color("ink"),
  paper: theme.color("paper"),
  rule: theme.color("rule"),
  yellow: theme.color("yellow"),
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

const titleStyle = [
  "position:absolute",
  "left:var(--spacing-gutter)",
  "top:251px",
  "width:1460px",
  "font-family:var(--font-display)",
  "font-size:var(--text-display)",
  "font-weight:var(--font-weight-display)",
  "line-height:var(--leading-display)",
  "letter-spacing:var(--tracking-display)",
  "white-space:nowrap",
].join(";");

/** @type {(options: { color: string; height: number; left: number; top: number; width: number }) => string} */
const alignedFragment = ({ color, height, left, top, width }) =>
  [
    `<div tw="absolute overflow-hidden" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px">`,
    `<div style="${titleStyle};left:${70 - left}px;top:${251 - top}px" tw="text-${color}">ILLUSTRATOR</div>`,
    "</div>",
  ].join("");

/** @type {Array<[number, number]>} */
const registrationMarkPositions = [
  [42, 42],
  [1558, 42],
  [42, 858],
  [1558, 858],
];
const registrationMarks = registrationMarkPositions
  .map(
    ([x, y]) =>
      `<path d="M${x - 9} ${y}H${x + 9}M${x} ${y - 9}V${y + 9}" stroke="${palette.graphite}" stroke-width="1" opacity="0.5"/>`
  )
  .join("");

const topTicks = Array.from({ length: 29 }, (_, index) => {
  const x = 70 + index * 51;
  const height = index % 4 === 0 ? 12 : 6;
  return `<line x1="${x}" y1="222" x2="${x}" y2="${222 + height}" stroke="${palette.graphite}" stroke-width="1"/>`;
}).join("");

const guideSvg = [
  `<svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" style="position:absolute;left:0;top:0">`,
  `<rect width="${canvas.width}" height="${canvas.height}" fill="${palette.paper}"/>`,
  registrationMarks,
  `<line x1="42" y1="101" x2="1558" y2="101" stroke="${palette.ink}" stroke-width="1.5"/>`,
  `<line x1="42" y1="690" x2="1558" y2="690" stroke="${palette.ink}" stroke-width="1.5"/>`,
  `<line x1="70" y1="222" x2="1530" y2="222" stroke="${palette.rule}" stroke-width="1"/>`,
  topTicks,
  `<line x1="70" y1="271" x2="1530" y2="271" stroke="${palette.blue}" stroke-width="1.5" stroke-dasharray="7 8" opacity="0.62"/>`,
  `<line x1="70" y1="403" x2="1530" y2="403" stroke="${palette.coral}" stroke-width="2" opacity="0.75"/>`,
  `<line x1="70" y1="421" x2="1530" y2="421" stroke="${palette.graphite}" stroke-width="1" stroke-dasharray="3 7" opacity="0.55"/>`,
  `<line x1="70" y1="242" x2="70" y2="446" stroke="${palette.ink}"/>`,
  `<line x1="1530" y1="242" x2="1530" y2="446" stroke="${palette.ink}"/>`,
  `<path d="M70 252v-10h10M1520 242h10v10M70 436v10h10M1520 446h10v-10" fill="none" stroke="${palette.ink}" stroke-width="2"/>`,
  `<rect x="62" y="263" width="16" height="16" fill="${palette.paper}" stroke="${palette.blue}" stroke-width="2"/>`,
  `<rect x="1522" y="395" width="16" height="16" fill="${palette.cyan}" stroke="${palette.ink}" stroke-width="2"/>`,
  `<path d="M180 468H418V446M418 446h14" fill="none" stroke="${palette.coral}" stroke-width="1.5"/>`,
  `<circle cx="180" cy="468" r="4" fill="${palette.coral}"/>`,
  `<path d="M809 494V449M809 449h18" fill="none" stroke="${palette.blue}" stroke-width="1.5"/>`,
  `<circle cx="809" cy="494" r="4" fill="${palette.blue}"/>`,
  `<path d="M1395 476H1257V446M1257 446h-16" fill="none" stroke="${palette.cyan}" stroke-width="1.5"/>`,
  `<circle cx="1395" cy="476" r="4" fill="${palette.cyan}"/>`,
  `<path d="M117 320h20M127 310v20" stroke="${palette.yellow}" stroke-width="3"/>`,
  `<path d="M1467 352h20M1477 342v20" stroke="${palette.coral}" stroke-width="3"/>`,
  "</svg>",
].join("");

/** @type {Array<[string, string]>} */
const swatchColors = [
  ["SIGNAL 01", "yellow"],
  ["SIGNAL 02", "coral"],
  ["SIGNAL 03", "blue"],
  ["SIGNAL 04", "cyan"],
];
const swatches = swatchColors
  .map(
    ([name, color], index) =>
      `<div tw="absolute" style="left:${70 + index * 154}px;top:735px;width:136px"><div style="width:136px;height:18px" tw="bg-${color}"></div><div tw="font-mono text-label text-graphite" style="margin-top:11px;font-weight:var(--font-weight-strong);line-height:var(--leading-label);letter-spacing:var(--tracking-small)">${name}<br/>${theme.color(color)}</div></div>`
  )
  .join("");

const metricColumns = [
  ["CANVAS", "1600 × 900"],
  ["DISPLAY", "NOTO SANS SC / 860"],
  ["TRACKING", "−0.061 EM"],
  ["OUTPUT", "PNG / LOCAL"],
]
  .map(
    ([label, value], index) =>
      `<div tw="absolute border-t-${index === 3 ? "coral" : "ink"} border-t-2" style="left:${736 + index * 204}px;top:735px;width:188px;padding-top:11px"><div tw="font-mono text-label text-graphite" style="font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-label)">${label}</div><div tw="font-mono text-caption text-ink" style="margin-top:8px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-caption)">${value}</div></div>`
  )
  .join("");

const html = [
  `<div tw="w-full h-full relative overflow-hidden font-display bg-paper text-ink">`,
  guideSvg,
  `<div tw="absolute left-gutter font-mono text-caption" style="top:49px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-header)">ILLUSTRATOR / RENDER SPECIMEN 001</div>`,
  `<div tw="absolute right-gutter font-mono text-kicker text-right text-graphite" style="top:49px;width:430px;font-weight:var(--font-weight-strong);letter-spacing:var(--tracking-label)">CODE-DRIVEN · BROWSERLESS · REPRODUCIBLE</div>`,
  '<div tw="absolute left-gutter text-intro" style="top:137px;width:680px;font-weight:var(--font-weight-intro);line-height:var(--leading-note);letter-spacing:var(--tracking-title)">A designed image, shown as its own construction.</div>',
  '<div tw="absolute right-gutter text-body text-graphite text-right" style="top:139px;width:500px;font-weight:var(--font-weight-body);line-height:var(--leading-body)">Natural-language direction becomes a precise, local and repeatable<br/>visual system.</div>',
  `<div style="${titleStyle}" tw="text-ink">ILLUSTRATOR</div>`,
  alignedFragment({
    color: "yellow",
    height: 47,
    left: 62,
    top: 254,
    width: 390,
  }),
  alignedFragment({
    color: "coral",
    height: 38,
    left: 394,
    top: 361,
    width: 360,
  }),
  alignedFragment({
    color: "blue",
    height: 34,
    left: 774,
    top: 287,
    width: 390,
  }),
  alignedFragment({
    color: "cyan",
    height: 47,
    left: 1005,
    top: 378,
    width: 255,
  }),
  `<div tw="absolute font-mono text-meta text-graphite" style="left:68px;top:212px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-meta)">000</div>`,
  `<div tw="absolute font-mono text-meta text-graphite text-right" style="right:68px;top:212px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-meta)">1460</div>`,
  `<div tw="absolute font-mono text-meta text-blue" style="left:83px;top:252px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-label)">CAP HEIGHT</div>`,
  `<div tw="absolute font-mono text-meta text-coral" style="left:83px;top:407px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-label)">BASELINE</div>`,
  `<div tw="absolute left-gutter font-mono text-kicker text-coral" style="top:485px;width:250px;font-weight:var(--font-weight-meta);line-height:var(--leading-body);letter-spacing:var(--tracking-meta)">01 / GLYPH SLICE<br/><span tw="text-graphite">ALIGNED CROP</span></div>`,
  `<div tw="absolute font-mono text-kicker text-blue text-center" style="left:696px;top:510px;width:240px;font-weight:var(--font-weight-meta);line-height:var(--leading-body);letter-spacing:var(--tracking-meta)">02 / TYPE SYSTEM<br/><span tw="text-graphite">WEIGHT 860</span></div>`,
  `<div tw="absolute right-gutter font-mono text-kicker text-cyan text-right" style="top:493px;width:260px;font-weight:var(--font-weight-meta);line-height:var(--leading-body);letter-spacing:var(--tracking-meta)">03 / OUTPUT LAYER<br/><span tw="text-graphite">RENDER / PNG</span></div>`,
  '<div tw="absolute left-gutter text-statement leading-statement tracking-statement" style="top:596px;width:1030px;font-weight:var(--font-weight-statement)">From direction to designed image.</div>',
  `<div tw="absolute right-gutter font-mono text-kicker text-right text-graphite" style="top:596px;width:390px;font-weight:var(--font-weight-strong);line-height:var(--leading-meta);letter-spacing:var(--tracking-small)">DIRECTION → STRUCTURE → RENDER<br/>NO IMAGE-GENERATION MODEL REQUIRED</div>`,
  swatches,
  metricColumns,
  `<div tw="absolute left-gutter font-mono text-label text-graphite" style="bottom:34px;font-weight:var(--font-weight-strong);letter-spacing:var(--tracking-label)">VISUALIZEIT / ILLUSTRATOR</div>`,
  `<div tw="absolute right-gutter font-mono text-label text-right text-graphite" style="bottom:34px;font-weight:var(--font-weight-strong);letter-spacing:var(--tracking-label)">DESIGNED IMAGES · LOCALLY RENDERED</div>`,
  "</div>",
].join("");
const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
