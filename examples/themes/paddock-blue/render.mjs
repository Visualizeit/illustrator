import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";
import { container, image, text } from "takumi-js/helpers";

// Photo by Mick Waanders on Unsplash:
// https://unsplash.com/photos/race-car-speeding-on-a-track-with-motion-blur-k2NSPo9de-U
const photoPath = new URL("source.jpg", import.meta.url);
const outputPath =
  process.argv[2] ??
  new URL("../../../docs/assets/paddock-blue.png", import.meta.url);
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
  clay: "#C8734D",
  denim: "#304F58",
  mist: "#C6C1B8",
  oat: "#E8E1D6",
  powder: "#8DB4BC",
  stone: "#66645F",
};

const metrics = [
  ["327", "KM/H · VMAX"],
  ["13,800", "RPM"],
  ["57 / 57", "FINAL LAP"],
  ["00:01.327", "SECTOR TIME"],
];

const metricNodes = metrics.map(([value, label], index) =>
  container({
    children: [
      container({
        style: {
          backgroundColor: index === 0 ? palette.clay : palette.mist,
          height: "2px",
          left: "0px",
          position: "absolute",
          top: "0px",
          width: "218px",
        },
      }),
      text(value, {
        color: index === 3 ? palette.clay : palette.denim,
        fontFamily: "JetBrains Mono",
        fontSize: index === 3 ? "30px" : "36px",
        fontWeight: 700,
        left: "0px",
        letterSpacing: "-0.045em",
        position: "absolute",
        top: "17px",
      }),
      text(label, {
        color: palette.stone,
        fontFamily: "JetBrains Mono",
        fontSize: "11px",
        fontWeight: 700,
        left: "2px",
        letterSpacing: "0.14em",
        position: "absolute",
        top: "65px",
      }),
    ],
    style: {
      height: "92px",
      left: `${58 + index * 252}px`,
      position: "absolute",
      top: "1082px",
      width: "218px",
    },
  })
);

const photo = await readFile(photoPath);
const node = container({
  children: [
    image({
      src: "asset:hero",
      style: {
        height: "666px",
        left: "58px",
        objectFit: "cover",
        objectPosition: "center center",
        position: "absolute",
        top: "48px",
        width: "964px",
      },
    }),
    container({
      style: {
        backgroundColor: palette.powder,
        height: "666px",
        left: "58px",
        opacity: 0.08,
        position: "absolute",
        top: "48px",
        width: "964px",
      },
    }),
    container({
      style: {
        backgroundColor: palette.powder,
        height: "8px",
        left: "58px",
        position: "absolute",
        top: "736px",
        width: "600px",
      },
    }),
    container({
      style: {
        backgroundColor: palette.clay,
        height: "8px",
        left: "658px",
        position: "absolute",
        top: "736px",
        width: "364px",
      },
    }),
    text("PHOTO / MICK WAANDERS · UNSPLASH", {
      color: palette.stone,
      fontFamily: "JetBrains Mono",
      fontSize: "10px",
      fontWeight: 700,
      left: "58px",
      letterSpacing: "0.13em",
      position: "absolute",
      top: "762px",
    }),
    text("THE LAST LAP\nTAKES EVERYTHING.", {
      color: palette.denim,
      fontFamily: "Noto Sans SC",
      fontSize: "88px",
      fontWeight: 700,
      left: "56px",
      letterSpacing: "-0.045em",
      lineHeight: 0.94,
      position: "absolute",
      top: "814px",
      whiteSpace: "pre-wrap",
      width: "966px",
    }),
    ...metricNodes,
    container({
      style: {
        backgroundColor: palette.powder,
        height: "10px",
        left: "58px",
        position: "absolute",
        top: "1208px",
        width: "580px",
      },
    }),
    container({
      style: {
        backgroundColor: palette.clay,
        height: "10px",
        left: "638px",
        position: "absolute",
        top: "1208px",
        width: "384px",
      },
    }),
    text("PADDOCK BLUE  /  RACING NOTES", {
      color: palette.stone,
      fontFamily: "JetBrains Mono",
      fontSize: "11px",
      fontWeight: 700,
      left: "58px",
      letterSpacing: "0.13em",
      position: "absolute",
      top: "1264px",
    }),
    text("FINAL LAP  /  2026", {
      color: palette.denim,
      fontFamily: "JetBrains Mono",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.13em",
      position: "absolute",
      right: "58px",
      top: "1264px",
    }),
  ],
  style: {
    backgroundColor: palette.oat,
    color: palette.denim,
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
