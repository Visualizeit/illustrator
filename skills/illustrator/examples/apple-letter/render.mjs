import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

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

const applePath =
  "M310 154 C260 102 173 105 121 168 C39 267 93 471 217 532 C257 552 281 523 310 523 C339 523 363 552 403 532 C527 471 581 267 499 168 C447 105 360 102 310 154 Z";

const html = [
  '<div tw="w-full h-full relative overflow-hidden" style="background:#F4EFE3;color:#24251F;font-family:Noto Sans SC">',
  '<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;left:0;top:0">',
  '<defs><pattern id="paper-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#D84A3C" opacity="0.22"/></pattern><pattern id="apple-dots" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="#7A2926" opacity="0.36"/></pattern></defs>',
  '<rect x="610" y="0" width="390" height="1350" fill="#E8C8BC" opacity="0.38"/>',
  '<rect x="1000" y="0" width="80" height="1350" fill="#64725A"/>',
  '<rect x="610" y="0" width="390" height="1350" fill="url(#paper-dots)"/>',
  '<line x1="76" y1="72" x2="548" y2="72" stroke="#24251F" stroke-width="2" opacity="0.2"/>',
  '<line x1="76" y1="1278" x2="1000" y2="1278" stroke="#24251F" stroke-width="2" opacity="0.2"/>',
  '<g transform="translate(380 565) scale(1.02)">',
  `<path d="${applePath}" fill="#E8C8BC" transform="translate(-13 12)"/>`,
  `<path d="${applePath}" fill="#D84A3C"/>`,
  `<path d="${applePath}" fill="url(#apple-dots)"/>`,
  `<path d="${applePath}" fill="none" stroke="#24251F" stroke-width="3" opacity="0.18"/>`,
  '<path d="M307 150 C301 108 313 70 340 37" fill="none" stroke="#24251F" stroke-width="18" stroke-linecap="round"/>',
  '<path d="M337 82 C377 29 448 29 476 49 C439 100 382 116 337 82 Z" fill="#64725A"/>',
  '<path d="M350 82 C386 74 416 62 450 47" fill="none" stroke="#AAB49A" stroke-width="3" opacity="0.75"/>',
  "</g>",
  "</svg>",
  '<div style="position:absolute;left:80px;top:104px;font-family:JetBrains Mono;font-size:15px;font-weight:500;letter-spacing:0.15em;color:#64725A">APPLE LETTER · EDITION 01</div>',
  '<div style="position:absolute;left:76px;top:190px;width:790px;font-size:70px;font-weight:560;line-height:1.22;letter-spacing:-0.025em;white-space:pre-wrap">愿你保留清脆，\n也拥抱丰盛。</div>',
  '<div style="position:absolute;left:80px;top:397px;width:430px;font-size:22px;font-weight:400;line-height:1.6;letter-spacing:0.06em;color:#64725A">清甜、明亮，自有方向。</div>',
  '<div style="position:absolute;left:80px;top:520px;width:2px;height:250px;background:#D84A3C"></div>',
  '<div style="position:absolute;left:106px;top:516px;width:210px;font-family:JetBrains Mono;font-size:14px;font-weight:500;line-height:1.8;letter-spacing:0.13em;color:#64725A;white-space:pre-wrap">CRISP\nBRIGHT\nFREE</div>',
  '<div style="position:absolute;left:1008px;top:940px;font-family:JetBrains Mono;font-size:14px;font-weight:500;letter-spacing:0.15em;color:#F4EFE3;transform:rotate(-90deg);transform-origin:left top">APPLE · LIGHT · LETTER</div>',
  "</div>",
].join("");

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: 1350,
  renderer,
  width: 1080,
});

await writeFile(outputPath, png);
