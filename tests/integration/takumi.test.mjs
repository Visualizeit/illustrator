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
});
