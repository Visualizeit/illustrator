---
version: "alpha"
name: Paddock Blue
description: A muted photo-led racing editorial built around powder blue, clay orange, measured typography, and compact performance data.
colors:
  primary: "#8DB4BC"
  secondary: "#C8734D"
  paper: "#E8E1D6"
  ink: "#304F58"
  body: "#66645F"
  rule: "#C6C1B8"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 88px
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: -0.045em
  metric:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.045em
  label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.14em
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 58px
  xl: 96px
components:
  canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  photo-field:
    backgroundColor: "{colors.primary}"
  speed-rule:
    primaryColor: "{colors.primary}"
    secondaryColor: "{colors.secondary}"
  telemetry:
    textColor: "{colors.ink}"
    ruleColor: "{colors.rule}"
    typography: "{typography.metric}"
---

## Overview

Paddock Blue treats racing as a measured editorial subject rather than an aggressive spectacle. Pair one motion-led photograph with restrained typography, compact performance data, and a softened powder-blue and clay-orange palette. Keep the result calm, precise, and quietly cinematic.

## Colors

Use warm oat as the ground and deep denim as the primary ink. Let powder blue and clay orange echo colors already present in the supplied image. Keep both accents muted and flat. Avoid pure black, pure white, racing red, fluorescent orange, and direct replication of a branded motorsport livery.

## Typography

Use Noto Sans SC for large editorial headlines in English, Chinese, or mixed content. Prefer short statements, deliberate line breaks, medium-heavy weight, and tight line height. Do not italicize, outline, skew, slice, or compress the headline. Use JetBrains Mono for lap times, positions, speed, RPM, dates, credits, and other concise metadata.

## Layout

Give one borderless photograph roughly half of a portrait canvas. Align its left and right edges with the headline and telemetry below. Separate the photograph from the editorial field with one thin two-color rule and a compact credit line. Keep the headline outside the image, then arrange no more than four primary metrics in one quiet row.

## Image Treatment

Prefer a side profile, panning shot, track detail, or similarly directional image with visible motion and a simple silhouette. Preserve the source image's natural blur and dominant colors. Apply only a faint powder-blue wash when the image needs palette cohesion. Do not add a picture frame, drop shadow, dark overlay, synthetic speed lines, fake grain, or unrelated racing illustration.

## Racing Details

Express motorsport through factual or clearly contextual metadata such as lap, position, sector time, RPM, speed, or throttle. Keep labels small and secondary. Use clay orange for one current or decisive value, not for every number. Avoid dashboard chrome, gauges, warning lights, checkered-flag patterns, team logos, sponsor marks added by the composition, and dense HUD panels.

## Components

Use one photo field, one two-color speed rule, one headline, and one telemetry row. Add a supporting line only when it contributes information the headline and metrics do not already convey. Credit supplied photography when requested or required. For code images, replace the photograph with one wide code field, keep syntax colors neutral, and apply the powder-blue, clay-orange, and telemetry system only to the surrounding editorial structure.

## Do's and Don'ts

- Do let the supplied image determine the exact balance of blue and orange.
- Do align the photograph, headline, rules, and telemetry to one editorial grid.
- Do favor quiet confidence, precision, and emotional stakes over visual aggression.
- Don't place the headline over the focal vehicle or subject.
- Don't add borders, mats, cards, shadows, or interface-like containers around the image.
- Don't reproduce Gulf logos, team liveries, sponsor graphics, or other protected brand identifiers.
