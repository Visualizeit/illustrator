import { render, renderSvg } from "takumi-js";
import { describe, expect, it } from "vitest";

const dimensions = {
  height: 630,
  width: 1200,
};

const markup = `
  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f4efe6;color:#181713;">
    <div style="font-size:72px;font-weight:700;">Hello Illustrator</div>
  </div>
`;

const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

describe("Takumi rendering", () => {
  it("renders PNG output", async () => {
    const png = await render(markup, {
      ...dimensions,
      format: "png",
    });

    expect([...png.subarray(0, pngSignature.length)]).toEqual(pngSignature);
    expect(png.byteLength).toBeGreaterThan(pngSignature.length);
  });

  it("renders SVG output", async () => {
    const svg = await renderSvg(markup, dimensions);

    expect(svg).toContain("<svg");
    expect(svg).toContain(`width="${dimensions.width}"`);
    expect(svg).toContain(`height="${dimensions.height}"`);
  });
});
