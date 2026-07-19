import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

const outputPath =
  process.argv[2] ??
  new URL("../../../docs/assets/flower-market.png", import.meta.url);
const renderer = new Renderer();

const fontDefinitions = [
  [
    "../../../skills/illustrator/assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf",
    "Noto Sans SC",
  ],
  [
    "../../../skills/illustrator/assets/fonts/jetbrains-mono/JetBrainsMono-VF.ttf",
    "JetBrains Mono",
  ],
];
await Promise.all(
  fontDefinitions.map(async ([path, name]) =>
    renderer.registerFont({
      data: await readFile(new URL(path, import.meta.url)),
      name,
    })
  )
);

const palette = {
  butter: "#F4DA54",
  ink: "#17251C",
  leaf: "#238C4A",
  lilac: "#B69CFF",
  tomato: "#F0442E",
  warmWhite: "#FFF8DE",
};

const flower = ({ center, color, left, size, top, turn }) => {
  const petalWidth = Math.round(size * 0.38);
  const petalHeight = Math.round(size * 0.52);
  const centerSize = Math.round(size * 0.3);
  const petal = (x, y, rotate) => {
    const centerX = x + petalWidth / 2;
    const centerY = y + petalHeight / 2;
    return `<rect x="${x}" y="${y}" width="${petalWidth}" height="${petalHeight}" rx="${petalWidth / 2}" fill="${color}" transform="rotate(${rotate} ${centerX} ${centerY})"/>`;
  };
  const petals = [
    petal(size * 0.31, 0, 0),
    petal(size * 0.58, size * 0.23, 72),
    petal(size * 0.48, size * 0.55, 144),
    petal(size * 0.12, size * 0.55, 216),
    petal(0, size * 0.22, 288),
  ].join("");

  return `<g transform="translate(${left} ${top}) rotate(${turn} ${size / 2} ${size / 2})">${petals}<circle cx="${size / 2}" cy="${size / 2}" r="${centerSize / 2}" fill="${center}" stroke="${palette.ink}" stroke-width="5"/></g>`;
};

const html = [
  `<div tw="w-full h-full relative overflow-hidden" style="background:${palette.warmWhite};color:${palette.ink};font-family:Noto Sans SC">`,
  '<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;left:0;top:0;z-index:0">',
  `<rect x="36" y="36" width="1008" height="1278" fill="none" stroke="${palette.ink}" stroke-width="5"/>`,
  '<g stroke-linecap="round" stroke-linejoin="round">',
  `<path d="M682 1205 C652 1097 637 925 681 788" fill="none" stroke="${palette.ink}" stroke-width="18"/>`,
  `<path d="M682 1205 C652 1097 637 925 681 788" fill="none" stroke="${palette.leaf}" stroke-width="10"/>`,
  `<path d="M759 1205 C787 1105 817 1027 847 958" fill="none" stroke="${palette.ink}" stroke-width="18"/>`,
  `<path d="M759 1205 C787 1105 817 1027 847 958" fill="none" stroke="${palette.leaf}" stroke-width="10"/>`,
  `<path d="M579 1205 C584 1137 570 1085 548 1038" fill="none" stroke="${palette.ink}" stroke-width="16"/>`,
  `<path d="M579 1205 C584 1137 570 1085 548 1038" fill="none" stroke="${palette.leaf}" stroke-width="9"/>`,
  "</g>",
  flower({
    center: palette.butter,
    color: palette.tomato,
    left: 510,
    size: 390,
    top: 570,
    turn: -8,
  }),
  flower({
    center: palette.tomato,
    color: palette.lilac,
    left: 720,
    size: 280,
    top: 810,
    turn: 11,
  }),
  flower({
    center: palette.ink,
    color: palette.butter,
    left: 435,
    size: 220,
    top: 930,
    turn: -16,
  }),
  "</svg>",
  '<div style="position:absolute;left:0;top:0;width:1080px;height:1350px;z-index:1">',
  `<div style="position:absolute;left:76px;top:72px;height:58px;padding:0 24px;display:flex;align-items:center;background:${palette.butter};border:4px solid ${palette.ink};border-radius:999px;font-family:JetBrains Mono;font-size:18px;font-weight:700;letter-spacing:3px">FLOWER MARKET · NO.07</div>`,
  `<div style="position:absolute;right:72px;top:72px;width:116px;height:116px;display:flex;align-items:center;justify-content:center;background:${palette.lilac};border:4px solid ${palette.ink};border-radius:999px;transform:rotate(8deg);font-family:JetBrains Mono;font-size:30px;font-weight:700">¥24</div>`,
  '<div style="position:absolute;left:72px;top:180px;font-size:104px;font-weight:900;line-height:0.96;letter-spacing:-5px;white-space:pre-wrap">把快乐\n种进今天</div>',
  '<div style="position:absolute;left:78px;top:430px;font-size:27px;font-weight:600;line-height:1.5;white-space:pre-wrap">周末花市散步指南\n给普通的一天，加一点鲜艳。</div>',
  `<div style="position:absolute;left:82px;top:575px;width:290px;height:16px;background:${palette.tomato}"></div>`,
  '<div style="position:absolute;left:82px;top:610px;font-family:JetBrains Mono;font-size:18px;font-weight:700;line-height:1.7;letter-spacing:2px;white-space:pre-wrap">SUN 10:30—17:00\n31.2304° N / 121.4737° E</div>',
  `<div style="position:absolute;left:70px;bottom:72px;width:450px;padding:22px;background:${palette.tomato};border:4px solid ${palette.ink};transform:rotate(-2deg);color:${palette.warmWhite};font-size:24px;font-weight:800;line-height:1.25;white-space:pre-wrap">PICK A COLOR.\nTAKE HOME SOME JOY.</div>`,
  '<div style="position:absolute;right:74px;bottom:68px;font-family:JetBrains Mono;font-size:17px;font-weight:700;letter-spacing:2px">FRESH CUTS / BRIGHT DAYS</div>',
  "</div>",
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
