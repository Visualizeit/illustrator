import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { loadTheme } from "../theme.js";

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
  body: theme.color("body"),
  cream: "var(--color-paper)",
  deepTeal: "var(--color-ink)",
  marrs: theme.color("primary"),
  metadata: theme.color("metadata"),
  wash: theme.color("wash"),
};

const html = [
  `<div tw="w-full h-full relative overflow-hidden" style="background:${palette.cream};color:${palette.deepTeal};font-family:var(--font-display)">`,
  '<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;left:0;top:0;z-index:0">',
  `<path d="M27 31 C190 19 358 30 520 24 C698 18 873 31 1054 25 L1059 830 C874 842 701 833 526 842 C351 851 178 839 25 847 L22 43 Z" fill="${palette.marrs}" opacity="0.1"/>`,
  `<path d="M31 35 C188 25 354 34 518 29 C694 24 872 35 1050 30 L1054 825 C870 835 702 827 525 835 C350 843 180 832 29 840 L27 47 Z" fill="${palette.wash}" opacity="0.16"/>`,
  `<path d="M35 39 C185 29 351 37 514 33 C684 29 874 38 1046 35 L1046 815 C870 823 699 817 526 823 C347 829 177 819 34 824 L32 51 Z" fill="${palette.marrs}"/>`,
  `<path d="M78 1262 C121 1257 164 1265 210 1259" fill="none" stroke="${palette.marrs}" stroke-width="7" stroke-linecap="round" opacity="0.42"/>`,
  "</svg>",
  '<div style="position:absolute;left:78px;top:916px;font-size:var(--text-label);font-weight:var(--font-weight-label);letter-spacing:0.01em">Marrs Green</div>',
  `<div style="position:absolute;left:290px;top:929px;font-family:var(--font-mono);font-size:var(--text-meta);font-weight:var(--font-weight-meta);letter-spacing:var(--tracking-meta);color:var(--color-metadata)">/ ${palette.marrs}</div>`,
  '<div style="position:absolute;left:76px;top:990px;width:930px;font-size:var(--text-display);font-weight:var(--font-weight-display);line-height:var(--leading-display);letter-spacing:var(--tracking-display);white-space:nowrap">全世界最受欢迎的颜色</div>',
  '<div style="position:absolute;left:78px;top:1122px;width:860px;font-size:var(--text-body);font-weight:var(--font-weight-body);line-height:var(--leading-body);letter-spacing:var(--tracking-body);color:var(--color-body);white-space:pre-wrap">比绿松石更深，比水鸭色更静。\n在蓝与绿之间，保留丝绒般的光泽。</div>',
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
