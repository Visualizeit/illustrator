import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";
import { container, image, text } from "takumi-js/helpers";

// Photo by Michele Tardivo on Unsplash:
// https://unsplash.com/photos/a-building-with-a-blue-sky-AOsR4vK9KeQ
const photoPath = new URL("source.jpg", import.meta.url);
const outputPath = new URL(
  "../../../docs/assets/flash-diary.png",
  import.meta.url
);
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

const photo = await readFile(photoPath);
const node = container({
  children: [
    container({
      style: {
        backgroundColor: "#FFFFFF",
        borderColor: "#171717",
        borderStyle: "solid",
        borderWidth: "2px",
        height: "1110px",
        left: "54px",
        position: "absolute",
        top: "54px",
        width: "972px",
      },
    }),
    image({
      src: "asset:hero",
      style: {
        height: "1082px",
        left: "68px",
        objectFit: "cover",
        objectPosition: "center center",
        position: "absolute",
        top: "68px",
        width: "944px",
      },
    }),
    container({
      children: [
        text("FLASH DIARY  /  02", {
          color: "#FFFFFF",
          fontFamily: "JetBrains Mono",
          fontSize: "17px",
          fontWeight: 700,
          left: "24px",
          letterSpacing: "0.1em",
          position: "absolute",
          top: "15px",
        }),
      ],
      style: {
        backgroundColor: "#2448D8",
        borderRadius: "999px",
        height: "52px",
        left: "88px",
        position: "absolute",
        top: "92px",
        width: "294px",
      },
    }),
    text("晴天\n城市\n日记", {
      color: "#171717",
      fontFamily: "Noto Sans SC",
      fontSize: "82px",
      fontWeight: 900,
      left: "670px",
      letterSpacing: "-0.04em",
      lineHeight: 1.14,
      position: "absolute",
      top: "178px",
      whiteSpace: "pre-wrap",
      width: "300px",
    }),
    container({
      style: {
        backgroundColor: "#FF8E68",
        height: "14px",
        left: "672px",
        position: "absolute",
        top: "514px",
        width: "266px",
      },
    }),
    container({
      children: [
        text("把晴天收进口袋", {
          fontFamily: "Noto Sans SC",
          fontSize: "36px",
          fontWeight: 800,
          left: "28px",
          position: "absolute",
          top: "24px",
        }),
        text("A BRIGHT NOTE FROM THE CITY", {
          color: "#2448D8",
          fontFamily: "JetBrains Mono",
          fontSize: "15px",
          fontWeight: 700,
          left: "30px",
          letterSpacing: "0.09em",
          position: "absolute",
          top: "88px",
        }),
      ],
      style: {
        backgroundColor: "#F7F3EA",
        borderColor: "#171717",
        borderStyle: "solid",
        borderWidth: "2px",
        height: "152px",
        left: "82px",
        position: "absolute",
        top: "1056px",
        width: "530px",
      },
    }),
    text("SUN  15:40\n31.2304° N  /  121.4737° E", {
      fontFamily: "JetBrains Mono",
      fontSize: "16px",
      fontWeight: 700,
      left: "666px",
      letterSpacing: "0.08em",
      lineHeight: 1.65,
      position: "absolute",
      top: "1214px",
      whiteSpace: "pre-wrap",
      width: "360px",
    }),
  ],
  style: {
    backgroundColor: "#F7F3EA",
    color: "#171717",
    fontFamily: "Noto Sans SC",
    height: "100%",
    position: "relative",
    width: "100%",
  },
});

const png = await render(node, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: 1350,
  images: [{ data: photo, src: "asset:hero" }],
  renderer,
  width: 1080,
});

await writeFile(outputPath, png);
