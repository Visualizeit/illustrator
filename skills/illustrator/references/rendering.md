# Rendering

Write plain ESM in the temporary `.mjs` module. Prefer an HTML string for general graphics and Takumi node helpers when mapping structured data. Do not introduce TSX or a build step.

## Takumi

- `render` accepts an HTML string, a React-like element, or a Takumi node tree.
- Use the `tw` attribute for supported Tailwind utilities. Inline `style` and embedded stylesheets are also accepted.
- Use `container`, `text`, and `image` from `takumi-js/helpers` when a node tree is clearer than HTML.
- `render` supports PNG, JPEG, WebP, ICO, and raw pixels. Use `renderSvg` for SVG.
- Width and height can be inferred from content, but always set both for a designed image. `devicePixelRatio` defaults to `1`.
- Register fonts on a `Renderer` from `@takumi-rs/core`, then pass that renderer to `render`. The high-level function has no `fonts` option.
- PNG does not accept quality settings. JPEG accepts `quality` from 0 to 100. WebP is lossless when both `quality` and `lossless` are omitted.
- Emoji rendering defaults to Twemoji.

Takumi is not a browser. Treat CSS and Tailwind as the renderer's supported subset, not as a complete DOM or Tailwind build pipeline. No Tailwind configuration or plugin hook is exposed by the installed rendering API. Prefer common layout, spacing, typography, color, border, and effect utilities; fall back to inline styles and simplify unsupported effects.

Use `assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf` for general text. Register other bundled fonts only when the selected workflow calls for them.

Use a user-provided or system font only when explicitly requested. Missing glyphs can render as boxes without throwing, so set the family in the composition and inspect the result.

Minimal HTML render:

```js
import { readFile, writeFile } from "node:fs/promises";
import { Renderer } from "@takumi-rs/core";
import { render } from "takumi-js";
const renderer = new Renderer();
const font = await readFile(
  new URL("./assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf", import.meta.url)
);
await renderer.registerFont({ data: font, name: "Noto Sans SC" });
const html = `
  <div tw="w-full h-full flex items-center justify-center bg-slate-950 text-white">
    <div tw="text-6xl font-bold" style="font-family:Noto Sans SC">Hello Illustrator</div>
  </div>
`;
const png = await render(html, {
  renderer,
  width: 1200,
  height: 630,
  format: "png",
  fontFamilies: ["Noto Sans SC"],
});
await writeFile(outputPath, png);
```

## Installed API Discovery

Treat the declarations installed under `SKILL_ROOT/node_modules` as the source of truth for the locked dependency versions. When a needed option is not covered above, inspect `takumi-js`, `@takumi-rs/core`, and `@takumi-rs/helpers` `.d.mts` files before relying on model memory or network documentation.
