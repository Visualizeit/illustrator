import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.js";

// Photo by Kelly on Pexels:
// https://www.pexels.com/photo/2563742/
const canvas = { height: 1350, width: 1080 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();

const theme = await loadTheme(new URL("theme.css", import.meta.url));
const palette = {
  graphite: theme.color("graphite"),
  ink: theme.color("ink"),
  label: theme.color("label"),
  moss: theme.color("moss"),
  paper: theme.color("paper"),
  rule: theme.color("rule"),
  signal: theme.color("signal"),
  specimen: theme.color("specimen"),
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

const specimen = await readFile(new URL("source.png", import.meta.url));

const measurementTicks = [355, 730, 1105]
  .map(
    (y) =>
      `<line x1="930" y1="${y}" x2="952" y2="${y}" stroke="${palette.graphite}" stroke-width="1.5"/>`
  )
  .join("");

/** @type {Array<[number, number]>} */
const registrationMarkPositions = [
  [72, 72],
  [1008, 72],
  [72, 1278],
  [1008, 1278],
];
const registrationMarks = registrationMarkPositions
  .map(
    ([x, y]) =>
      `<path d="M${x - 10} ${y} H${x + 10} M${x} ${y - 10} V${y + 10}" stroke="${palette.graphite}" stroke-width="1" opacity="0.6"/>`
  )
  .join("");

const archiveSvg = [
  `<svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" style="position:absolute;left:0;top:0">`,
  `<rect x="0" y="0" width="${canvas.width}" height="${canvas.height}" fill="${palette.paper}"/>`,
  `<rect x="70" y="112" width="938" height="1" fill="${palette.ink}" opacity="0.7"/>`,
  `<rect x="70" y="1228" width="938" height="1" fill="${palette.ink}" opacity="0.7"/>`,
  `<line x1="952" y1="330" x2="952" y2="1130" stroke="${palette.graphite}" stroke-width="1" opacity="0.75"/>`,
  measurementTicks,
  `<line x1="88" y1="455" x2="394" y2="455" stroke="${palette.moss}" stroke-width="1.5"/>`,
  `<circle cx="394" cy="455" r="5" fill="${palette.paper}" stroke="${palette.moss}" stroke-width="2"/>`,
  `<line x1="88" y1="704" x2="365" y2="704" stroke="${palette.signal}" stroke-width="2"/>`,
  `<circle cx="365" cy="704" r="7" fill="${palette.signal}" stroke="${palette.paper}" stroke-width="3"/>`,
  `<line x1="119" y1="990" x2="430" y2="990" stroke="${palette.moss}" stroke-width="1.5"/>`,
  `<circle cx="430" cy="990" r="5" fill="${palette.paper}" stroke="${palette.moss}" stroke-width="2"/>`,
  `<path d="M84 455 H70 V509" fill="none" stroke="${palette.moss}" stroke-width="1.5"/>`,
  `<path d="M84 704 H70 V758" fill="none" stroke="${palette.signal}" stroke-width="2"/>`,
  `<path d="M115 990 H101 V1044" fill="none" stroke="${palette.moss}" stroke-width="1.5"/>`,
  registrationMarks,
  "</svg>",
].join("");

const html = [
  '<div style="width:100%;height:100%;position:relative;overflow:hidden;background:var(--color-paper);color:var(--color-ink);font-family:var(--font-display)">',
  archiveSvg,
  '<div style="position:absolute;left:70px;top:72px;font-family:var(--font-mono);font-size:var(--text-kicker);font-weight:var(--font-weight-kicker);letter-spacing:var(--tracking-kicker);color:var(--color-moss)">FIELD ARCHIVE · NOTE 024</div>',
  '<div style="position:absolute;right:72px;top:72px;font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-kicker);letter-spacing:0.13em;color:var(--color-graphite);text-align:right">FORM / TEXTURE / TRACE</div>',
  '<div style="position:absolute;left:70px;top:145px;width:790px;font-size:var(--text-title);font-weight:var(--font-weight-title);line-height:var(--leading-title);letter-spacing:var(--tracking-title)">观察，是理解的开始</div>',
  '<div style="position:absolute;left:72px;top:224px;width:540px;font-size:var(--text-body);font-weight:var(--font-weight-body);line-height:var(--leading-body);letter-spacing:var(--tracking-body);color:var(--color-moss)">沿着叶序、轴线与自然缺损，记录一片植物留下的结构。</div>',
  `<img src="asset:specimen" style="position:absolute;left:226px;top:283px;width:690px;height:930px;object-fit:contain"/>`,
  '<div style="position:absolute;left:70px;top:385px;width:154px;font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-label);line-height:1.5;letter-spacing:var(--tracking-label);color:var(--color-moss);white-space:pre-wrap">01 / RHYTHM\nLEAFLET ORDER</div>',
  '<div style="position:absolute;left:70px;top:634px;width:170px;font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-kicker);line-height:1.5;letter-spacing:var(--tracking-label);color:var(--color-signal);white-space:pre-wrap">02 / TRACE\nNATURAL LOSS</div>',
  '<div style="position:absolute;left:101px;top:920px;width:160px;font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-label);line-height:1.5;letter-spacing:var(--tracking-label);color:var(--color-moss);white-space:pre-wrap">03 / AXIS\nDIRECTIONAL GROWTH</div>',
  '<div style="position:absolute;left:914px;top:304px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-label);letter-spacing:0.12em;color:var(--color-graphite)">FORM INDEX</div>',
  '<div style="position:absolute;left:964px;top:347px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-label);letter-spacing:0.1em;color:var(--color-graphite)">TOP</div>',
  '<div style="position:absolute;left:964px;top:722px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-label);letter-spacing:0.1em;color:var(--color-graphite)">MID</div>',
  '<div style="position:absolute;left:964px;top:1097px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-label);letter-spacing:0.1em;color:var(--color-graphite)">BASE</div>',
  '<div style="position:absolute;left:70px;top:1247px;font-family:var(--font-mono);font-size:var(--text-kicker);font-weight:var(--font-weight-label);letter-spacing:0.12em;color:var(--color-graphite)">SPECIMEN / FERN FROND</div>',
  '<div style="position:absolute;left:362px;top:1247px;font-family:var(--font-mono);font-size:var(--text-kicker);font-weight:var(--font-weight-label);letter-spacing:0.12em;color:var(--color-graphite)">SOURCE / PEXELS · 2563742</div>',
  '<div style="position:absolute;right:72px;top:1247px;font-family:var(--font-mono);font-size:var(--text-kicker);font-weight:var(--font-weight-label);letter-spacing:0.12em;color:var(--color-graphite);text-align:right">PHOTO / KELLY</div>',
  `<div style="position:absolute;left:70px;top:1291px;width:938px;display:flex;align-items:center;justify-content:space-between">`,
  '<div style="font-size:var(--text-footer);font-weight:var(--font-weight-footer);letter-spacing:var(--tracking-footer);color:var(--color-ink)">保留形态，也保留它曾经生长的痕迹。</div>',
  '<div style="width:12px;height:12px;border-radius:999px;background:var(--color-signal)"></div>',
  "</div>",
  "</div>",
].join("");
const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: canvas.height,
  images: [{ data: specimen, src: "asset:specimen" }],
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
