import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const skillRoot = fileURLToPath(
  new URL("../../skills/illustrator/", import.meta.url)
);
const examplesRoot = path.join(skillRoot, "examples");
const examplesReferencePath = path.join(skillRoot, "references", "examples.md");
const noticesPath = path.join(skillRoot, "THIRD_PARTY_NOTICES.md");
const routedExamplePattern = /^\|[^|\r\n]+\| `(?<exampleName>[^`]+)` \|/gmu;

describe("Illustrator examples", () => {
  it("keeps every bundled example reproducible", async () => {
    const outputDirectory = await mkdtemp(
      path.join(tmpdir(), "illustrator-examples-")
    );

    try {
      const entries = await readdir(examplesRoot, { withFileTypes: true });
      const exampleDirectories = entries
        .filter((entry) => entry.isDirectory())
        .toSorted((left, right) => left.name.localeCompare(right.name));
      const [examplesReference, thirdPartyNotices] = await Promise.all([
        readFile(examplesReferencePath, "utf-8"),
        readFile(noticesPath, "utf-8"),
      ]);
      const exampleNames = exampleDirectories.map((entry) => entry.name);
      const routedExampleNames = [
        ...examplesReference.matchAll(routedExamplePattern),
      ]
        .flatMap((match) => {
          const exampleName = match.groups?.exampleName;
          return exampleName ? [exampleName] : [];
        })
        .toSorted();

      expect(exampleDirectories.length).toBeGreaterThan(0);
      expect(routedExampleNames).toEqual(exampleNames);

      await Promise.all(
        exampleDirectories.map(async (exampleDirectory) => {
          const examplePath = path.join(examplesRoot, exampleDirectory.name);
          const files = await readdir(examplePath);
          const renderPath = path.join(examplePath, "render.mjs");
          const previewPath = path.join(examplePath, "preview.png");
          const outputPath = path.join(
            outputDirectory,
            `${exampleDirectory.name}.png`
          );

          expect(files, `${exampleDirectory.name} artifacts`).toContain(
            "render.mjs"
          );
          expect(files, `${exampleDirectory.name} artifacts`).toContain(
            "preview.png"
          );

          for (const sourceFile of files.filter((file) =>
            file.startsWith("source.")
          )) {
            expect(thirdPartyNotices).toContain(
              `examples/${exampleDirectory.name}/${sourceFile}`
            );
          }

          const result = spawnSync(process.execPath, [renderPath, outputPath], {
            cwd: examplePath,
            encoding: "utf-8",
            timeout: 30_000,
          });

          expect(
            result.error,
            `${exampleDirectory.name}: ${result.stderr}`
          ).toBeUndefined();
          expect(
            result.status,
            `${exampleDirectory.name}: ${result.stderr}`
          ).toBe(0);

          const [expectedPreview, renderedPreview] = await Promise.all([
            readFile(previewPath),
            readFile(outputPath),
          ]);
          expect(
            renderedPreview.equals(expectedPreview),
            `${exampleDirectory.name} preview is stale`
          ).toBe(true);
        })
      );
    } finally {
      await rm(outputDirectory, { force: true, recursive: true });
    }
  }, 60_000);
});
