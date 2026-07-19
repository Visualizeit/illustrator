# Illustrator

A lightweight Agent Skill for creating designed visuals from content, code, and supplied images with local, browserless rendering.

> Work in progress. The public interface and runtime packaging are not finalized.

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm run validate
```

The Skill source lives in [`skills/illustrator`](./skills/illustrator). Its isolated runtime uses npm and requires Node.js 20 or newer. Runtime dependencies are installed inside the Skill directory and never added to the consumer project.

Noto Sans SC and JetBrains Mono are bundled for consistent text and code rendering. Both are distributed under the SIL Open Font License 1.1.

Confirmed built-in theme showcases keep their reproducible rendering source under `examples/themes/<slug>/`. Temporary rendering modules are removed only before a theme is accepted. Showcase source, inputs, and rendered previews remain repository development assets and are not included in the installed Skill.
