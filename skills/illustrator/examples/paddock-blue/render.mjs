import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.mjs";

// Photo by Mick Waanders on Unsplash:
// https://unsplash.com/photos/race-car-speeding-on-a-track-with-motion-blur-k2NSPo9de-U
const photoPath = new URL("source.jpg", import.meta.url);
const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();

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

const theme = await loadTheme(new URL("theme.css", import.meta.url));
const metrics = [
  ["327", "KM/H · VMAX"],
  ["13,800", "RPM"],
  ["57 / 57", "FINAL LAP"],
  ["00:01.327", "SECTOR TIME"],
];

const metricHtml = metrics
  .map(([value, label], index) => {
    const ruleColor = index === 0 ? "bg-secondary" : "bg-rule";
    const valueStyle =
      index === 3 ? "text-metric-small text-secondary" : "text-metric text-ink";

    return [
      '<div tw="flex flex-col flex-1 min-w-0 font-mono">',
      `<div tw="h-hairline shrink-0 ${ruleColor}"></div>`,
      `<div tw="mt-value-gap min-h-value shrink-0 font-metric leading-metric tracking-metric ${valueStyle}">${value}</div>`,
      `<div tw="mt-label-gap text-label font-label tracking-label text-muted-ink">${label}</div>`,
      "</div>",
    ].join("");
  })
  .join("");

const photo = await readFile(photoPath);
const html = [
  '<div tw="flex flex-col w-full h-full px-page-x pt-page-top pb-page-bottom bg-paper text-ink font-display">',
  '<div tw="relative h-hero shrink-0">',
  '<img src="asset:hero" tw="w-full h-full object-cover object-center"/>',
  '<div tw="absolute inset-0 bg-photo-wash"></div>',
  "</div>",
  '<div tw="flex flex-row h-rule mt-detail shrink-0"><div tw="w-3/5 bg-primary"></div><div tw="flex-1 bg-secondary"></div></div>',
  '<div tw="mt-detail text-muted-ink font-mono text-meta font-label tracking-meta">PHOTO / MICK WAANDERS · UNSPLASH</div>',
  '<div tw="mt-section text-display font-display leading-display tracking-display whitespace-pre-wrap">HOLD THE LINE.\nTAKE THE LEAD.</div>',
  `<div tw="flex flex-row gap-metrics-gap mt-auto shrink-0">${metricHtml}</div>`,
  '<div tw="flex flex-row h-rule mt-section shrink-0"><div tw="w-3/5 bg-primary"></div><div tw="flex-1 bg-secondary"></div></div>',
  '<div tw="flex flex-row justify-between mt-section font-mono text-label font-label tracking-meta">',
  '<div tw="text-muted-ink">PADDOCK BLUE  /  RACING NOTES</div>',
  "<div>FINAL LAP  /  2026</div>",
  "</div>",
  "</div>",
].join("");
const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: 1350,
  images: [{ data: photo, src: "asset:hero" }],
  renderer,
  width: 1080,
});

await writeFile(outputPath, png);
