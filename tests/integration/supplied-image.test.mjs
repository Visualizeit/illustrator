import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { render } from "takumi-js";
import { describe, expect, it } from "vitest";

const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

describe("supplied image composition", () => {
  it("reads a local image and composes it through Takumi", async () => {
    const temporaryDirectory = await mkdtemp(
      path.join(tmpdir(), "illustrator-supplied-image-")
    );

    try {
      const sourceImage = await render(
        '<div style="width:100%;height:100%;background:#e11d48;"></div>',
        { height: 96, width: 96 }
      );
      const sourcePath = path.join(temporaryDirectory, "source.png");
      await writeFile(sourcePath, sourceImage);

      const imageData = await readFile(sourcePath);
      const composition = await render(
        `
          <div style="width:100%;height:100%;background:#0f172a;padding:24px;">
            <img
              src="asset:source"
              style="width:100%;height:100%;object-fit:cover;border-radius:20px;"
            />
          </div>
        `,
        {
          height: 320,
          images: [{ data: imageData, src: "asset:source" }],
          width: 640,
        }
      );

      expect([...composition.subarray(0, pngSignature.length)]).toEqual(
        pngSignature
      );
      expect(composition.byteLength).toBeGreaterThan(pngSignature.length);
    } finally {
      await rm(temporaryDirectory, { force: true, recursive: true });
    }
  });
});
