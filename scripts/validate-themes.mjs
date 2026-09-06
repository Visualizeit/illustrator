import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const examplesRoot = fileURLToPath(
  new URL("../skills/illustrator/examples/", import.meta.url)
);

const themeTokenPattern = /--(?<kind>color|font)-(?<name>[\w-]+)\s*:/gu;
const tailwindAttributePattern = /\btw="(?<classes>[^"]*)"/gu;
const whitespacePattern = /\s+/u;

/**
 * @param {string} themeCss Theme declarations.
 * @param {string} renderSource Rendering module source.
 * @param {"color" | "font"} kind Token namespace.
 * @param {string[]} prefixes Utilities that consume the namespace.
 */
const usesThemeUtilities = (themeCss, renderSource, kind, prefixes) => {
  const utilities = new Set(
    [...renderSource.matchAll(tailwindAttributePattern)].flatMap((match) =>
      (match.groups?.classes ?? "").split(whitespacePattern)
    )
  );

  return [...themeCss.matchAll(themeTokenPattern)].some(
    (match) =>
      match.groups?.kind === kind &&
      prefixes.some((prefix) =>
        utilities.has(`${prefix}-${match.groups?.name}`)
      )
  );
};

const entries = await readdir(examplesRoot, { withFileTypes: true });
const exampleDirectories = entries.filter((entry) => entry.isDirectory());
const themeResults = await Promise.all(
  exampleDirectories.map(async (directory) => {
    const directoryPath = path.join(examplesRoot, directory.name);
    const files = await readdir(directoryPath);

    if (!files.includes("theme.css")) {
      return {
        errors: ["every example must include theme.css"],
        themePath: directoryPath,
      };
    }

    const themePath = path.join(directoryPath, "theme.css");
    const renderPath = path.join(directoryPath, "render.mjs");
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

    if (!content.includes("--text-") || !content.includes("--spacing-")) {
      errors.push("must define typography and spacing tokens");
    }

    if (!renderSource.includes("loadTheme")) {
      errors.push("render.mjs must load theme.css through loadTheme");
    }

    if (!renderSource.includes("css: [theme.css]")) {
      errors.push(
        "render.mjs must pass the loaded theme to render through css"
      );
    }

    if (
      !renderSource.includes("theme.color") &&
      !renderSource.includes("var(--color-") &&
      !usesThemeUtilities(content, renderSource, "color", [
        "bg",
        "text",
        "border",
      ])
    ) {
      errors.push("render.mjs must consume theme color tokens");
    }

    if (
      !renderSource.includes("theme.font") &&
      !renderSource.includes("var(--font-") &&
      !usesThemeUtilities(content, renderSource, "font", ["font"])
    ) {
      errors.push("render.mjs must consume theme font tokens");
    }

    return { errors, themePath };
  })
);

const failures = themeResults.flatMap(({ errors, themePath }) =>
  errors.map((error) => `${themePath}: ${error}`)
);

if (themeResults.length === 0) {
  throw new Error("No theme.css files were found.");
}

if (failures.length > 0) {
  throw new Error(`Theme validation failed:\n${failures.join("\n")}`);
}
