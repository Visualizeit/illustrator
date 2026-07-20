---
name: illustrator
description: Create general-purpose illustrations and designed images from natural-language direction, content, code, and supplied images. Use for standalone illustrations, article and social visuals, code images, photo compositions, or any custom visual direction.
---

# Illustrator

Generate task-specific rendering code from the relevant workflow and the user's direction. Do not rely on a bundled renderer or CLI.

## Workflows

For every image, read [references/visual-direction.md](references/visual-direction.md) before choosing a composition or style.

Before generating a rendering module, read [references/rendering.md](references/rendering.md) for the installed Takumi contract, defaults, and limits.

For general illustrations and any composition using supplied images as visual material, read [references/illustration.md](references/illustration.md) before rendering.

For code images, read [references/code-image.md](references/code-image.md) before rendering.

Before opening a bundled example, follow the routing and inspection rules in [references/examples.md](references/examples.md).

## Runtime

Treat this Skill directory as `SKILL_ROOT`. Keep runtime dependencies isolated from the user's project; do not add them to the user's project or install them globally.

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
2. Use `SKILL_ROOT/tmp/` for generated modules and intermediate artifacts, clean them up after rendering even on failure, and retain only the requested outputs.
3. Use absolute paths for task inputs and outputs.
4. Run the generated module with Node.js from `SKILL_ROOT`.
5. Inspect the rendered image when viewing is available. Revise clipping, overflow, unreadable text, weak contrast, unclear hierarchy, or excessive empty space. When viewing is unavailable, follow the non-visual verification rules in [references/rendering.md](references/rendering.md).
