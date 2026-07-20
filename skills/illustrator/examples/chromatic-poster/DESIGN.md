---
version: "alpha"
name: Chromatic Poster
description: A calm color-study identity built around one dominant field, balanced watercolor edges, and concise editorial typography.
colors:
  primary: "#008C8C"
  wash: "#55AAA5"
  paper: "#F7F4ED"
  ink: "#173E3B"
  body: "#426965"
  metadata: "#39706B"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 68px
    fontWeight: 640
    lineHeight: 1.15
    letterSpacing: -0.03em
  label:
    fontFamily: Noto Sans SC
    fontSize: 30px
    fontWeight: 560
    lineHeight: 1.2
  body:
    fontFamily: Noto Sans SC
    fontSize: 25px
    fontWeight: 390
    lineHeight: 1.8
    letterSpacing: 0.035em
  metadata:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.13em
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  xl: 96px
components:
  canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  color-field:
    backgroundColor: "{colors.primary}"
  watercolor-wash:
    backgroundColor: "{colors.wash}"
    opacity: 0.16
  color-caption:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
---

## Overview

Treat one color as the image. Build the composition around a large uninterrupted color field, a warm paper ground, and a compact editorial caption. Keep the result calm, tactile, and immediately legible.

## Colors

Let one exact color dominate. Use nearby hues only as translucent edge washes, never as competing accents. Keep the paper warm and set text in a dark relative of the dominant color instead of pure black. When adapting this identity, replace the primary color and derive the wash, ink, body, and metadata tones from it.

## Typography

Use Noto Sans SC for the title, color name, and prose. Keep the main title on one line when possible and use moderate weight rather than display-heavy typography. Use JetBrains Mono only for a hex value, index, or similarly compact metadata.

## Layout

Give the color field roughly two thirds of a portrait canvas. Place the color name and value above the headline as a short caption, then follow with one concise two-line description. Align every text block to one left edge and distribute the lower section vertically instead of leaving a large unused footer.

## Watercolor Edge

Keep the field interior flat and clean. Draw one opaque irregular silhouette, then place one or two slightly expanded silhouettes behind it at low opacity. Vary every side by a similar amount so the wash feels balanced. Avoid filters, random grain, fuzzy pixel dithering, heavy bottom bands, rounded corners, and simulated paper noise inside the field.

## Components

Use one color field, one caption, one headline, and one short description. For supplied images, sample a dominant color and let the image occupy the field only when its crop remains clear. For code images, treat the code window as the color field while preserving neutral syntax contrast and the same compact caption hierarchy.

## Do's and Don'ts

- Do preserve one dominant color and generous negative space.
- Do keep edge washes subtle, uneven, and visually balanced on all sides.
- Do derive supporting colors from the dominant hue.
- Don't add decorative stickers, glass panels, gradients, or unrelated accent colors.
- Don't make the watercolor edge heavier on one side.
- Don't turn the lower caption into a dense specification sheet.
