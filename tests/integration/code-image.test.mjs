import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  escapeHtml,
  tokensToHtml,
} from "../../skills/illustrator/examples/code-html.mjs";

const skillRoot = fileURLToPath(
  new URL("../../skills/illustrator/", import.meta.url)
);
const pngSignature = "89504e470d0a1a0a";

describe("code image rendering", () => {
  it("escapes markup without changing whitespace or literal entities", () => {
    expect(escapeHtml('\t  <img title="\'">&amp;\n保持缩进')).toBe(
      "\t  &lt;img title=&quot;&#39;&quot;&gt;&amp;amp;\n保持缩进"
    );
  });

  it("preserves combined syntax styles and fallback colors in HTML", () => {
    const combinedFontStyle = 1 + 2 + 4 + 8;
    const html = tokensToHtml(
      [
        { content: "<value>", fontStyle: combinedFontStyle, offset: 0 },
        { color: "#ff0000", content: " & ", offset: 7 },
      ],
      "#123456"
    );

    expect(html).toContain("color:#123456");
    expect(html).toContain("font-style:italic");
    expect(html).toContain("font-weight:700");
    expect(html).toContain("text-decoration:underline line-through");
    expect(html).toContain(">&lt;value&gt;</span>");
    expect(html).toContain('<span style="color:#ff0000"> &amp; </span>');
    expect(tokensToHtml([], "#123456")).toBe("");
  });

  it("renders Shiki tokens as HTML through the Skill runtime", () => {
    const generatedModule = String.raw`
      import { readFile } from "node:fs/promises";
      import { Renderer } from "@takumi-rs/core";
      import { codeToTokens } from "shiki";
      import { render } from "takumi-js";
      import { tokensToHtml } from "./examples/code-html.mjs";

      const source = "// Keep indentation and Chinese comments: 保持缩进\n\tconst markup = '<img src=\"missing\">&amp;';";
      const highlighted = await codeToTokens(source, {
        lang: "javascript",
        theme: "material-theme-palenight",
      });

      if (highlighted.tokens[0]?.[0]?.fontStyle !== 1) {
        throw new Error("The syntax theme did not produce the expected italic token");
      }

      const renderer = new Renderer();
      const fontFiles = [
        ["./assets/fonts/jetbrains-mono/JetBrainsMono-VF.ttf", "JetBrains Mono", "normal"],
        ["./assets/fonts/jetbrains-mono/JetBrainsMono-Italic-VF.ttf", "JetBrains Mono", "italic"],
        ["./assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf", "Noto Sans SC", "normal"],
      ];
      for (const [path, name, style] of fontFiles) {
        const data = await readFile(new URL(path, import.meta.url));
        await renderer.registerFont({ data, name, style });
      }

      const codeRows = highlighted.tokens.map((line) =>
        '<div style="min-height:36px;white-space:pre-wrap;overflow-wrap:break-word">' +
        tokensToHtml(line, highlighted.fg) + '</div>'
      ).join("");
      const html = '<div tw="flex flex-col w-full h-full" style="font-family:JetBrains Mono, Noto Sans SC;font-size:24px;line-height:1.5;padding:32px;background:' + highlighted.bg + '">' + codeRows + '</div>';

      const png = await render(html, {
        format: "png",
        fontFamilies: ["JetBrains Mono", "Noto Sans SC"],
        height: 320,
        renderer,
        width: 640,
      });

      process.stdout.write(Buffer.from(png.subarray(0, 8)).toString("hex"));
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
    expect(result.stdout).toBe(pngSignature);
  });
});
