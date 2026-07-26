# Code Image Workflow

Infer the language, presentation, and optional labels from the conversation and source files.

## Formatting

- Honor an explicit line width or no-wrap request first.
- Otherwise follow the source project's formatter configuration when available; default to 88 columns when it is not.
- Format only the rendering copy, preferably with a syntax-aware formatter. Never modify the source file.
- Preserve the original code when exact reproduction is requested or safe formatting is unavailable.
- Visually wrap residual long lines instead of truncating them. Avoid shrinking text until it becomes difficult to read.
- Keep continuation lines visually indented. Show a source line number only on its first visual line.

Infer titles, filenames, line numbers, window chrome, padding, and canvas size from context. Include them only when they improve the result.

## Highlighting and Rendering

Import `codeToTokens` from `shiki`. Always pass an inferred `lang` and an explicit `theme`; use `text` when highlighting is not useful. The result contains `tokens` organized as lines then tokens, plus foreground and background colors. Each token contains its exact `content` and may provide color, a `fontStyle` bitmask, and classification data.

Preserve token content exactly. Map source lines to Takumi containers and tokens to inline text nodes. Use the result's colors with readable fallbacks, and use `whiteSpace: "pre-wrap"` with an appropriate overflow-wrap fallback. Shiki handles tokenization and colors; Takumi handles layout, wrapping, decorations, dimensions, and encoding.

Register `JetBrainsMono-VF.ttf` and `JetBrainsMono-Italic-VF.ttf` from `assets/fonts/jetbrains-mono/` with normal and italic styles. Register Noto Sans SC on the same renderer as the CJK fallback, then set `fontFamily` to `JetBrains Mono, Noto Sans SC`.

Treat the Shiki syntax theme and the outer visual direction as separate concerns. Use Shiki for token styles and its foreground and background base colors. Its `fontStyle` value is a bitmask, so preserve combined italic, bold, underline, and strikethrough states. Derive window chrome, spacing, composition, and other visual-identity decisions separately.

For token-to-node mapping, read [the basic Shiki implementation](../examples/shiki-code-image/render.js). Read the window or diff implementation only when that presentation is requested, following [examples.md](examples.md).

Treat the declarations under `SKILL_ROOT/node_modules/@shikijs/types` as the source of truth for the locked Shiki version when a needed option is not covered here.
