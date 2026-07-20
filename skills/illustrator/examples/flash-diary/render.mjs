import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

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
const html = [
  '<div style="position:relative;width:100%;height:100%;background:#F7F3EA;color:#171717;font-family:Noto Sans SC">',
  '<div style="position:absolute;left:54px;top:54px;width:972px;height:1110px;background:#FFFFFF;border:2px solid #171717"></div>',
  '<img src="asset:hero" style="position:absolute;left:68px;top:68px;width:944px;height:1082px;object-fit:cover;object-position:center center"/>',
  '<div style="position:absolute;left:88px;top:92px;width:294px;height:52px;background:#2448D8;border-radius:999px"><div style="position:absolute;left:24px;top:15px;color:#FFFFFF;font-family:JetBrains Mono;font-size:17px;font-weight:700;letter-spacing:0.1em">FLASH DIARY  /  02</div></div>',
  '<div style="position:absolute;left:670px;top:178px;width:300px;color:#171717;font-family:Noto Sans SC;font-size:82px;font-weight:900;line-height:1.14;letter-spacing:-0.04em;white-space:pre-wrap">晴天\n城市\n日记</div>',
  '<div style="position:absolute;left:672px;top:514px;width:266px;height:14px;background:#FF8E68"></div>',
  '<div style="position:absolute;left:82px;top:1056px;width:530px;height:152px;background:#F7F3EA;border:2px solid #171717"><div style="position:absolute;left:28px;top:24px;font-family:Noto Sans SC;font-size:36px;font-weight:800">把晴天收进口袋</div><div style="position:absolute;left:30px;top:88px;color:#2448D8;font-family:JetBrains Mono;font-size:15px;font-weight:700;letter-spacing:0.09em">A BRIGHT NOTE FROM THE CITY</div></div>',
  '<div style="position:absolute;left:666px;top:1214px;width:360px;font-family:JetBrains Mono;font-size:16px;font-weight:700;line-height:1.65;letter-spacing:0.08em;white-space:pre-wrap">SUN  15:40\n31.2304° N  /  121.4737° E</div>',
  "</div>",
].join("");

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: 1350,
  images: [{ data: photo, src: "asset:hero" }],
  renderer,
  width: 1080,
});

await writeFile(outputPath, png);
