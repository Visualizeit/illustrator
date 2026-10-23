import { readFile, writeFile } from "node:fs/promises";

import { codeToTokens } from "@pierre/highlights";
import { dracula } from "@pierre/highlights/themes";
import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

import { tokensToHtml } from "../code-html.mjs";
import { loadTheme } from "../theme.mjs";

const outputPath = process.argv[2] ?? new URL("preview.png", import.meta.url);
const renderer = new Renderer();
const theme = await loadTheme(new URL("theme.css", import.meta.url));

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

/* eslint-disable no-await-in-loop -- Register faces in order so family resolution stays deterministic. */
for (const [path, name, style] of fontDefinitions) {
  await renderer.registerFont({
    data: await readFile(new URL(path, import.meta.url)),
    name,
    style,
  });
}
/* eslint-enable no-await-in-loop */

const beforeSource = `const fibonacci = (n) => {
    if (n < 2) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
};`;

const afterSource = `const fibonacci = (n, cache = new Map()) => {
    const cached = cache.get(n);
    if (cached !== undefined) {
        return cached;
    }

    if (n < 2) {
        return n;
    }

    const previous = fibonacci(n - 1, cache);
    const next = fibonacci(n - 2, cache);
    const value = previous + next;
    cache.set(n, value);
    return value;
};`;

const beforeHighlighted = codeToTokens(beforeSource, {
  lang: "javascript",
  theme: dracula,
});

const afterHighlighted = codeToTokens(afterSource, {
  lang: "javascript",
  theme: dracula,
});

const rowPresentation = {
  add: { background: "bg-added", gutter: "bg-added-gutter text-added-marker" },
  context: { background: "bg-canvas", gutter: "bg-panel text-metadata" },
  empty: { background: "bg-transparent", gutter: "bg-panel text-metadata" },
  remove: {
    background: "bg-removed",
    gutter: "bg-removed-gutter text-removed-marker",
  },
};

/** @typedef {"add" | "context" | "remove"} DiffRowType */
/** @typedef {{ line: number; type: DiffRowType }} DiffEntry */
/** @type {Array<{ left: DiffEntry | null; right: DiffEntry | null }>} */
const splitRows = [
  {
    left: { line: 1, type: "remove" },
    right: { line: 1, type: "add" },
  },
  { left: null, right: { line: 2, type: "add" } },
  { left: null, right: { line: 3, type: "add" } },
  { left: null, right: { line: 4, type: "add" } },
  { left: null, right: { line: 5, type: "add" } },
  { left: null, right: { line: 6, type: "add" } },
  {
    left: { line: 2, type: "context" },
    right: { line: 7, type: "context" },
  },
  {
    left: { line: 3, type: "context" },
    right: { line: 8, type: "context" },
  },
  {
    left: { line: 4, type: "context" },
    right: { line: 9, type: "context" },
  },
  {
    left: { line: 5, type: "context" },
    right: { line: 10, type: "context" },
  },
  {
    left: { line: 6, type: "remove" },
    right: { line: 11, type: "add" },
  },
  { left: null, right: { line: 12, type: "add" } },
  { left: null, right: { line: 13, type: "add" } },
  { left: null, right: { line: 14, type: "add" } },
  { left: null, right: { line: 15, type: "add" } },
  {
    left: { line: 7, type: "context" },
    right: { line: 16, type: "context" },
  },
];

const rowHeight = theme.number("text-code") * theme.number("leading-code");
const titleBarHeight = theme.number("spacing-title-bar");
const columnBarHeight = theme.number("spacing-column-bar");

const canvas = {
  height:
    titleBarHeight +
    columnBarHeight +
    splitRows.length * rowHeight +
    theme.number("spacing-page") * 2,
  width: theme.number("spacing-canvas"),
};

const trafficLights = ["close", "minimize", "maximize"]
  .map(
    (color) =>
      `<div tw="w-control h-control shrink-0 rounded-full bg-${color}"></div>`
  )
  .join("");

