# Rendering

## Setup

Requires Node.js 20.19 or newer. On first use or dependency resolution failure, check:

```sh
npm --prefix "$SKILL_ROOT" ls --omit=dev --depth=0
```

Install missing or invalid dependencies from the lockfile:

```sh
npm --prefix "$SKILL_ROOT" ci --omit=dev --no-audit --no-fund
```

## Takumi API

- Pass an HTML string to `render` from `takumi-js`. It handles HTML conversion and embedded CSS.
- Pass CSS strings or rule objects through `css`; HTML Tailwind utilities use `tw`, not `class` or `className`.
- `render` outputs PNG, JPEG, WebP, ICO, or raw pixels; `renderSvg` outputs SVG.
- Set width and height for a fixed canvas; omitted dimensions use content sizing.
- Register fonts on a `Renderer` from `@takumi-rs/core`, including italic faces when needed. Pass it to `render` with the selected families in `fontFamilies`; there is no `fonts` option.
- PNG has no quality setting. JPEG accepts `quality` from 0 to 100. WebP is lossless when `quality` and `lossless` are both omitted.

For other options, inspect installed declarations under `SKILL_ROOT/node_modules` for `takumi-js`, `@takumi-rs/core`, or `@takumi-rs/helpers`.

## Layout and SVG

Set `flex` with `flex-row` or `flex-col` on content containers, then use `gap`, padding, and alignment utilities to position their children. Grid is appropriate when both rows and columns need shared alignment.

Escape supplied text and attribute values before interpolating them into HTML. Preserve code whitespace with `whitespace-pre` or `whitespace-pre-wrap`; [the code helper](../examples/code-html.mjs) converts Shiki tokens to escaped spans with combined font styles.

Takumi creates a node tree, not a browser DOM. Text-only elements may become text nodes, so DOM child indexes are not stable. Empty decorative elements need explicit dimensions and paint.

Pass a task-specific `@theme` through `css`. Use role-based tokens such as `--color-paper`, `--font-display`, `--text-title`, and `--spacing-section` via `bg-paper`, `font-display`, `text-title`, and `gap-section`. Reuse a small spacing scale across the composition; avoid separate tokens for every coordinate or repeated arbitrary utilities such as `mt-[37px]`. Standard structural utilities such as `flex-1` and `w-full` need no theme token. Classes are resolved at render time, so dynamic roles can use `tw="bg-${surface} text-${tone}"` without a build-time safelist.

Color and font-size tokens both generate `text-*` utilities. Give them distinct suffixes, such as `--color-muted-ink` and `--text-body`, to avoid ambiguity.

The bundled runtime does not resolve custom shadow and background-image theme utilities; use inline `var()` references for these properties.

`:root` custom properties are also supported. Directives such as `@config`, `@plugin`, `@utility`, `@custom-variant`, and `@source` require an external Tailwind build.

Inline SVG becomes an image node. Set its `width`, `height`, and `viewBox`. HTML text supports wrapping and registered fonts more predictably. SVG attributes such as `fill` and `stroke` need resolved values rather than CSS `var()`; [the theme helper](../examples/theme.mjs) extracts token values.

Complex grid sizing, pseudo-elements, filters, masks, blend modes, and advanced SVG features may differ from a browser. Test a small render when the design depends on one.

## Fonts

| Family | Bundled files under `assets/fonts/` | Coverage |
| --- | --- | --- |
| Noto Sans SC | `noto-sans-sc/NotoSansSC-VF.ttf` | Chinese / CJK fallback |
| Lora | `lora/Lora-VF.ttf`, `lora/Lora-Italic-VF.ttf` | Latin serif |
| JetBrains Mono | `jetbrains-mono/JetBrainsMono-VF.ttf`, `jetbrains-mono/JetBrainsMono-Italic-VF.ttf` | Latin monospace |

Add a CJK fallback to Latin-only families for mixed-language text. Missing glyphs can produce boxes without a render error.

## Local Images

Load local images as bytes into the `images` option under source keys, then use those keys in HTML `src` attributes. Local `file:` URLs are not a reliable input mechanism.

## Verification

When viewing is available, inspect the output at its intended viewing size for missing content or glyphs, accidental clipping, readability, and fit to the request.

Otherwise, check encoding, dimensions, and verifiable layout or content properties. A temporary SVG can help inspect elements and positions. State that visual inspection was unavailable; a valid file does not establish visual quality.
