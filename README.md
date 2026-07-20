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

Noto Sans SC and JetBrains Mono are bundled for consistent text and code rendering. Both are distributed under the SIL Open Font License 1.1. See [`THIRD_PARTY_NOTICES.md`](./skills/illustrator/THIRD_PARTY_NOTICES.md) for bundled font and image sources.

Self-contained examples live under `skills/illustrator/examples/<slug>/` and ship with the Skill. Each example keeps its reproducible rendering source beside its rendered preview and any required input material. Examples that demonstrate a complete visual identity also include a standard `DESIGN.md`.

Examples provide implementation evidence and optional visual references rather than a selectable style catalog.
