import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.mjs";

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
  butter: theme.color("butter"),
  ink: theme.color("ink"),
  leaf: theme.color("secondary"),
  lilac: theme.color("tertiary"),
  tomato: theme.color("primary"),
};

/** @type {(options: { center: string; color: string; left: number; size: number; top: number; turn: number }) => string} */
const flower = ({ center, color, left, size, top, turn }) => {
  const petalWidth = Math.round(size * 0.38);
  const petalHeight = Math.round(size * 0.52);
  const centerSize = Math.round(size * 0.3);
  /** @type {(x: number, y: number, rotate: number) => string} */
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
  '<div tw="w-full h-full relative overflow-hidden bg-neutral text-ink font-display">',
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
  '<div tw="absolute" style="left:0;top:0;width:1080px;height:1350px;z-index:1">',
  '<div tw="absolute flex items-center bg-butter font-mono text-label tracking-label flex-row border-ink border-4" style="left:76px;top:72px;height:58px;padding:0 24px;border-radius:999px;font-weight:var(--font-weight-label)">FLOWER MARKET · NO.07</div>',
  '<div tw="absolute right-gutter flex items-center justify-center bg-tertiary font-mono text-price flex-row border-ink border-4" style="top:72px;width:116px;height:116px;border-radius:999px;transform:rotate(8deg);font-weight:var(--font-weight-label)">¥24</div>',
  '<div tw="absolute left-gutter text-display leading-display whitespace-pre-wrap" style="top:180px;font-weight:var(--font-weight-display);letter-spacing:var(--tracking-optical-display)">把快乐\n种进今天</div>',
  '<div tw="absolute text-body leading-body whitespace-pre-wrap" style="left:78px;top:430px;font-weight:var(--font-weight-body)">周末花市散步指南\n给普通的一天，加一点鲜艳。</div>',
  '<div tw="absolute bg-primary" style="left:82px;top:575px;width:290px;height:16px"></div>',
  '<div tw="absolute font-mono text-label tracking-meta whitespace-pre-wrap" style="left:82px;top:610px;font-weight:var(--font-weight-label);line-height:var(--leading-loose)">SUN 10:30—17:00\n31.2304° N / 121.4737° E</div>',
  '<div tw="absolute bg-primary text-neutral text-callout leading-callout whitespace-pre-wrap border-ink border-4" style="left:70px;bottom:72px;width:450px;padding:22px;transform:rotate(-2deg);font-weight:var(--font-weight-callout)">PICK A COLOR.\nTAKE HOME SOME JOY.</div>',
  '<div tw="absolute font-mono text-meta tracking-meta" style="right:74px;bottom:68px;font-weight:var(--font-weight-meta)">FRESH CUTS / BRIGHT DAYS</div>',
  "</div>",
  "</div>",
].join("");
const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: 1350,
  renderer,
  width: 1080,
});

await writeFile(outputPath, png);
