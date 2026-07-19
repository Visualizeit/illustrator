# Code Image Workflow

Use conversation context and source files directly. Infer the language, presentation, and optional labels without requiring structured configuration. Treat natural-language instructions as overrides.

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

Treat the Shiki syntax theme and the Illustrator visual theme as separate concerns. Use Shiki for token colors and the selected `DESIGN.md` theme for the outer visual identity.

Minimal token mapping:

```js
import { codeToTokens } from "shiki";
import { render } from "takumi-js";
import { container, text } from "takumi-js/helpers";
const highlighted = await codeToTokens(source, {
  lang: language,
  theme: syntaxTheme,
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
  ]
    .filter(Boolean)
    .join(" ");
  return {
    color: token.color ?? highlighted.fg ?? "#f0f6fc",
    fontStyle: fontStyle & fontStyleBits.italic ? "italic" : undefined,
    fontWeight: fontStyle & fontStyleBits.bold ? 700 : undefined,
    textDecoration: textDecoration || undefined,
  };
};
const node = container({
  style: {
    backgroundColor: highlighted.bg ?? "#0d1117",
    color: highlighted.fg ?? "#f0f6fc",
    display: "flex",
    flexDirection: "column",
    fontFamily: "JetBrains Mono, Noto Sans SC",
    whiteSpace: "pre-wrap",
  },
  children: highlighted.tokens.map((line) =>
    container({
      children: line.map((token) => text(token.content, tokenStyle(token))),
    })
  ),
});
const png = await render(node, { renderer, width: 1200, height: 630 });
```

Treat the declarations under `SKILL_ROOT/node_modules/@shikijs/types` as the source of truth for the locked Shiki version when a needed option is not covered here.
