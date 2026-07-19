---
name: illustrator
description: Generate and compose designed visuals from content, code, and supplied images. Use when creating article illustrations, social-media graphics, code images, photo treatments, image collages, or a temporary custom visual style.
---

# Illustrator

Generate task-specific rendering code from the selected workflow and design references. Do not rely on a bundled renderer or CLI.

## Workflows

For every image, read [references/visual-direction.md](references/visual-direction.md) before choosing a composition or style.

Before generating a rendering module, read [references/rendering.md](references/rendering.md) for the installed Takumi contract, defaults, and limits.

For article illustrations, covers, social-media graphics, and any composition using supplied images as visual material, read [references/illustration.md](references/illustration.md) before rendering.

For code images, read [references/code-image.md](references/code-image.md) before rendering.

Before selecting or applying a visual theme, read [references/themes.md](references/themes.md). Read only the selected theme file after making the selection.

## Runtime

Treat this Skill directory as `SKILL_ROOT`. Keep runtime dependencies isolated from the user's project.

Before rendering, check the runtime:

```sh
npm --prefix "$SKILL_ROOT" ls --omit=dev --depth=0
```

If the check fails, install the locked dependencies:

```sh
npm --prefix "$SKILL_ROOT" ci --omit=dev --no-audit --no-fund
```

Require Node.js 20 or newer. Use npm for the Skill runtime because it ships with Node.js; do not require the user to install pnpm.

## Execution

1. Default to PNG unless the user requests another format or the destination clearly benefits from one.
2. Generate a task-specific `.mjs` module inside `SKILL_ROOT` so Node.js resolves the Skill's dependencies.
3. Use absolute paths for task inputs and outputs.
4. Run the generated module with Node.js from `SKILL_ROOT`.
5. Remove the generated module after execution, including after a failure.
6. Inspect the rendered image when viewing is available. Revise clipping, overflow, unreadable text, weak contrast, unclear hierarchy, or excessive empty space.
7. Keep only the requested output artifacts in the user's project.

Do not add dependencies to the user's project, install packages globally, or retain generated source files. The individual built-in themes remain intentionally pending further design decisions.