const titleBar = [
  '<div tw="relative flex flex-row items-center shrink-0 w-full h-title-bar pl-header-inset bg-panel border-b-border border-solid border-0" style="border-bottom-width:var(--spacing-hairline)">',
  `<div tw="flex flex-row gap-control-gap">${trafficLights}</div>`,
  `<div tw="absolute left-0 w-full font-mono text-title font-label leading-none text-center text-metadata" style="top:${(titleBarHeight - theme.number("text-title")) / 2}px">fibonacci.js</div>`,
  "</div>",
].join("");

const columnBar = [
  '<div tw="flex flex-row items-center shrink-0 w-full h-column-bar bg-hunk text-hunk-label font-mono text-label">',
  `<div tw="flex flex-row items-center w-1/2 h-full pl-header-inset">BEFORE  ·  @@ -1,${beforeHighlighted.tokens.length} @@</div>`,
  `<div tw="flex flex-row items-center w-1/2 h-full pl-header-inset border-l-border border-solid border-0" style="border-left-width:var(--spacing-divider)">AFTER   ·  @@ +1,${afterHighlighted.tokens.length} @@</div>`,
  "</div>",
].join("");

/**
 * @param {DiffEntry | null} entry Source row or an empty side.
 * @param {import("@pierre/highlights").TokensResult} highlighted Tokenized source.
 * @param {boolean} showDivider Whether to draw the column divider.
 */
const renderDiffSide = (entry, highlighted, showDivider) => {
  const { line, type } = entry ?? {
    line: null,
    type: "empty",
  };

  const { background, gutter } = rowPresentation[type];
  const tokens = line === null ? [] : (highlighted.tokens[line - 1] ?? []);

  const divider = showDivider
    ? "border-left:var(--spacing-divider) solid var(--color-border)"
    : "";

  return [
    `<div tw="flex flex-row items-baseline shrink-0 w-1/2 h-full font-display text-code leading-code whitespace-pre ${background}" style="${divider}">`,
    `<div tw="shrink-0 w-line-number h-full pr-line-number-inset text-right font-mono ${gutter}">${line ?? ""}</div>`,
    `<div tw="flex-1 h-full pl-code-inset text-foreground whitespace-pre">${tokensToHtml(tokens, theme.color("foreground"))}</div>`,
    "</div>",
  ].join("");
};

const renderedRows = splitRows
  .map(
    ({ left, right }) =>
      `<div tw="flex flex-row shrink-0 w-full" style="height:${rowHeight}px">${renderDiffSide(left, beforeHighlighted, false)}${renderDiffSide(right, afterHighlighted, true)}</div>`
  )
  .join("");

const placeholderBlocks = [];

/** @type {Array<"left" | "right">} */
const sides = ["left", "right"];

for (const side of sides) {
  let startRow = 0;

  for (const [index, row] of splitRows.entries()) {
    if (row[side] !== null) {
      continue;
    }

    if (splitRows[index - 1]?.[side] !== null) {
      startRow = index;
    }

    if (splitRows[index + 1]?.[side] === null) {
      continue;
    }

    const left =
      (side === "right" ? canvas.width / 2 : 0) +
      theme.number("spacing-line-number");

    const rowCount = index - startRow + 1;

    placeholderBlocks.push(
      `<div tw="absolute" style="background-image:var(--background-image-placeholder);left:${left}px;height:${rowCount * rowHeight}px;top:${theme.number("spacing-page") + startRow * rowHeight}px;width:${canvas.width / 2 - theme.number("spacing-line-number")}px"></div>`
    );
  }
}

const html = [
  '<div tw="flex flex-col w-full h-full overflow-hidden bg-canvas font-display">',
  titleBar,
  columnBar,
  `<div tw="relative flex flex-col flex-1 w-full py-page bg-canvas">${placeholderBlocks.join("")}${renderedRows}</div>`,
  "</div>",
].join("");

const png = await render(html, {
  css: [theme.css],
  fontFamilies: ["JetBrains Mono", "Noto Sans SC"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
