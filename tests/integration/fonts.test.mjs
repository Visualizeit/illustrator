import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const skillRoot = fileURLToPath(
  new URL("../../skills/illustrator/", import.meta.url)
);

describe("font discovery", () => {
  it("discovers font metadata independently of filenames and reports unreadable fonts", async () => {
    const temporaryRoot = await mkdtemp(
      path.join(tmpdir(), "illustrator-fonts-")
    );

    const fontDirectory = path.join(temporaryRoot, "assets", "fonts", "自定义");
    const script = path.join(temporaryRoot, "scripts", "list-fonts.mjs");

    try {
      await Promise.all([
        mkdir(fontDirectory, { recursive: true }),
        cp(path.join(skillRoot, "scripts", "list-fonts.mjs"), script),
        symlink(
          path.join(skillRoot, "node_modules"),
          path.join(temporaryRoot, "node_modules")
        ),
      ]);
      await Promise.all([
        cp(
          path.join(
            skillRoot,
            "assets",
            "fonts",
            "jetbrains-mono",
            "JetBrainsMono-VF.ttf"
          ),
          path.join(fontDirectory, "custom.TTF")
        ),
        cp(
          path.join(
            skillRoot,
            "assets",
            "fonts",
            "jetbrains-mono",
            "JetBrainsMono-Italic-VF.ttf"
          ),
          path.join(fontDirectory, "slanted.ttf")
        ),
        writeFile(
          path.join(fontDirectory, "README.md"),
          "Font selection notes."
        ),
      ]);

      const result = spawnSync(process.execPath, [script], {
        cwd: tmpdir(),
        encoding: "utf-8",
        timeout: 30_000,
      });

      expect({
        error: result.error,
        status: result.status,
        stderr: result.stderr,
      }).toStrictEqual({ error: undefined, status: 0, stderr: "" });
      const fonts = JSON.parse(result.stdout);
      expect(fonts).toStrictEqual([
        {
          families: [
            {
              faces: [{ index: 0, style: "normal", weight: 400, width: 100 }],
              name: "JetBrains Mono",
            },
          ],
          path: "assets/fonts/自定义/custom.TTF",
        },
        {
          families: [
            {
              faces: [{ index: 0, style: "italic", weight: 400, width: 100 }],
              name: "JetBrains Mono",
            },
          ],
          path: "assets/fonts/自定义/slanted.ttf",
        },
      ]);

      await writeFile(path.join(fontDirectory, "broken.ttf"), "Not a font.");

      const brokenResult = spawnSync(process.execPath, [script], {
        cwd: tmpdir(),
        encoding: "utf-8",
        timeout: 30_000,
      });

      expect({
        error: brokenResult.error,
        status: brokenResult.status,
      }).toStrictEqual({ error: undefined, status: 1 });
      expect(JSON.parse(brokenResult.stdout)).toStrictEqual([
        { error: expect.any(String), path: "assets/fonts/自定义/broken.ttf" },
        ...fonts,
      ]);
    } finally {
      await rm(temporaryRoot, { force: true, recursive: true });
    }
  });
});
