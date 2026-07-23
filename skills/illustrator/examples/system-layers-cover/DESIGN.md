---
version: "alpha"
name: System Layers Cover
description: A square editorial cover that turns a software system into a descending stack of labeled operational layers.
colors:
  paper: "#F1ECEC"
  ink: "#211E1E"
  graphite: "#656161"
  rule: "#C7C1C1"
  signal: "#E65A47"
  signalDark: "#B93C2F"
  white: "#FAF8F7"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 68px
    fontWeight: 780
    lineHeight: 1.1
    letterSpacing: -0.045em
  layer:
    fontFamily: JetBrains Mono
    fontSize: 21px
    fontWeight: 750
    lineHeight: 1
    letterSpacing: 0.15em
  metadata:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.75
    letterSpacing: 0.18em
spacing:
  xs: 8px
  sm: 16px
  md: 31px
  lg: 54px
  xl: 85px
components:
  canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  layer-stack:
    borderColor: "{colors.ink}"
    signalColor: "{colors.signal}"
  registration-frame:
    borderColor: "{colors.rule}"
---

## Overview

System Layers Cover turns an abstract software stack into one physical object. Prompt, Context, Agent, Permission, and Shell appear as aligned slices that descend toward the execution environment. The structure explains the article's subject before the reader reaches the body.

The mood is analytical, editorial, and slightly cautionary. Use this identity for system architecture, security boundaries, agent infrastructure, developer tools, and technical articles whose argument depends on several connected layers.

## Colors

Use a warm grey paper ground with near-black type and structural outlines. Move from light grey to charcoal as the stack approaches the operating layer. Reserve vermilion for the lowest or riskiest layer and for one compact signal elsewhere in the composition.

Do not distribute the signal color evenly across the page. The stack should carry the color progression, while the title and metadata remain mostly neutral.

## Typography

Use Noto Sans SC for the main Chinese title and preserve a large, direct reading order. A supplied product wordmark may sit below the title when brand recognition matters. Keep the wordmark complete and use `contain` rather than cropping it.

Use JetBrains Mono for layer names, figure metadata, source snapshots, and compact engineering labels. Letter spacing may be generous at full size, but labels must remain readable when the cover is reduced to a social-media thumbnail.

## Composition

Default to a 1:1 canvas. Place the title and product mark in the upper third. Reserve the center and lower half for one oversized perspective stack. Let the stack extend wider than the title while keeping its top surface open enough to read as a single assembled object.

Keep the outer registration frame subtle. Use one strong horizontal rule to separate metadata from the title. Leave the right side of the title area open rather than filling it with secondary copy.

## Layer Stack

Build each slice from a top polygon and a narrow front polygon. Reuse the same geometry and shift every lower layer diagonally so the stack reads as one system. Keep outlines consistent and avoid realistic depth, gradients, shadows, or texture.

Layer labels belong on the front faces. Use dark text on light layers and light text on dark layers. The final layer may be wider and more saturated to clarify where the system reaches execution.

When adapting the composition, replace the five labels with the subject's actual architecture. Preserve their order and causal relationship; do not use the stack as decoration for unrelated terms.

## Brand Material

Treat supplied logos and wordmarks as source material, not as shapes to redraw. Preserve their aspect ratio, colors, and internal spacing. The preview uses the OpenCode wordmark because it was created for a published analysis of that project.

For an unbranded subject, replace the wordmark with a short product or system name set in the main display type. Do not retain OpenCode-specific metadata when the subject changes.

## Components

Use one title, one product mark or product name, one five-layer stack, one top metadata row, and one bottom source row. The stack is the only illustration. Remove extra icons, generic AI symbols, decorative nodes, and unrelated diagrams.

For a landscape article cover, keep the title on the left and move a smaller stack to the right. Preserve the same layer order, neutral-to-signal color progression, and compact engineering metadata.

## Do's and Don'ts

- Do let the layer order explain the system.
- Do keep the lowest operational layer visually distinct.
- Do preserve supplied brand assets without cropping or redrawing them.
- Do inspect the title, wordmark, and layer labels at thumbnail size.
- Don't add glass panels, gradients, glow, or photorealistic depth.
- Don't scatter the layer names outside the object.
- Don't use arbitrary stack labels that do not describe the source content.
- Don't let metadata compete with the title or wordmark.
