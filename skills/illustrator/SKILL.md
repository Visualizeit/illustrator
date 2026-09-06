---
name: illustrator
description: Create standalone illustrations, posters, code images, and photo compositions from natural-language direction or supplied content using local rendering code.
---

# Illustrator

Create images with Takumi from HTML strings and theme CSS, using task-specific rendering code or an adapted example.

Default to theme-driven Tailwind: define colors, typography, and spacing in `@theme`, then reference semantic utilities through `tw`. Use explicit flex rows or columns for content layout. Keep arbitrary values and inline styles for one-off geometry or unsupported features; use absolute positioning for overlays or coordinate-based artwork.

Infer visual choices from the task and conversation; defaults and examples are adjustable. Text is optional. Preserve supplied content unless changes are requested, and distinguish assets to include from style references. Apply crops and effects without modifying source files.

## References

Read as needed:

- [Rendering](references/rendering.md): setup, Takumi API, fonts, images, and verification.
- [Examples](references/examples.md): implementation and style references.

## Execution

Treat this directory as `SKILL_ROOT` and keep Skill dependencies isolated here. Use a task-specific `SKILL_ROOT/tmp/` subdirectory for `.mjs` modules so they resolve the bundled packages. Resolve input and output paths independently of the caller's working directory.

Default to PNG. Retain requested outputs and source needed for editing; clean up the task's disposable artifacts, including after failure.

[Verify the output](references/rendering.md#verification) before delivery.
