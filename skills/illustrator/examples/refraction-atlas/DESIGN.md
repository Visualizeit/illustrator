---
version: "alpha"
name: Refraction Atlas
description: A white-field data identity where three crisp analytical polylines, overlapping translucent fields, and directional chromatic shadows make comparison feel precise and spatial.
colors:
  canvas: "#FFFFFF"
  ink: "#11131A"
  body: "#4F5664"
  muted: "#9298A8"
  rule: "#E8EAF0"
  cobalt: "#315CF5"
  violet: "#846CFF"
  cyan: "#42C7DB"
  coral: "#FF6B78"
  ice: "#EAF3FF"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 58px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
  headline:
    fontFamily: Noto Sans SC
    fontSize: 28px
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: -0.025em
  metric:
    fontFamily: JetBrains Mono
    fontSize: 46px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
  body:
    fontFamily: Noto Sans SC
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.55
  axis:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.1em
spacing:
  xs: 8px
  sm: 16px
  md: 28px
  lg: 56px
  xl: 88px
components:
  canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  upper-surface:
    backgroundColor: "{colors.cyan}"
    borderColor: "{colors.cobalt}"
    borderWidth: 1px
  lower-surface:
    backgroundColor: "{colors.violet}"
    borderColor: "{colors.violet}"
    borderWidth: 1px
  signal-spine:
    backgroundColor: "{colors.coral}"
  chart-rule:
    borderColor: "{colors.rule}"
    borderWidth: 1px
---

## Overview

Refraction Atlas turns quantitative comparison into transparent spatial form. A chart is not placed inside a glass panel; its overlapping gradient fields are the glass. Crisp polygonal edges keep the data exact while translucent color mixing makes depth visible.

The mood is editorial, analytical, and sculptural. Preserve truthful scales and direct labels while allowing one dominant data form to define the composition.

## Canvas and Color

Use pure white for the entire canvas. Do not tint the page, add decorative color clouds, or rely on a dark mode to create contrast. Near-black ink anchors typography and values. Cool grey rules remain quiet.

Cobalt, cyan, and violet carry the three analytical series. Keep each line a single solid color. Their independently fading fields may overlap into richer blue-violet intersections. Coral is reserved for a threshold, exceptional change, or one directional annotation.

## Typography

Use Noto Sans SC for titles, section headings, and prose. Use JetBrains Mono for metrics, axes, dates, units, coordinates, and technical labels. Titles remain compact enough to leave the central data form dominant. Align all numeric labels to a clear baseline or annotation rail.

## Composition

Favor a landscape canvas with one large asymmetrical data field occupying roughly seventy percent of the image. Let three related surfaces travel across the page on a shared scale. Keep metrics and one supporting diagram on a narrow annotation rail instead of placing charts in repeated cards.

Use negative space as structure. Rules and labels should connect to the main geometry. Avoid the familiar one-large-two-small dashboard arrangement.

## Refraction Curves and Surfaces

Default to three related straight-segment polylines on one shared scale: a high range, a central signal, and a low range. Their vertices should create a deliberate rhythm of rises, pauses, and reversals without smoothing away the actual samples.

Build the glass field in three restrained layers:

- Each series receives its own transparent vertical field that fades fully into the white baseline.
- Overlap between fields creates the primary glass effect; do not blur the boundaries into one generic wash.
- A close, low-opacity field duplicate may create directional chromatic depth.

Keep every line a flat, solid color between two and three pixels. Never apply a gradient to the stroke itself. Do not place a node at every sample; mark only the latest endpoints, a selected state, or an exceptional event. Facet or cut lines are optional and must never dominate the polylines.

Grid lines should be fine, low-contrast, and dashed. A threshold may use one restrained coral dashed rule. Keep area gradients almost transparent at their baseline so the white canvas remains visible.

## Chromatic Shadows

Shadows are geometric duplicates, not broad glows. Offset the primary surface six to ten pixels in the direction of change, reduce opacity below ten percent, and keep the shadow close enough to read as refracted light. A second, weaker coral or violet offset may appear at a major inflection.

Do not use black drop shadows, large blurred halos, or colored shadows detached from the data form.

## Detail Window

The annotation rail may contain one compact detail window that crops, zooms, or re-samples the same three polylines. It must repeat their solid stroke colors, overlapping glass fields, grid rhythm, and endpoint treatment. Keep it subordinate and label its sample window directly. Do not introduce an unrelated radial or donut grammar beside a line-led composition.

## Chart Adaptation

- Range and area charts use three crisp polylines above independently fading glass fields.
- Line charts use solid-color strokes, endpoint-only markers, and restrained translucent areas; line strokes never use gradients.
- Bar charts become aligned glass slabs with consistent thickness and edge highlights; avoid rounded capsule bars.
- Radial charts use overlapping lenses, rings, or translucent sectors only when the entire composition is radial.
- Small multiples share surface opacity, edge treatment, sample intervals, and annotation rhythm.

## Annotation

Use direct labels, concise units, sample windows, and factual descriptions of any unusual encoding. Place metrics on an annotation rail aligned with the chart's major inflection points. Keep legends compact; when possible, label surfaces directly at their edge.

## Supplied Data and Images

Preserve correct scales, category order, units, uncertainty bounds, and baselines. Reduce labels or split the view when content collides. Photography is outside the default language unless explicitly part of the data story.

## Do's and Don'ts

- Do make overlap, offset, and thickness encode a real relationship.
- Do use pure white negative space as an active compositional element.
- Do keep surface edges fine, crisp, and deliberately highlighted.
- Do make one data form visibly dominant.
- Don't place charts inside generic glass cards.
- Don't use stock donut, rounded bar, or dashboard layouts as the main idea.
- Don't turn uncertainty into one thick opaque ribbon when separate curves communicate it more elegantly.
- Don't simulate glass with blur alone.
- Don't add decorative refraction that has no relationship to the data.
- Don't mix an isolated donut or radial widget into a composition whose dominant language is a flowing line.
