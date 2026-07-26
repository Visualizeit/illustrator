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

## HTML and Style Compatibility

Use the high-level `render` or `renderSvg` function for ordinary HTML. It performs the HTML-to-node conversion and forwards embedded stylesheets correctly. Do not call `fromHtml` and the low-level `Renderer` directly unless the task requires it; if you do, pass both returned values: `node` and `stylesheets`.

Takumi converts HTML into a node tree rather than a browser DOM. Treat CSS and Tailwind as supported subsets: no Tailwind configuration or plugin hook is exposed, and a successful render does not prove that every browser feature was applied. Prefer common layout, spacing, typography, color, border, and effect utilities; fall back to inline styles and simplify unsupported effects.

- Prefer flex, block, or absolute layout; explicit dimensions; spacing; typography; colors; backgrounds; borders; radii; and opacity.
- Give decorative empty elements explicit width, height, and paint.
- Treat grid, pseudo-elements, stateful selectors, filters, masks, blend modes, and browser-specific behavior as unverified until a minimal render confirms them.
- Do not depend on exact DOM identity or child indexes. An element containing only text may become a Takumi text node.

The locked HTML parser preserves whitespace between tags as text nodes. In the locked version, those whitespace siblings can cause an empty absolutely positioned decorative element to disappear even though rendering succeeds. Keep structural tags adjacent around empty or absolute decorations, or create those decorations with Takumi node helpers. Preserve deliberate spaces inside textual content; do not blindly minify prose.

## Inline SVG

Use HTML for layout and text, then embed a compact `<svg>` for focal marks, curved illustrations, and print textures that would otherwise require many positioned containers. Set explicit `width`, `height`, and `viewBox` values. Prefer `path`, `circle`, `ellipse`, `rect`, `line`, `polygon`, groups, transforms, fills, strokes, opacity, and simple patterns. Treat filters, masks, `foreignObject`, and other advanced SVG behavior as unverified until rendered and inspected.

The locked renderer accepts inline SVG and carries it through as an image node. Keep important text in HTML so registered fonts, wrapping, and layout remain predictable. `renderSvg` controls the final output format; it is separate from using inline SVG as composition input.

When image viewing is unavailable, keep to the conservative subset above and render a temporary SVG under `SKILL_ROOT/tmp/` before the final raster image. Check its canvas dimensions and confirm that essential visual primitives are present—for example, expected fills, positioned rectangles, image elements, or paths. Do not treat a valid PNG signature or a successful exit code as visual verification.

## Fonts

Register only the fonts used by the composition and include their family names in `fontFamilies`.

- **Noto Sans SC** (`assets/fonts/noto-sans-sc/NotoSansSC-VF.ttf`): Chinese, general text, and CJK fallback.
- **Lora** (`assets/fonts/lora/Lora-VF.ttf`): editorial Latin text. Register the italic file as `Lora Italic` and use it sparingly for artwork names or expressive emphasis.
- **JetBrains Mono** (`assets/fonts/jetbrains-mono/`): code, commands, data, URLs, and technical metadata.

For mixed Chinese and Latin text, use Noto Sans SC as the base and apply Lora only to Latin runs. Use user-provided or system fonts only when explicitly requested. Inspect the output because missing glyphs may render as boxes without errors.

## Local Images

Read local images as bytes and pass them through the `images` render option under a stable in-memory source key. Use the same key in an HTML `src` or Takumi image node. Do not rely on `file:` URLs or the current working directory. The image helper may also receive bytes directly, but named sources are clearer when an HTML composition reuses an asset.

For complete local-image implementations, read the `render.mjs` from `field-archive` for a transparent subject or `flash-diary` for a cropped photograph, following [examples.md](examples.md).

## Installed API Discovery

Treat the declarations installed under `SKILL_ROOT/node_modules` as the source of truth for the locked dependency versions. When a needed option is not covered above, inspect `takumi-js`, `@takumi-rs/core`, and `@takumi-rs/helpers` `.d.mts` files before relying on model memory or network documentation.
