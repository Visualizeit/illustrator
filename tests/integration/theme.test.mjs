/* eslint-disable no-await-in-loop -- Render theme variants sequentially to bound native renderer memory and finish each file mutation before rendering. */
import { spawnSync } from "node:child_process";
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, it } from "vitest";

const skillRoot = fileURLToPath(
  new URL("../../skills/illustrator/", import.meta.url)
);
const examplesRoot = path.join(skillRoot, "examples");
const colorPattern = /--color-(?<name>[a-z0-9-]+):\s*(?<value>#[0-9a-f]{6});/iu;
const fontPattern = /--font-(?<family>display|mono):\s*(?<value>[^;]+);/gu;
const spacingPattern = /--spacing-[a-z0-9-]+:\s*(?<value>[\d.]+)px;/u;

it("renders every example with editable themes inside a CommonJS project", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "illustrator-themes-")
  );
  try {
    await symlink(
      path.join(skillRoot, "assets"),
      path.join(temporaryRoot, "assets")
    );
    await symlink(
      path.join(skillRoot, "node_modules"),
      path.join(temporaryRoot, "node_modules")
    );
    await writeFile(
      path.join(temporaryRoot, "package.json"),
      '{"type":"commonjs"}'
    );
    const temporaryExamples = path.join(temporaryRoot, "examples");
    await cp(
      path.join(examplesRoot, "theme.mjs"),
      path.join(temporaryExamples, "theme.mjs")
    );
    await cp(
      path.join(examplesRoot, "code-html.mjs"),
      path.join(temporaryExamples, "code-html.mjs")
    );
    const directoryEntries = await readdir(examplesRoot, {
      withFileTypes: true,
    });
    const entries = directoryEntries.filter((entry) => entry.isDirectory());
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const source = path.join(examplesRoot, entry.name);
      const files = await readdir(source);
      expect(files, `${entry.name} theme`).toContain("theme.css");
      const destination = path.join(temporaryExamples, entry.name);
      await cp(source, destination, { recursive: true });
      const themePath = path.join(destination, "theme.css");
      const themeCss = await readFile(themePath, "utf-8");
      expect(themeCss, `${entry.name} color token`).toMatch(colorPattern);
      expect(themeCss, `${entry.name} font token`).toMatch(fontPattern);
      expect(themeCss, `${entry.name} spacing token`).toMatch(spacingPattern);
      const variants = [
        { css: themeCss, name: "original" },
        {
          css: themeCss.replace(
            colorPattern,
            (_, name, value) =>
              `--color-${name}: ${value.toLowerCase() === "#ff00ff" ? "#00ff00" : "#ff00ff"};`
          ),
          name: "color",
        },
        {
          css: themeCss.replace(
            fontPattern,
            (_, family, value) =>
              `--font-${family}: ${value.includes("JetBrains") ? "Noto Sans SC" : "JetBrains Mono, Noto Sans SC"};`
          ),
          name: "font",
        },
        {
          css: themeCss.replace(spacingPattern, (declaration, value) =>
            declaration.replace(`${value}px`, `${Number(value) + 24}px`)
          ),
          name: "spacing",
        },
      ];
      const outputs = [];
      for (const variant of variants) {
        await writeFile(themePath, variant.css);
        const output = path.join(destination, `${variant.name}.png`);
        const result = spawnSync(
          process.execPath,
          [path.join(destination, "render.mjs"), output],
          { encoding: "utf-8", timeout: 30_000 }
        );
        expect(result.error, `${entry.name}: ${result.stderr}`).toBeUndefined();
        expect(result.status, `${entry.name}: ${result.stderr}`).toBe(0);
        outputs.push({ image: await readFile(output), name: variant.name });
      }
      const [original, ...changed] = outputs;
      for (const variant of changed) {
        expect(
          original?.image.equals(variant.image),
          `${entry.name}: ${variant.name} theme change must affect the render`
        ).toBe(false);
      }
    }
  } finally {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
}, 60_000);
