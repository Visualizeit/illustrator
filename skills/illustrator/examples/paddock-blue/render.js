import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.js";

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
const palette = {
  clay: theme.color("secondary"),
  denim: theme.color("ink"),
  mist: theme.color("rule"),
  oat: theme.color("paper"),
  powder: theme.color("primary"),
  stone: theme.color("body"),
};

const metrics = [
  ["327", "KM/H · VMAX"],
  ["13,800", "RPM"],
  ["57 / 57", "FINAL LAP"],
  ["00:01.327", "SECTOR TIME"],
];

const metricHtml = metrics
  .map(
    ([value, label], index) =>
      `<div style="position:absolute;left:${58 + index * 252}px;top:1082px;width:218px;height:92px"><div style="position:absolute;left:0;top:0;width:218px;height:2px;background:${index === 0 ? palette.clay : palette.mist}"></div><div style="position:absolute;left:0;top:17px;color:${index === 3 ? palette.clay : palette.denim};font-family:var(--font-mono);font-size:${index === 3 ? "var(--text-metric-small)" : "var(--text-metric)"};font-weight:var(--font-weight-metric);letter-spacing:var(--tracking-metric)">${value}</div><div style="position:absolute;left:2px;top:65px;color:var(--color-body);font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-label);letter-spacing:0.14em">${label}</div></div>`
  )
  .join("");

const photo = await readFile(photoPath);
const html = [
  '<div style="position:relative;width:100%;height:100%;background:var(--color-paper);color:var(--color-ink);font-family:var(--font-display)">',
  '<img src="asset:hero" style="position:absolute;left:58px;top:48px;width:964px;height:666px;object-fit:cover;object-position:center center"/>',
  `<div style="position:absolute;left:58px;top:48px;width:964px;height:666px;background:${palette.powder};opacity:0.08"></div>`,
  `<div style="position:absolute;left:58px;top:736px;width:600px;height:8px;background:${palette.powder}"></div>`,
  `<div style="position:absolute;left:658px;top:736px;width:364px;height:8px;background:${palette.clay}"></div>`,
  '<div style="position:absolute;left:58px;top:762px;color:var(--color-body);font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-label);letter-spacing:0.13em">PHOTO / MICK WAANDERS · UNSPLASH</div>',
  '<div style="position:absolute;left:56px;top:814px;width:966px;color:var(--color-ink);font-family:var(--font-display);font-size:var(--text-display);font-weight:var(--font-weight-display);line-height:var(--leading-display);letter-spacing:var(--tracking-display);white-space:pre-wrap">HOLD THE LINE.\nTAKE THE LEAD.</div>',
  metricHtml,
  `<div style="position:absolute;left:58px;top:1208px;width:580px;height:10px;background:${palette.powder}"></div>`,
  `<div style="position:absolute;left:638px;top:1208px;width:384px;height:10px;background:${palette.clay}"></div>`,
  '<div style="position:absolute;left:58px;top:1264px;color:var(--color-body);font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-label);letter-spacing:0.13em">PADDOCK BLUE  /  RACING NOTES</div>',
  '<div style="position:absolute;right:58px;top:1264px;color:var(--color-ink);font-family:var(--font-mono);font-size:var(--text-label);font-weight:var(--font-weight-label);letter-spacing:0.13em">FINAL LAP  /  2026</div>',
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
