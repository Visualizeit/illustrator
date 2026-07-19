import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";
import { container, text } from "takumi-js/helpers";

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
  butter: "#f4da54",
  ink: "#17251c",
  leaf: "#238c4a",
  lilac: "#b69cff",
  tomato: "#f0442e",
  warmWhite: "#fff8de",
};

const shape = (style) => container({ style });

const petal = ({ color, height, left, rotate = 0, top, width }) =>
  shape({
    backgroundColor: color,
    borderRadius: 999,
    height,
    left,
    position: "absolute",
    top,
    transform: `rotate(${rotate}deg)`,
    width,
  });

const flower = ({ center, color, left, size, top, turn = 0 }) => {
  const petalWidth = Math.round(size * 0.38);
  const petalHeight = Math.round(size * 0.52);
  const centerSize = Math.round(size * 0.3);
  return container({
    children: [
      petal({
        color,
        height: petalHeight,
        left: size * 0.31,
        top: 0,
        width: petalWidth,
      }),
      petal({
        color,
        height: petalHeight,
        left: size * 0.58,
        rotate: 72,
        top: size * 0.23,
        width: petalWidth,
      }),
      petal({
        color,
        height: petalHeight,
        left: size * 0.48,
        rotate: 144,
        top: size * 0.55,
        width: petalWidth,
      }),
      petal({
        color,
        height: petalHeight,
        left: size * 0.12,
        rotate: 216,
        top: size * 0.55,
        width: petalWidth,
      }),
      petal({
        color,
        height: petalHeight,
        left: 0,
        rotate: 288,
        top: size * 0.22,
        width: petalWidth,
      }),
      shape({
        backgroundColor: center,
        borderColor: palette.ink,
        borderRadius: 999,
        borderStyle: "solid",
        borderWidth: 5,
        height: centerSize,
        left: (size - centerSize) / 2,
        position: "absolute",
        top: (size - centerSize) / 2,
        width: centerSize,
      }),
    ],
    style: {
      height: size,
      left,
      position: "absolute",
      top,
      transform: `rotate(${turn}deg)`,
      width: size,
    },
  });
};

const canvas = container({
  children: [
    shape({
      borderColor: palette.ink,
      borderStyle: "solid",
      borderWidth: 5,
      bottom: 34,
      left: 34,
      position: "absolute",
      right: 34,
      top: 34,
    }),
    container({
      children: [
        text("FLOWER MARKET · NO.07", {
          fontFamily: "JetBrains Mono",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
        }),
      ],
      style: {
        alignItems: "center",
        backgroundColor: palette.butter,
        borderColor: palette.ink,
        borderRadius: 999,
        borderStyle: "solid",
        borderWidth: 4,
        display: "flex",
        height: 58,
        left: 76,
        paddingLeft: 24,
        paddingRight: 24,
        position: "absolute",
        top: 72,
      },
    }),
    container({
      children: [
        text("¥24", {
          fontFamily: "JetBrains Mono",
          fontSize: 30,
          fontWeight: 700,
        }),
      ],
      style: {
        alignItems: "center",
        backgroundColor: palette.lilac,
        borderColor: palette.ink,
        borderRadius: 999,
        borderStyle: "solid",
        borderWidth: 4,
        display: "flex",
        height: 116,
        justifyContent: "center",
        position: "absolute",
        right: 72,
        top: 72,
        transform: "rotate(8deg)",
        width: 116,
      },
    }),
    container({
      children: [
        text("把快乐", {
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: -5,
          lineHeight: 0.96,
        }),
        text("种进今天", {
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: -5,
          lineHeight: 0.96,
        }),
      ],
      style: {
        display: "flex",
        flexDirection: "column",
        left: 72,
        position: "absolute",
        top: 180,
      },
    }),
    text("周末花市散步指南\n给普通的一天，加一点鲜艳。", {
      fontSize: 27,
      fontWeight: 600,
      left: 78,
      lineHeight: 1.5,
      position: "absolute",
      top: 430,
      whiteSpace: "pre",
    }),
    shape({
      backgroundColor: palette.tomato,
      height: 16,
      left: 82,
      position: "absolute",
      top: 575,
      width: 290,
    }),
    text("SUN 10:30—17:00\n31.2304° N / 121.4737° E", {
      fontFamily: "JetBrains Mono",
      fontSize: 18,
      fontWeight: 700,
      left: 82,
      letterSpacing: 2,
      lineHeight: 1.7,
      position: "absolute",
      top: 610,
      whiteSpace: "pre",
    }),
    shape({
      backgroundColor: palette.leaf,
      borderColor: palette.ink,
      borderRadius: 999,
      borderStyle: "solid",
      borderWidth: 4,
      height: 590,
      left: 610,
      position: "absolute",
      top: 665,
      transform: "rotate(-13deg)",
      width: 18,
    }),
    shape({
      backgroundColor: palette.leaf,
      borderColor: palette.ink,
      borderRadius: 999,
      borderStyle: "solid",
      borderWidth: 4,
      height: 550,
      left: 780,
      position: "absolute",
      top: 690,
      transform: "rotate(12deg)",
      width: 18,
    }),
    shape({
      backgroundColor: palette.leaf,
      borderColor: palette.ink,
      borderRadius: "999px 10px 999px 10px",
      borderStyle: "solid",
      borderWidth: 4,
      height: 84,
      left: 510,
      position: "absolute",
      top: 900,
      transform: "rotate(28deg)",
      width: 190,
    }),
    shape({
      backgroundColor: palette.leaf,
      borderColor: palette.ink,
      borderRadius: "10px 999px 10px 999px",
      borderStyle: "solid",
      borderWidth: 4,
      height: 82,
      left: 748,
      position: "absolute",
      top: 1020,
      transform: "rotate(-24deg)",
      width: 190,
    }),
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
    container({
      children: [
        container({
          children: [
            text("PICK A COLOR.", {
              color: palette.warmWhite,
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.25,
            }),
            text("TAKE HOME SOME JOY.", {
              color: palette.warmWhite,
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.25,
            }),
          ],
          style: { display: "flex", flexDirection: "column" },
        }),
      ],
      style: {
        backgroundColor: palette.tomato,
        borderColor: palette.ink,
        borderStyle: "solid",
        borderWidth: 4,
        bottom: 72,
        left: 70,
        padding: 22,
        position: "absolute",
        transform: "rotate(-2deg)",
        width: 450,
      },
    }),
    text("FRESH CUTS / BRIGHT DAYS", {
      bottom: 90,
      fontFamily: "JetBrains Mono",
      fontSize: 17,
      fontWeight: 700,
      letterSpacing: 2,
      position: "absolute",
      right: 74,
    }),
  ],
  style: {
    backgroundColor: palette.warmWhite,
    color: palette.ink,
    fontFamily: "Noto Sans SC",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
});

const png = await render(canvas, {
  format: "png",
  height: 1350,
  renderer,
  width: 1080,
});
await writeFile(outputPath, png);
