---
version: "alpha"
name: Render Specimen
description: A typographic specimen that turns the ILLUSTRATOR wordmark into its own measured, color-coded construction.
colors:
  paper: "#FAFAF8"
  ink: "#121713"
  graphite: "#6F746F"
  rule: "#D7D9D5"
  yellow: "#F3D34A"
  coral: "#F05A45"
  blue: "#315EF5"
  cyan: "#35B7A5"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 178px
    fontWeight: 860
    lineHeight: 0.9
    letterSpacing: -0.061em
  statement:
    fontFamily: Noto Sans SC
    fontSize: 42px
    fontWeight: 660
    lineHeight: 1.05
    letterSpacing: -0.038em
  metadata:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: 0.1em
spacing:
  xs: 8px
  sm: 16px
  md: 28px
  lg: 48px
  xl: 70px
components:
  canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  glyph-slice:
    colors:
      - "{colors.yellow}"
      - "{colors.coral}"
      - "{colors.blue}"
      - "{colors.cyan}"
  measurement:
    textColor: "{colors.graphite}"
    ruleColor: "{colors.rule}"
---

## Overview

Render Specimen treats typography as the finished image. The oversized wordmark is not placed inside an illustration; its baseline, cap height, crop regions, color layers, and rendering metadata become the visual subject.

The mood is precise, constructed, and quietly colorful. Use this identity for rendering systems, design tools, typography-led product visuals, reproducible media, and subjects where the structure behind an image deserves to remain visible.

## Colors

Use an almost-white paper ground and near-black primary type. Apply yellow, coral, blue, and cyan only to aligned glyph slices, measurement lines, compact labels, and the bottom palette index. Every accent color must correspond to a visible construction role.

Do not tint the entire canvas, add gradients, or scatter colored decoration. The palette should feel diagnostic rather than celebratory.

## Typography

Use Noto Sans SC at extreme weight and scale for the main word or statement. Keep the display text on one line and crop it only when the crop explains its construction. Use JetBrains Mono for dimensions, coordinates, output formats, and short technical labels.

Choose a factual supporting statement rather than an advertising slogan. Keep secondary copy sparse enough that the main word remains immediate at thumbnail size.

## Composition

Default to a 16:9 landscape canvas. Place a compact specimen header above one dominant word. Surround the word with a cap-height guide, baseline, bounding corners, ruler ticks, and three restrained callouts. Reserve the lower third for one supporting statement, a palette index, and rendering metrics.

Leave open space around the word's right edge instead of filling the entire measurement frame. This makes the frame read as an inspected working area rather than a banner.

## Glyph Slices

Create color slices by duplicating the exact display text inside clipped containers. Keep every duplicate at the same coordinates as the black word so the colored portions align perfectly with the glyph contours. Vary only the crop region, never the text position.

Use wide horizontal slices that remain visible at thumbnail size. Avoid registration-error effects, offset shadows, outlined duplicates, chromatic blur, or several colors applied to the same crop.

## Measurement System

Use thin rules, ruler ticks, square registration nodes, bounding corners, and short orthogonal callouts. Keep measurement labels small and monospaced. Decorative nodes must be attached to a clear guide or frame; remove isolated dots that could look like accidental artifacts.

## Components

Use one wordmark, four aligned color slices, one measurement frame, three callouts, one factual supporting statement, one palette index, and four rendering metrics. A short description may sit above the specimen when it clarifies the subject.

For another subject, replace ILLUSTRATOR with a similarly compact word or phrase and update every metric to describe the actual output. Do not retain labels that no longer correspond to the composition.

## Do's and Don'ts

- Do make the typography itself the primary visual artifact.
- Do align colored glyph slices exactly with the black display text.
- Do connect every annotation to a visible construction detail.
- Do verify the word and color slices at full size and thumbnail size.
- Don't place an unrelated illustration, screenshot, or product mockup inside the frame.
- Don't use isolated measurement dots without a structural purpose.
- Don't turn the metadata into a dense specification sheet.
- Don't add gradients, glow, glass panels, or decorative image-generation motifs.
