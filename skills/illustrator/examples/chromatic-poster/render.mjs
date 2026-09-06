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
  marrs: theme.color("primary"),
  wash: theme.color("wash"),
};

const html = [
  `<div tw="w-full h-full relative overflow-hidden font-display bg-paper text-ink">`,
  '<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;left:0;top:0;z-index:0">',
  `<path d="M27 31 C190 19 358 30 520 24 C698 18 873 31 1054 25 L1059 830 C874 842 701 833 526 842 C351 851 178 839 25 847 L22 43 Z" fill="${palette.marrs}" opacity="0.1"/>`,
  `<path d="M31 35 C188 25 354 34 518 29 C694 24 872 35 1050 30 L1054 825 C870 835 702 827 525 835 C350 843 180 832 29 840 L27 47 Z" fill="${palette.wash}" opacity="0.16"/>`,
  `<path d="M35 39 C185 29 351 37 514 33 C684 29 874 38 1046 35 L1046 815 C870 823 699 817 526 823 C347 829 177 819 34 824 L32 51 Z" fill="${palette.marrs}"/>`,
  `<path d="M78 1262 C121 1257 164 1265 210 1259" fill="none" stroke="${palette.marrs}" stroke-width="7" stroke-linecap="round" opacity="0.42"/>`,
  "</svg>",
  '<div tw="absolute left-gutter text-label" style="top:916px;font-weight:var(--font-weight-label);letter-spacing:var(--tracking-subtle)">Marrs Green</div>',
  `<div tw="absolute font-mono text-meta tracking-meta text-metadata" style="left:290px;top:929px;font-weight:var(--font-weight-meta)">/ ${palette.marrs}</div>`,
  '<div tw="absolute text-display leading-display tracking-display whitespace-nowrap" style="left:76px;top:990px;width:930px;font-weight:var(--font-weight-display)">全世界最受欢迎的颜色</div>',
  '<div tw="absolute left-gutter text-body leading-body tracking-body whitespace-pre-wrap text-muted-ink" style="top:1122px;width:860px;font-weight:var(--font-weight-body)">比绿松石更深，比水鸭色更静。\n在蓝与绿之间，保留丝绒般的光泽。</div>',
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
