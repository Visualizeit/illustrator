import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { codeToTokens } from "shiki";
import { render } from "takumi-js";
import { container, text } from "takumi-js/helpers";

const outputPath =
  process.argv[2] ??
  new URL("../../docs/assets/shiki-code-diff.png", import.meta.url);
const renderer = new Renderer();

const fontDefinitions = [
  [
    "../../skills/illustrator/assets/fonts/jetbrains-mono/JetBrainsMono-VF.ttf",
    "JetBrains Mono",
    "normal",
  ],
  [
    "../../skills/illustrator/assets/fonts/jetbrains-mono/JetBrainsMono-Italic-VF.ttf",
    "JetBrains Mono",
    "italic",
  ],
  [
    "../../skills/illustrator/assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf",
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

const [beforeHighlighted, afterHighlighted] = await Promise.all([
  codeToTokens(beforeSource, { lang: "javascript", theme: "dracula" }),
  codeToTokens(afterSource, { lang: "javascript", theme: "dracula" }),
]);

const palette = {
  added: "#203C32",
  addedGutter: "#28513F",
  addedMarker: "#50FA7B",
  base: afterHighlighted.bg ?? "#282A36",
  border: "#44475A",
  foreground: afterHighlighted.fg ?? "#F8F8F2",
  hunk: "#343746",
  metadata: "#9395A5",
  panel: "#21222C",
  removed: "#4A2834",
  removedGutter: "#63313F",
  removedMarker: "#FF5555",
};
const trafficLights = ["#FF5F57", "#FEBC2E", "#28C840"];
const placeholderPattern =
  "repeating-linear-gradient(135deg, transparent 0px, transparent 8.5px, rgba(147, 149, 165, 0.42) 9px, rgba(147, 149, 165, 0.42) 10px, transparent 10.5px, transparent 14px)";
const rowPresentation = {
  add: {
    background: palette.added,
    gutter: palette.addedGutter,
    lineNumberColor: palette.addedMarker,
  },
  context: {
    background: palette.base,
    gutter: palette.panel,
    lineNumberColor: palette.metadata,
  },
  empty: {
    background: "transparent",
    gutter: palette.panel,
    lineNumberColor: palette.metadata,
  },
  remove: {
    background: palette.removed,
    gutter: palette.removedGutter,
    lineNumberColor: palette.removedMarker,
  },
};
const fontStyleBits = {
  bold: 2,
  italic: 1,
  strikethrough: 8,
  underline: 4,
};
const splitRows = [
  {
    left: { index: 0, line: 1, type: "remove" },
    right: { index: 0, line: 1, type: "add" },
  },
  { left: null, right: { index: 1, line: 2, type: "add" } },
  { left: null, right: { index: 2, line: 3, type: "add" } },
  { left: null, right: { index: 3, line: 4, type: "add" } },
  { left: null, right: { index: 4, line: 5, type: "add" } },
  { left: null, right: { index: 5, line: 6, type: "add" } },
  {
    left: { index: 1, line: 2, type: "context" },
    right: { index: 6, line: 7, type: "context" },
  },
  {
    left: { index: 2, line: 3, type: "context" },
    right: { index: 7, line: 8, type: "context" },
  },
  {
    left: { index: 3, line: 4, type: "context" },
    right: { index: 8, line: 9, type: "context" },
  },
  {
    left: { index: 4, line: 5, type: "context" },
    right: { index: 9, line: 10, type: "context" },
  },
  {
    left: { index: 5, line: 6, type: "remove" },
    right: { index: 10, line: 11, type: "add" },
  },
  { left: null, right: { index: 11, line: 12, type: "add" } },
  { left: null, right: { index: 12, line: 13, type: "add" } },
  { left: null, right: { index: 13, line: 14, type: "add" } },
  { left: null, right: { index: 14, line: 15, type: "add" } },
  {
    left: { index: 6, line: 7, type: "context" },
    right: { index: 15, line: 16, type: "context" },
  },
];
const hasFontStyle = (fontStyle, bit) => Math.floor(fontStyle / bit) % 2 === 1;
const codeFontSize = 28;
const codeLineHeight = 1.5;
const rowHeight = codeFontSize * codeLineHeight;
const titleBarHeight = 88;
const columnBarHeight = 58;
const trafficLightSize = 24;
const canvas = {
  height: titleBarHeight + columnBarHeight + splitRows.length * rowHeight + 48,
  width: 2000,
};

const tokenStyle = (token) => {
  const fontStyle = token.fontStyle ?? 0;
  const decorations = [
    hasFontStyle(fontStyle, fontStyleBits.underline) ? "underline" : "",
    hasFontStyle(fontStyle, fontStyleBits.strikethrough) ? "line-through" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    color: token.color ?? palette.foreground,
    display: "inline",
    fontStyle: hasFontStyle(fontStyle, fontStyleBits.italic)
      ? "italic"
      : undefined,
    fontWeight: hasFontStyle(fontStyle, fontStyleBits.bold) ? 700 : undefined,
    textDecoration: decorations || undefined,
  };
};

const titleBar = container({
  children: [
    ...trafficLights.map((color, index) =>
      container({
        style: {
          backgroundColor: color,
          borderRadius: trafficLightSize / 2,
          flex: "none",
          height: trafficLightSize,
          marginRight: index === trafficLights.length - 1 ? 0 : 16,
          width: trafficLightSize,
        },
      })
    ),
    container({
      children: [text("fibonacci.js")],
      style: {
        color: palette.metadata,
        fontFamily: "JetBrains Mono",
        fontSize: 28,
        fontWeight: 600,
        left: 0,
        lineHeight: 1,
        position: "absolute",
        textAlign: "center",
        top: 30,
        width: "100%",
      },
    }),
  ],
  style: {
    alignItems: "center",
    backgroundColor: palette.panel,
    borderBottomColor: palette.border,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    boxSizing: "border-box",
    display: "flex",
    flex: "none",
    height: titleBarHeight,
    paddingLeft: 52,
    position: "relative",
    width: "100%",
  },
});

const columnBar = container({
  children: [
    container({
      children: [text("BEFORE  ·  @@ -1,7 @@")],
      style: {
        alignItems: "center",
        display: "flex",
        height: "100%",
        paddingLeft: 52,
        width: "50%",
      },
    }),
    container({
      children: [text("AFTER   ·  @@ +1,16 @@")],
      style: {
        alignItems: "center",
        borderLeftColor: palette.border,
        borderLeftStyle: "solid",
        borderLeftWidth: 2,
        display: "flex",
        height: "100%",
        paddingLeft: 52,
        width: "50%",
      },
    }),
  ],
  style: {
    alignItems: "center",
    backgroundColor: palette.hunk,
    color: "#BD93F9",
    display: "flex",
    flex: "none",
    fontFamily: "JetBrains Mono",
    fontSize: 22,
    height: columnBarHeight,
    width: "100%",
  },
});

const lineNumber = (value, backgroundColor, color) =>
  container({
    children: [text(value === null ? "" : String(value))],
    style: {
      backgroundColor,
      color,
      flex: "none",
      fontFamily: "JetBrains Mono",
      fontSize: codeFontSize,
      height: rowHeight,
      lineHeight: codeLineHeight,
      paddingRight: 18,
      textAlign: "right",
      width: 66,
    },
  });

const renderDiffSide = (entry, highlighted, showDivider) => {
  const { index, line, type } = entry ?? {
    index: null,
    line: null,
    type: "empty",
  };
  const {
    background: rowBackground,
    gutter: gutterBackground,
    lineNumberColor,
  } = rowPresentation[type];
  const tokens = index === null ? [] : highlighted.tokens[index];

  return container({
    children: [
      lineNumber(line, gutterBackground, lineNumberColor),
      container({
        children: tokens.map((token) => text(token.content, tokenStyle(token))),
        style: {
          boxSizing: "border-box",
          color: palette.foreground,
          flex: "1",
          height: rowHeight,
          paddingLeft: 14,
          whiteSpace: "pre",
        },
      }),
    ],
    style: {
      alignItems: "baseline",
      backgroundColor: rowBackground,
      borderLeftColor: showDivider ? palette.border : "transparent",
      borderLeftStyle: "solid",
      borderLeftWidth: showDivider ? 2 : 0,
      boxSizing: "border-box",
      display: "flex",
      flex: "none",
      fontFamily: "JetBrains Mono, Noto Sans SC",
      fontSize: codeFontSize,
      height: rowHeight,
      lineHeight: codeLineHeight,
      whiteSpace: "pre",
      width: "50%",
    },
  });
};

const renderedRows = splitRows.map(({ left, right }) =>
  container({
    children: [
      renderDiffSide(left, beforeHighlighted, false),
      renderDiffSide(right, afterHighlighted, true),
    ],
    style: {
      display: "flex",
      flex: "none",
      height: rowHeight,
      width: "100%",
    },
  })
);

const placeholderBlocks = [
  { rowCount: 5, startRow: 1 },
  { rowCount: 4, startRow: 11 },
].map(({ rowCount, startRow }) =>
  container({
    style: {
      backgroundImage: placeholderPattern,
      height: rowCount * rowHeight,
      left: 66,
      position: "absolute",
      top: 24 + startRow * rowHeight,
      width: canvas.width / 2 - 66,
    },
  })
);

const node = container({
  children: [
    titleBar,
    columnBar,
    container({
      children: [...placeholderBlocks, ...renderedRows],
      style: {
        backgroundColor: palette.base,
        display: "flex",
        flex: "1",
        flexDirection: "column",
        paddingBottom: 24,
        paddingTop: 24,
        position: "relative",
        width: "100%",
      },
    }),
  ],
  style: {
    backgroundColor: palette.base,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    fontFamily: "JetBrains Mono, Noto Sans SC",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
});

const png = await render(node, {
  fontFamilies: ["JetBrains Mono", "Noto Sans SC"],
  format: "png",
  height: canvas.height,
  renderer,
  width: canvas.width,
});

await writeFile(outputPath, png);
