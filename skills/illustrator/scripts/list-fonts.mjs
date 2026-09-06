import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Renderer } from "@takumi-rs/core";

const skillRoot = fileURLToPath(new URL("../", import.meta.url));
const fontRoot = path.join(skillRoot, "assets", "fonts");
const fontExtensions = new Set([".ttf", ".otf", ".ttc", ".otc"]);

/** @param {string} directory @returns {Promise<string[]>} */
const findFonts = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return findFonts(entryPath);
      }
      return entry.isFile() &&
        fontExtensions.has(path.extname(entry.name).toLowerCase())
        ? [entryPath]
        : [];
    })
  );
  return files.flat().toSorted();
};

const files = await findFonts(fontRoot);
const results = await Promise.all(
  files.map(async (file) => {
    const relativePath = path
      .relative(skillRoot, file)
      .split(path.sep)
      .join("/");
    try {
      // Inspect each file independently so faces from another file cannot be included.
      const renderer = new Renderer();
      const families = await renderer.registerFont(await readFile(file));
      if (families.length === 0) {
        throw new Error("No font families were registered.");
      }
      return { families, path: relativePath };
    } catch (error) {
      process.exitCode = 1;
      return {
        error: error instanceof Error ? error.message : String(error),
        path: relativePath,
      };
    }
  })
);

process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
