import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const skillRoot = fileURLToPath(
  new URL("../../skills/illustrator/", import.meta.url)
);
const pngSignature = "89504e470d0a1a0a";

describe("code image rendering", () => {
  it("renders Shiki tokens through Takumi", () => {
    const generatedModule = `
      import { readFile } from "node:fs/promises";
      import { Renderer } from "@takumi-rs/core";
      import { codeToTokens } from "shiki";
      import { render } from "takumi-js";
      import { container, text } from "takumi-js/helpers";

      const source = '// Keep indentation and Chinese comments: 保持缩进\\nconst answer = 42;';
      const highlighted = await codeToTokens(source, {
        lang: "javascript",
        theme: "material-theme-palenight",
      });

      const fontStyleBits = {
        bold: 2,
        italic: 1,
        strikethrough: 8,
        underline: 4,
      };
      const tokenStyle = (token) => {
        const fontStyle = token.fontStyle ?? 0;
        const textDecoration = [
          fontStyle & fontStyleBits.underline ? "underline" : "",
          fontStyle & fontStyleBits.strikethrough ? "line-through" : "",
        ].filter(Boolean).join(" ");
        return {
          color: token.color,
          display: "inline",
          fontStyle: fontStyle & fontStyleBits.italic ? "italic" : undefined,
          fontWeight: fontStyle & fontStyleBits.bold ? 700 : undefined,
          textDecoration: textDecoration || undefined,
        };
      };

      if (highlighted.tokens[0]?.[0]?.fontStyle !== fontStyleBits.italic) {
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

      const codeBlock = container({
        style: {
          backgroundColor: highlighted.bg,
          color: highlighted.fg,
          display: "flex",
          flexDirection: "column",
          fontFamily: "JetBrains Mono, Noto Sans SC",
          fontSize: 24,
          height: "100%",
          lineHeight: 1.5,
          padding: 32,
          width: "100%",
        },
        children: highlighted.tokens.map((line) =>
          container({
            style: {
              display: "block",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
              width: "100%",
            },
            children: line.map((token) =>
              text({
                text: token.content,
                style: tokenStyle(token),
              })
            ),
          })
        ),
      });

      const png = await render(codeBlock, {
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
