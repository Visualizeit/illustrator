import { readFile, writeFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";

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

const metricHtml = metrics
  .map(
    ([value, label], index) =>
      `<div style="position:absolute;left:${58 + index * 252}px;top:1082px;width:218px;height:92px"><div style="position:absolute;left:0;top:0;width:218px;height:2px;background:${index === 0 ? palette.clay : palette.mist}"></div><div style="position:absolute;left:0;top:17px;color:${index === 3 ? palette.clay : palette.denim};font-family:JetBrains Mono;font-size:${index === 3 ? "30px" : "36px"};font-weight:700;letter-spacing:-0.045em">${value}</div><div style="position:absolute;left:2px;top:65px;color:${palette.stone};font-family:JetBrains Mono;font-size:11px;font-weight:700;letter-spacing:0.14em">${label}</div></div>`
  )
  .join("");

const photo = await readFile(photoPath);
const html = [
  `<div style="position:relative;width:100%;height:100%;background:${palette.oat};color:${palette.denim};font-family:Noto Sans SC">`,
  '<img src="asset:hero" style="position:absolute;left:58px;top:48px;width:964px;height:666px;object-fit:cover;object-position:center center"/>',
  `<div style="position:absolute;left:58px;top:48px;width:964px;height:666px;background:${palette.powder};opacity:0.08"></div>`,
  `<div style="position:absolute;left:58px;top:736px;width:600px;height:8px;background:${palette.powder}"></div>`,
  `<div style="position:absolute;left:658px;top:736px;width:364px;height:8px;background:${palette.clay}"></div>`,
  `<div style="position:absolute;left:58px;top:762px;color:${palette.stone};font-family:JetBrains Mono;font-size:10px;font-weight:700;letter-spacing:0.13em">PHOTO / MICK WAANDERS · UNSPLASH</div>`,
  `<div style="position:absolute;left:56px;top:814px;width:966px;color:${palette.denim};font-family:Noto Sans SC;font-size:88px;font-weight:700;line-height:0.94;letter-spacing:-0.045em;white-space:pre-wrap">HOLD THE LINE.\nTAKE THE LEAD.</div>`,
  metricHtml,
  `<div style="position:absolute;left:58px;top:1208px;width:580px;height:10px;background:${palette.powder}"></div>`,
  `<div style="position:absolute;left:638px;top:1208px;width:384px;height:10px;background:${palette.clay}"></div>`,
  `<div style="position:absolute;left:58px;top:1264px;color:${palette.stone};font-family:JetBrains Mono;font-size:11px;font-weight:700;letter-spacing:0.13em">PADDOCK BLUE  /  RACING NOTES</div>`,
  `<div style="position:absolute;right:58px;top:1264px;color:${palette.denim};font-family:JetBrains Mono;font-size:11px;font-weight:700;letter-spacing:0.13em">FINAL LAP  /  2026</div>`,
  "</div>",
].join("");

const png = await render(html, {
  fontFamilies: ["Noto Sans SC", "JetBrains Mono"],
  format: "png",
  height: 1350,
  images: [{ data: photo, src: "asset:hero" }],
  renderer,
  width: 1080,
});

await writeFile(outputPath, png);
