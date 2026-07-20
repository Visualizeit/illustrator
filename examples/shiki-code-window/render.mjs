import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { codeToTokens } from "shiki";
import { render } from "takumi-js";
import { container, text } from "takumi-js/helpers";

const outputPath =
  process.argv[2] ??
  new URL("../../docs/assets/shiki-code-window.png", import.meta.url);
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

const source = `const fibonacci = (n) => {
    if (n < 2) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
};`;
const highlighted = await codeToTokens(source, {
  lang: "javascript",
  theme: "catppuccin-latte",
});

const palette = {
  base: highlighted.bg ?? "#EFF1F5",
  foreground: highlighted.fg ?? "#4C4F69",
  metadata: "#9CA0B0",
  title: "#6C6F85",
  titleBar: "#E6E9EF",
  titleBarBorder: "#DCE0E8",
};
const trafficLights = ["#FF5F57", "#FEBC2E", "#28C840"];
const fontStyleBits = {
  bold: 2,
  italic: 1,
  strikethrough: 8,
  underline: 4,
};
const hasFontStyle = (fontStyle, bit) => Math.floor(fontStyle / bit) % 2 === 1;
const lineNumberCharacterWidth = 27;
const lineNumberDigits = String(highlighted.tokens.length).length;
const lineNumberWidth = lineNumberCharacterWidth * lineNumberDigits;
const codeFontSize = 44;
const codeLineHeight = 1.5;
const canvasPadding = 72;
const titleBarHeight = 88;
const trafficLightSize = 24;
const canvas = {
  height:
    highlighted.tokens.length * codeFontSize * codeLineHeight +
    canvasPadding * 2 +
    titleBarHeight,
  width: 1600,
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

const trafficLightBar = container({
  children: [
    ...trafficLights.map((color, index) =>
      container({
        style: {
          backgroundColor: color,
          borderRadius: trafficLightSize / 2,
          flex: "none",
          height: trafficLightSize,
          marginRight: index === trafficLights.length - 1 ? 0 : 20,
          width: trafficLightSize,
        },
      })
    ),
    container({
      children: [text("fibonacci.js")],
      style: {
        color: palette.title,
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
    backgroundColor: palette.titleBar,
    borderBottomColor: palette.titleBarBorder,
    borderBottomStyle: "solid",
    borderBottomWidth: 2,
    boxSizing: "border-box",
    display: "flex",
    flex: "none",
    height: titleBarHeight,
    paddingLeft: 52,
    position: "relative",
    width: "100%",
  },
});

const codeRows = highlighted.tokens.map((line, index) =>
  container({
    children: [
      container({
        children: [text(String(index + 1))],
        style: {
          color: palette.metadata,
          flex: "none",
          fontFamily: "JetBrains Mono",
          fontSize: codeFontSize,
          fontWeight: 400,
          lineHeight: codeLineHeight,
          marginRight: 28,
          textAlign: "left",
          width: lineNumberWidth,
        },
      }),
      container({
        children: line.map((token) => text(token.content, tokenStyle(token))),
        style: {
          color: palette.foreground,
          whiteSpace: "pre",
        },
      }),
    ],
    style: {
      alignItems: "baseline",
      display: "flex",
      fontFamily: "JetBrains Mono, Noto Sans SC",
      fontSize: codeFontSize,
      lineHeight: codeLineHeight,
      minHeight: codeFontSize * codeLineHeight,
      whiteSpace: "pre",
      width: "100%",
    },
  })
);

const node = container({
  children: [
    trafficLightBar,
    container({
      children: codeRows,
      style: {
        boxSizing: "border-box",
        display: "flex",
        flex: "1",
        flexDirection: "column",
        padding: canvasPadding,
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
