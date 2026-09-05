import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const examplesRoot = fileURLToPath(
  new URL("../skills/illustrator/examples/", import.meta.url)
);

const entries = await readdir(examplesRoot, { withFileTypes: true });
const exampleDirectories = entries.filter((entry) => entry.isDirectory());
const themeResults = await Promise.all(
  exampleDirectories.map(async (directory) => {
    const directoryPath = path.join(examplesRoot, directory.name);
    const files = await readdir(directoryPath);

    if (!files.includes("theme.css")) {
      return null;
    }

    const themePath = path.join(directoryPath, "theme.css");
    const renderPath = path.join(directoryPath, "render.js");
    const [content, renderSource] = await Promise.all([
      readFile(themePath, "utf-8"),
      readFile(renderPath, "utf-8"),
    ]);
    const errors = [];

    if (!content.includes("@theme")) {
      errors.push("must define a Tailwind @theme block");
    }

    if (!content.includes("--font-display:")) {
      errors.push("must define --font-display");
    }

    if (!content.includes("--color-")) {
      errors.push("must define at least one --color-* token");
    }

    if (!renderSource.includes("loadTheme")) {
      errors.push("render.js must load theme.css through loadTheme");
    }

    if (!renderSource.includes("css: [theme.css]")) {
      errors.push("render.js must pass the loaded theme to render through css");
    }

    if (
      !renderSource.includes("theme.color") &&
      !renderSource.includes("var(--color-")
    ) {
      errors.push("render.js must consume theme color tokens");
    }

    if (
      !renderSource.includes("theme.font") &&
      !renderSource.includes("var(--font-")
    ) {
      errors.push("render.js must consume theme font tokens");
    }

    return { errors, themePath };
  })
);

const validatedThemes = themeResults.filter((result) => result !== null);
const failures = validatedThemes.flatMap(({ errors, themePath }) =>
  errors.map((error) => `${themePath}: ${error}`)
);

if (validatedThemes.length === 0) {
  throw new Error("No theme.css files were found.");
}

if (failures.length > 0) {
  throw new Error(`Theme validation failed:\n${failures.join("\n")}`);
}
