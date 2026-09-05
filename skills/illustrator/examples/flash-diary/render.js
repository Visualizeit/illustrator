import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.js";

// Photo by Michele Tardivo on Unsplash:
// https://unsplash.com/photos/a-building-with-a-blue-sky-AOsR4vK9KeQ
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

const photo = await readFile(photoPath);
const theme = await loadTheme(new URL("theme.css", import.meta.url));
const html = [
  '<div style="position:relative;width:100%;height:100%;background:var(--color-paper);color:var(--color-ink);font-family:var(--font-display)">',
  '<div style="position:absolute;left:54px;top:54px;width:972px;height:1110px;background:var(--color-white);border:2px solid var(--color-ink)"></div>',
  '<img src="asset:hero" style="position:absolute;left:68px;top:68px;width:944px;height:1082px;object-fit:cover;object-position:center center"/>',
  '<div style="position:absolute;left:88px;top:92px;width:294px;height:52px;background:var(--color-accent);border-radius:999px"><div style="position:absolute;left:24px;top:15px;color:var(--color-white);font-family:var(--font-mono);font-size:var(--text-kicker);font-weight:var(--font-weight-kicker);letter-spacing:var(--tracking-kicker)">FLASH DIARY  /  02</div></div>',
  '<div style="position:absolute;left:670px;top:178px;width:300px;color:var(--color-ink);font-family:var(--font-display);font-size:var(--text-title);font-weight:var(--font-weight-display);line-height:var(--leading-display);letter-spacing:var(--tracking-display);white-space:pre-wrap">晴天\n城市\n日记</div>',
  '<div style="position:absolute;left:672px;top:514px;width:266px;height:14px;background:var(--color-primary)"></div>',
  '<div style="position:absolute;left:82px;top:1056px;width:530px;height:152px;background:var(--color-paper);border:2px solid var(--color-ink)"><div style="position:absolute;left:28px;top:24px;font-family:var(--font-display);font-size:var(--text-body);font-weight:var(--font-weight-body)">把晴天收进口袋</div><div style="position:absolute;left:30px;top:88px;color:var(--color-accent);font-family:var(--font-mono);font-size:var(--text-caption);font-weight:var(--font-weight-meta);letter-spacing:0.09em">A BRIGHT NOTE FROM THE CITY</div></div>',
  '<div style="position:absolute;left:666px;top:1214px;width:360px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-meta);line-height:var(--leading-meta);letter-spacing:var(--tracking-meta);white-space:pre-wrap">SUN  15:40\n31.2304° N  /  121.4737° E</div>',
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
