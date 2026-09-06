import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.mjs";

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
  '<div tw="relative w-full h-full bg-paper text-ink font-display">',
  '<div tw="absolute bg-white border-ink border-2" style="left:54px;top:54px;width:972px;height:1110px"></div>',
  '<img src="asset:hero" tw="absolute left-gutter object-cover object-center" style="top:68px;width:944px;height:1082px">',
  '<div tw="absolute bg-accent" style="left:88px;top:92px;width:294px;height:52px;border-radius:999px"><div tw="absolute text-white font-mono text-kicker tracking-kicker" style="left:24px;top:15px;font-weight:var(--font-weight-kicker)">FLASH DIARY  /  02</div></div>',
  '<div tw="absolute text-ink font-display text-title leading-display tracking-display whitespace-pre-wrap" style="left:670px;top:178px;width:300px;font-weight:var(--font-weight-display)">晴天\n城市\n日记</div>',
  '<div tw="absolute bg-primary" style="left:672px;top:514px;width:266px;height:14px"></div>',
  '<div tw="absolute bg-paper border-ink border-2" style="left:82px;top:1056px;width:530px;height:152px"><div tw="absolute font-display text-body" style="left:28px;top:24px;font-weight:var(--font-weight-body)">把晴天收进口袋</div><div tw="absolute text-accent font-mono text-caption" style="left:30px;top:88px;font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-caption)">A BRIGHT NOTE FROM THE CITY</div></div>',
  '<div tw="absolute font-mono text-meta leading-meta tracking-meta whitespace-pre-wrap" style="left:666px;top:1214px;width:360px;font-weight:var(--font-weight-meta)">SUN  15:40\n31.2304° N  /  121.4737° E</div>',
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
