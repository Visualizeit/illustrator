# Illustration Workflow

Use conversation context and source content directly. Do not require structured configuration or ask the user to restate information that is already available.

Before writing rendering code, form a compact internal art direction:

- Identify the single idea the image should communicate.
- Choose one clear focal concept and supporting visual cues instead of representing every detail.
- Infer the visual form, composition, amount of text, mood, and canvas from the user's intent, destination when known, and subject matter. Do not assume a publishing layout. Text is optional, and the illustration may carry the entire image.
- Treat natural-language instructions as overrides for any inferred decision.

Choose a visual direction from the user's natural-language instructions, references, supplied assets, or an optional theme according to [themes.md](themes.md). Treat the result as guidance rather than a fixed layout template.

Prefer concise copy and strong visual hierarchy. Preserve supplied names, titles, code, data, and brand assets exactly; do not invent factual claims. Use text only when it improves the image's purpose.

Use HTML and CSS for composition and typography. For a custom focal mark, curved symbol, or other simple vector artwork, prefer a compact inline SVG over assembling the shape from many positioned containers. Keep the SVG subordinate to the art direction rather than adding detail because the format permits it.

## Supplied Images

Treat photos, screenshots, logos, product images, and other supplied assets as first-class composition material. Infer whether each image is content to include or a style reference only; never place a reference-only image into the output without clear intent.

- Preserve source files and aspect ratios. Apply crops, overlays, and effects only in the rendered composition.
- Use `cover` for intentional photographic crops and `contain` when the complete logo, screenshot, diagram, or product silhouette must remain visible.
- Protect important focal areas, faces, embedded text, and brand marks from accidental cropping or obstruction.
- Give one image a clear dominant role in multi-image compositions instead of treating every asset equally.
