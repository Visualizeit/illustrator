import { spawnSync } from "node:child_process";
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
});
