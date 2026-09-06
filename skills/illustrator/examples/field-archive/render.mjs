import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.mjs";

// Photo by Kelly on Pexels:
// https://www.pexels.com/photo/2563742/
const canvas = { height: 1350, width: 1080 };
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();

const theme = await loadTheme(new URL("theme.css", import.meta.url));
const palette = {
  graphite: theme.color("graphite"),
  ink: theme.color("ink"),
  moss: theme.color("moss"),
  paper: theme.color("paper"),
  signal: theme.color("signal"),
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
  '<div tw="w-full h-full relative overflow-hidden bg-paper text-ink font-display">',
  archiveSvg,
  '<div tw="absolute left-gutter font-mono text-kicker tracking-kicker text-moss" style="top:72px;font-weight:var(--font-weight-kicker)">FIELD ARCHIVE · NOTE 024</div>',
  '<div tw="absolute font-mono text-label text-graphite text-right" style="right:72px;top:72px;font-weight:var(--font-weight-kicker);letter-spacing:var(--tracking-optical-meta)">FORM / TEXTURE / TRACE</div>',
  '<div tw="absolute left-gutter text-title leading-title tracking-title" style="top:145px;width:790px;font-weight:var(--font-weight-title)">观察，是理解的开始</div>',
  '<div tw="absolute text-body leading-body tracking-body text-moss" style="left:72px;top:224px;width:540px;font-weight:var(--font-weight-body)">沿着叶序、轴线与自然缺损，记录一片植物留下的结构。</div>',
  `<img src="asset:specimen" tw="absolute object-contain" style="left:226px;top:283px;width:690px;height:930px">`,
  '<div tw="absolute left-gutter font-mono text-label tracking-label text-moss whitespace-pre-wrap" style="top:385px;width:154px;font-weight:var(--font-weight-label);line-height:var(--leading-normal)">01 / RHYTHM\nLEAFLET ORDER</div>',
  '<div tw="absolute left-gutter font-mono text-label tracking-label text-signal whitespace-pre-wrap" style="top:634px;width:170px;font-weight:var(--font-weight-kicker);line-height:var(--leading-normal)">02 / TRACE\nNATURAL LOSS</div>',
  '<div tw="absolute font-mono text-label tracking-label text-moss whitespace-pre-wrap" style="left:101px;top:920px;width:160px;font-weight:var(--font-weight-label);line-height:var(--leading-normal)">03 / AXIS\nDIRECTIONAL GROWTH</div>',
  '<div tw="absolute font-mono text-meta text-graphite" style="left:914px;top:304px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-wide)">FORM INDEX</div>',
  '<div tw="absolute font-mono text-meta text-graphite" style="left:964px;top:347px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-meta)">TOP</div>',
  '<div tw="absolute font-mono text-meta text-graphite" style="left:964px;top:722px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-meta)">MID</div>',
  '<div tw="absolute font-mono text-meta text-graphite" style="left:964px;top:1097px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-meta)">BASE</div>',
  '<div tw="absolute left-gutter font-mono text-kicker text-graphite" style="top:1247px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-wide)">SPECIMEN / FERN FROND</div>',
  '<div tw="absolute font-mono text-kicker text-graphite" style="left:362px;top:1247px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-wide)">SOURCE / PEXELS · 2563742</div>',
  '<div tw="absolute font-mono text-kicker text-graphite text-right" style="right:72px;top:1247px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-wide)">PHOTO / KELLY</div>',
  `<div tw="absolute left-gutter flex items-center justify-between flex-row" style="top:1291px;width:938px">`,
  '<div tw="text-footer tracking-footer text-ink" style="font-weight:var(--font-weight-footer)">保留形态，也保留它曾经生长的痕迹。</div>',
  '<div tw="bg-signal" style="width:12px;height:12px;border-radius:999px"></div>',
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
