import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { bundledThemesInfo, codeToTokens } from "shiki";
import { render } from "takumi-js";

import { tokensToHtml } from "../code-html.mjs";
import { loadTheme } from "../theme.mjs";

const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();
const theme = await loadTheme(new URL("theme.css", import.meta.url));
const syntaxTheme = bundledThemesInfo.find(
  ({ id }) => id === theme.value("syntax-theme")
)?.id;
if (!syntaxTheme) {
  throw new Error(`Unknown Shiki theme: ${theme.value("syntax-theme")}`);
}

/** @type {Array<[string, string, "normal" | "italic"]>} */
const fontDefinitions = [
  [
    "../../assets/fonts/jetbrains-mono/JetBrainsMono-VF.ttf",
    "JetBrains Mono",
    "normal",
  ],
  [
    "../../assets/fonts/jetbrains-mono/JetBrainsMono-Italic-VF.ttf",
    "JetBrains Mono",
    "italic",
  ],
  [
    "../../assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf",
    "Noto Sans SC",
    "normal",
  ],
];

await Promise.all(
  fontDefinitions.map(async ([path, name, style]) =>
    renderer.registerFont({
      data: await readFile(new URL(path, import.meta.url)),
      name,
      style,
    })
  )
);

const source = `const fibonacci = (n) => {
    if (n < 2) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
};`;
const highlighted = await codeToTokens(source, {
  lang: "javascript",
  theme: syntaxTheme,
});

const lineNumberCharacterWidth = theme.number("spacing-line-number-character");
const lineNumberDigits = String(highlighted.tokens.length).length;
const lineNumberWidth = lineNumberCharacterWidth * lineNumberDigits;
const codeFontSize = theme.number("text-code");
const codeLineHeight = theme.number("leading-code");
const canvasPadding = theme.number("spacing-page");
const canvas = {
  height:
    highlighted.tokens.length * codeFontSize * codeLineHeight +
    canvasPadding * 2,
  width: theme.number("spacing-canvas"),
};

const rowHeight = codeFontSize * codeLineHeight;
const codeRows = highlighted.tokens
  .map((line, index) =>
    [
      `<div tw="flex flex-row items-baseline w-full font-display text-code leading-code whitespace-pre" style="min-height:${rowHeight}px">`,
      `<div tw="shrink-0 mr-line-number-gap font-mono font-code text-metadata text-left" style="width:${lineNumberWidth}px">${index + 1}</div>`,
      `<div tw="text-foreground whitespace-pre">${tokensToHtml(line, theme.color("foreground"))}</div>`,
      "</div>",
    ].join("")
  )
  .join("");

const html = `<div tw="flex flex-col w-full h-full overflow-hidden p-page bg-canvas font-display">${codeRows}</div>`;

const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["JetBrains Mono", "Noto Sans SC"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
