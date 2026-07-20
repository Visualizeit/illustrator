import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const skillRoot = fileURLToPath(
  new URL("../../skills/illustrator/", import.meta.url)
);

describe("Illustrator Skill runtime", () => {
  it("loads runtime dependencies from a generated module", () => {
    const generatedModule = `
      const [{ render }, { codeToHtml }] = await Promise.all([
        import("takumi-js"),
        import("shiki")
      ]);

      if (typeof render !== "function" || typeof codeToHtml !== "function") {
        throw new Error("Runtime exports are unavailable");
      }
    `;

    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "--eval", generatedModule],
      {
        cwd: skillRoot,
        encoding: "utf-8",
      }
    );

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });

  it("keeps development and Skill runtime versions aligned", async () => {
    const [repositoryPackage, skillPackage] = await Promise.all([
      readFile(new URL("../../package.json", import.meta.url)),
      readFile(
        new URL("../../skills/illustrator/package.json", import.meta.url)
      ),
    ]);
    const repositoryManifest = JSON.parse(repositoryPackage.toString());
    const skillManifest = JSON.parse(skillPackage.toString());

    for (const dependency of Object.keys(skillManifest.dependencies)) {
      const developmentVersion =
        repositoryManifest.dependencies?.[dependency] ??
        repositoryManifest.devDependencies?.[dependency];
      expect(developmentVersion, dependency).toBe(
        skillManifest.dependencies[dependency]
      );
    }
  });
});
