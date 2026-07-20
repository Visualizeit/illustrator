import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { lint } from "@google/design.md/linter";

const examplesRoot = fileURLToPath(
  new URL("../skills/illustrator/examples/", import.meta.url)
);

const entries = await readdir(examplesRoot, { withFileTypes: true });
const designDirectories = entries.filter((entry) => entry.isDirectory());
const validationResults = await Promise.all(
  designDirectories.map(async (directory) => {
    const directoryPath = path.join(examplesRoot, directory.name);
    const files = await readdir(directoryPath);

    if (!files.includes("DESIGN.md")) {
      return null;
    }

    const designPath = path.join(directoryPath, "DESIGN.md");
    const content = await readFile(designPath, "utf-8");
    const report = lint(content);
    return {
      designPath,
      errors: report.findings.filter((finding) => finding.severity === "error"),
    };
  })
);
const validatedDesigns = validationResults.filter((result) => result !== null);
const failures = validatedDesigns.flatMap(({ designPath, errors }) =>
  errors.map((error) => {
    const findingPath = error.path ? ` (${error.path})` : "";
    return `${designPath}${findingPath}: ${error.message}`;
  })
);

if (validatedDesigns.length === 0) {
  throw new Error("No DESIGN.md files were found.");
}

if (failures.length > 0) {
  throw new Error(`DESIGN.md validation failed:\n${failures.join("\n")}`);
}
