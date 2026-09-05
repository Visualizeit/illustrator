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

it("renders every identity example from its editable theme", async () => {
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
      '{"type":"module"}'
    );
    const temporaryExamples = path.join(temporaryRoot, "examples");
    await cp(
      path.join(examplesRoot, "theme.js"),
      path.join(temporaryExamples, "theme.js")
    );
    const entries = await readdir(examplesRoot, { withFileTypes: true });
    let checkedThemes = 0;
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const source = path.join(examplesRoot, entry.name);
      const files = await readdir(source);
      if (!files.includes("theme.css")) {
        continue;
      }
      const destination = path.join(temporaryExamples, entry.name);
      await cp(source, destination, { recursive: true });
      const themePath = path.join(destination, "theme.css");
      const themeCss = await readFile(themePath, "utf-8");
      const originalColor = themeCss.match(colorPattern)?.groups?.value;
      expect(originalColor, entry.name).toBeDefined();
      if (!originalColor) {
        throw new Error(`No color token in ${entry.name}`);
      }
      const outputs = [];
      for (const variant of ["original", "changed"]) {
        if (variant === "changed") {
          await writeFile(
            themePath,
            themeCss.replace(
              originalColor,
              originalColor.toLowerCase() === "#ff00ff" ? "#00ff00" : "#ff00ff"
            )
          );
        }
        const output = path.join(destination, `${variant}.png`);
        const result = spawnSync(
          process.execPath,
          [path.join(destination, "render.js"), output],
          { encoding: "utf-8", timeout: 30_000 }
        );
        expect(result.error, `${entry.name}: ${result.stderr}`).toBeUndefined();
        expect(result.status, `${entry.name}: ${result.stderr}`).toBe(0);
        outputs.push(await readFile(output));
      }
      const [original, changed] = outputs;
      expect(original?.equals(changed ?? Buffer.alloc(0)), entry.name).toBe(
        false
      );
      checkedThemes += 1;
    }
    expect(checkedThemes).toBe(9);
  } finally {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
}, 60_000);
