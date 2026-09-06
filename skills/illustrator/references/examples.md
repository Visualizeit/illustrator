# Examples

Bundled examples are under `SKILL_ROOT/examples/<slug>/`.

Every example renders HTML and defines its colors, typography, and shared spacing in `theme.css`. Edit these tokens when adapting a style. HTML consumes them through `tw`; SVG attributes and calculated dimensions resolve values with `loadTheme`.

| Need                                              | Example               |
| ------------------------------------------------- | --------------------- |
| Basic Shiki token mapping                         | `shiki-code-image`    |
| Code window composition                           | `shiki-code-window`   |
| Side-by-side code diff                            | `shiki-code-diff`     |
| Transparent supplied subject and annotations      | `field-archive`       |
| Cropped supplied photograph                       | `flash-diary`         |
| Theme-driven Tailwind and flex composition        | `paddock-blue`        |
| Dominant color field and soft edge treatment      | `chromatic-poster`    |
| Repeated vector forms                             | `flower-market`       |
| Structured interface-like SVG illustration        | `grid-operator`       |
| Data-driven SVG paths and annotations             | `refraction-atlas`    |
| Editorial cover with stacked system layers        | `system-layers-cover` |
| Typographic construction and aligned glyph slices | `render-specimen`     |

Each `render.mjs` accepts an output path as its first argument; omitting it overwrites the bundled `preview.png`. Asset paths resolve from the module location, so update them when copying code elsewhere.

## Adapting Code Examples

The code examples use fixed canvases and unwrapped lines. If wrapping new input, use `whitespace-pre-wrap` with an appropriate `overflow-wrap`, preserve continuation indentation, and show each source line number once. Size the canvas for visual lines rather than source lines.

The diff example's row mapping is hardcoded; derive it from the actual inputs.
