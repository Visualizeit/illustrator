import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

const canvas = { height: 900, width: 1600 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();

const palette = {
  blue: "#315EF5",
  coral: "#F05A45",
  cyan: "#35B7A5",
  graphite: "#6F746F",
  ink: "#121713",
  paper: "#FAFAF8",
  rule: "#D7D9D5",
  yellow: "#F3D34A",
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
  "left:70px",
  "top:251px",
  "width:1460px",
  "font-family:Noto Sans SC",
  "font-size:178px",
  "font-weight:860",
  "line-height:0.9",
  "letter-spacing:-0.061em",
  "white-space:nowrap",
].join(";");

/** @type {(options: { color: string; height: number; left: number; top: number; width: number }) => string} */
const alignedFragment = ({ color, height, left, top, width }) =>
  [
    `<div style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;overflow:hidden">`,
    `<div style="${titleStyle};left:${70 - left}px;top:${251 - top}px;color:${color}">ILLUSTRATOR</div>`,
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

const swatches = [
  ["SIGNAL 01", palette.yellow, "#F3D34A"],
  ["SIGNAL 02", palette.coral, "#F05A45"],
  ["SIGNAL 03", palette.blue, "#315EF5"],
  ["SIGNAL 04", palette.cyan, "#35B7A5"],
]
  .map(
    ([name, color, value], index) =>
      `<div style="position:absolute;left:${70 + index * 154}px;top:735px;width:136px"><div style="width:136px;height:18px;background:${color}"></div><div style="margin-top:11px;font-family:JetBrains Mono;font-size:10px;font-weight:650;line-height:1.45;letter-spacing:0.08em;color:${palette.graphite}">${name}<br/>${value}</div></div>`
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
      `<div style="position:absolute;left:${736 + index * 204}px;top:735px;width:188px;border-top:2px solid ${index === 3 ? palette.coral : palette.ink};padding-top:11px"><div style="font-family:JetBrains Mono;font-size:10px;font-weight:700;letter-spacing:0.12em;color:${palette.graphite}">${label}</div><div style="margin-top:8px;font-family:JetBrains Mono;font-size:12px;font-weight:700;letter-spacing:0.05em;color:${palette.ink}">${value}</div></div>`
  )
  .join("");

const html = [
  `<div style="width:100%;height:100%;position:relative;overflow:hidden;background:${palette.paper};color:${palette.ink};font-family:Noto Sans SC">`,
  guideSvg,
  `<div style="position:absolute;left:70px;top:49px;font-family:JetBrains Mono;font-size:12px;font-weight:700;letter-spacing:0.15em">ILLUSTRATOR / RENDER SPECIMEN 001</div>`,
  `<div style="position:absolute;right:70px;top:49px;width:430px;font-family:JetBrains Mono;font-size:11px;font-weight:650;letter-spacing:0.12em;text-align:right;color:${palette.graphite}">CODE-DRIVEN · BROWSERLESS · REPRODUCIBLE</div>`,
  `<div style="position:absolute;left:70px;top:137px;width:680px;font-size:29px;font-weight:620;line-height:1.25;letter-spacing:-0.026em">A designed image, shown as its own construction.</div>`,
  `<div style="position:absolute;right:70px;top:139px;width:500px;font-size:15px;font-weight:430;line-height:1.55;text-align:right;color:${palette.graphite}">Natural-language direction becomes a precise, local and repeatable<br/>visual system.</div>`,
  `<div style="${titleStyle};color:${palette.ink}">ILLUSTRATOR</div>`,
  alignedFragment({
    color: palette.yellow,
    height: 47,
    left: 62,
    top: 254,
    width: 390,
  }),
  alignedFragment({
    color: palette.coral,
    height: 38,
    left: 394,
    top: 361,
    width: 360,
  }),
  alignedFragment({
    color: palette.blue,
    height: 34,
    left: 774,
    top: 287,
    width: 390,
  }),
  alignedFragment({
    color: palette.cyan,
    height: 47,
    left: 1005,
    top: 378,
    width: 255,
  }),
  `<div style="position:absolute;left:68px;top:212px;font-family:JetBrains Mono;font-size:9px;font-weight:700;letter-spacing:0.1em;color:${palette.graphite}">000</div>`,
  `<div style="position:absolute;right:68px;top:212px;font-family:JetBrains Mono;font-size:9px;font-weight:700;letter-spacing:0.1em;color:${palette.graphite};text-align:right">1460</div>`,
  `<div style="position:absolute;left:83px;top:252px;font-family:JetBrains Mono;font-size:9px;font-weight:700;letter-spacing:0.12em;color:${palette.blue}">CAP HEIGHT</div>`,
  `<div style="position:absolute;left:83px;top:407px;font-family:JetBrains Mono;font-size:9px;font-weight:700;letter-spacing:0.12em;color:${palette.coral}">BASELINE</div>`,
  `<div style="position:absolute;left:70px;top:485px;width:250px;font-family:JetBrains Mono;font-size:11px;font-weight:700;line-height:1.55;letter-spacing:0.1em;color:${palette.coral}">01 / GLYPH SLICE<br/><span style="color:${palette.graphite}">ALIGNED CROP</span></div>`,
  `<div style="position:absolute;left:696px;top:510px;width:240px;font-family:JetBrains Mono;font-size:11px;font-weight:700;line-height:1.55;letter-spacing:0.1em;color:${palette.blue};text-align:center">02 / TYPE SYSTEM<br/><span style="color:${palette.graphite}">WEIGHT 860</span></div>`,
  `<div style="position:absolute;right:70px;top:493px;width:260px;font-family:JetBrains Mono;font-size:11px;font-weight:700;line-height:1.55;letter-spacing:0.1em;color:${palette.cyan};text-align:right">03 / OUTPUT LAYER<br/><span style="color:${palette.graphite}">RENDER / PNG</span></div>`,
  `<div style="position:absolute;left:70px;top:596px;width:1030px;font-size:42px;font-weight:660;line-height:1.05;letter-spacing:-0.038em">From direction to designed image.</div>`,
  `<div style="position:absolute;right:70px;top:596px;width:390px;font-family:JetBrains Mono;font-size:11px;font-weight:650;line-height:1.65;letter-spacing:0.08em;text-align:right;color:${palette.graphite}">DIRECTION → STRUCTURE → RENDER<br/>NO IMAGE-GENERATION MODEL REQUIRED</div>`,
  swatches,
  metricColumns,
  `<div style="position:absolute;left:70px;bottom:34px;font-family:JetBrains Mono;font-size:10px;font-weight:650;letter-spacing:0.12em;color:${palette.graphite}">VISUALIZEIT / ILLUSTRATOR</div>`,
  `<div style="position:absolute;right:70px;bottom:34px;font-family:JetBrains Mono;font-size:10px;font-weight:650;letter-spacing:0.12em;text-align:right;color:${palette.graphite}">DESIGNED IMAGES · LOCALLY RENDERED</div>`,
  "</div>",
].join("");

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
