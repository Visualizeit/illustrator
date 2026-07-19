import { readFile } from "node:fs/promises";

import { Renderer } from "@takumi-rs/core";
import { render, renderSvg } from "takumi-js";
import { beforeAll, describe, expect, it } from "vitest";

const dimensions = {
  height: 630,
  width: 1200,
};

const markup = `
  <div tw="w-full h-full flex items-center justify-center bg-slate-950 text-white">
    <div tw="text-6xl font-bold" style="font-family:Noto Sans SC">
      Illustrator 开箱即用
    </div>
  </div>
`;

const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
const renderer = new Renderer();

describe("Takumi rendering", () => {
  beforeAll(async () => {
    const font = await readFile(
      new URL(
        "../../skills/illustrator/assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf",
        import.meta.url
      )
    );
    await renderer.registerFont({ data: font, name: "Noto Sans SC" });
  });

  it("renders PNG output", async () => {
    const png = await render(markup, {
      ...dimensions,
      fontFamilies: ["Noto Sans SC"],
      renderer,
    });

    expect([...png.subarray(0, pngSignature.length)]).toEqual(pngSignature);
    expect(png.byteLength).toBeGreaterThan(pngSignature.length);
  });

  it("renders SVG output", async () => {
    const svg = await renderSvg(markup, {
      ...dimensions,
      fontFamilies: ["Noto Sans SC"],
      renderer,
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain(`width="${dimensions.width}"`);
    expect(svg).toContain(`height="${dimensions.height}"`);
  });

  it("renders compact HTML with an empty absolute decoration", async () => {
    // Keep structural tags adjacent: fromHtml preserves formatting whitespace as text nodes.
    const html = `<div style="position:relative;width:100%;height:100%;background:#fff8de"><div style="position:absolute;left:50px;top:60px;width:200px;height:100px;background:#f0442e"></div></div>`;
    const svg = await renderSvg(html, {
      height: 300,
      renderer,
      width: 400,
    });

    expect(svg).toContain(
      '<rect x="50" y="60" width="200" height="100" fill="#f0442e"/>'
    );
  });

  it("renders inline SVG artwork through HTML", async () => {
    const html = `<div style="width:100%;height:100%;background:#f4efe3"><svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#d84a3c"/><path d="M100 35 C120 5 160 10 170 30 C145 52 120 55 100 35Z" fill="#64725a"/></svg></div>`;
    const svg = await renderSvg(html, {
      height: 300,
      renderer,
      width: 400,
    });
    const encodedArtwork = svg.match(
      /href="data:image\/svg\+xml;base64,(?<data>[^"]+)"/u
    )?.groups?.data;

    expect(encodedArtwork).toBeTruthy();
    const artwork = Buffer.from(encodedArtwork ?? "", "base64").toString(
      "utf-8"
    );
    expect(artwork).toContain("<circle");
    expect(artwork).toContain("<path");
    expect(artwork).toContain('fill="#d84a3c"');
  });
});
