# Examples

Bundled examples live under `SKILL_ROOT/examples/<slug>/`. Each may contain a reproducible `render.js`, rendered `preview.png`, source material, and a standard `DESIGN.md`.

## Artifact roles

Use `render.js` as implementation evidence whenever a concrete rendering question arises. Read only the relevant portion and reuse the technique, not the example's composition.

Treat `DESIGN.md` and its accompanying preview as visual-identity evidence. Form the task-specific visual premise first, then default to one relevant identity example. Inspect more only when the user requests comparison or each example answers a distinct visual question. A named example remains non-binding unless the user explicitly asks to follow its `DESIGN.md` or reproduce its identity.

For an example without `DESIGN.md`, treat `preview.png` as implementation output that may be inspected while validating the relevant technique. View any preview only when image inspection is available and its rendered appearance would answer a concrete question. Otherwise rely on the routing table and available text artifacts.

## Routing

| Need | Example | Read first |
| --- | --- | --- |
| Basic Shiki token mapping | `shiki-code-image` | `render.js` |
| Code window composition | `shiki-code-window` | `render.js` |
| Side-by-side code diff | `shiki-code-diff` | `render.js` |
| Transparent supplied subject and annotations | `field-archive` | `render.js` |
| Cropped supplied photograph | `flash-diary` | `render.js` |
| Photograph combined with compact data | `paddock-blue` | `render.js` |
| Dominant color field and soft edge treatment | `chromatic-poster` | `render.js` |
| Repeated vector forms | `flower-market` | `render.js` |
| Structured interface-like SVG illustration | `grid-operator` | `render.js` |
| Data-driven SVG paths and annotations | `refraction-atlas` | `render.js` |
| Editorial cover with stacked system layers | `system-layers-cover` | `render.js` |
| Typographic construction and aligned glyph slices | `render-specimen` | `render.js` |

Read a routed example's `DESIGN.md` instead when its visual rationale or tokens are the concrete subject. Read source material only to study how that input was incorporated.
