---
version: "alpha"
name: Flash Diary
description: A bright photo-led identity inspired by sunlit city walks, fashion editorials, contact sheets, and compact diary captions.
colors:
  primary: "#FF8E68"
  secondary: "#A9D9E8"
  accent: "#2448D8"
  paper: "#F7F3EA"
  ink: "#171717"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 96px
    fontWeight: 900
    lineHeight: 0.96
    letterSpacing: -0.04em
  headline:
    fontFamily: Noto Sans SC
    fontSize: 52px
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: Noto Sans SC
    fontSize: 26px
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: JetBrains Mono
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.1em
rounded:
  frame: 4px
  tag: 999px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 56px
  xl: 88px
components:
  canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  photo-frame:
    backgroundColor: "{colors.white}"
    borderColor: "{colors.ink}"
    borderWidth: 2px
    rounded: "{rounded.frame}"
    padding: 12px
  issue-label:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: 12px
---

## Overview

Flash Diary turns one supplied image into a crisp city note. It combines bright natural light, assertive cropping, oversized typography, and compact documentary labels without imitating a camera interface or scrapbook template.

## Colors

Let the supplied image lead the palette. Use paper and ink as the stable base, then select one warm and one cool accent that echo the image. Keep accent colors flat and concentrated in labels, rules, or one typographic gesture rather than tinting the entire photo.

## Typography

Use Noto Sans SC for large, tightly set Chinese headlines. Allow one line or character to approach or cross the photo edge when readability remains clear. Use JetBrains Mono for dates, locations, issue numbers, filenames, and short English captions only.

## Layout

Give one photograph a dominant role and preserve its strongest negative space for the headline. Prefer asymmetric photo windows, cropped edges, and a compact caption zone. When no image is supplied, replace the photo with one large color field and retain the same headline-to-caption hierarchy.

## Image Treatment

Use `cover` only when the crop preserves the architectural subject, product, or focal area. Prefer natural color and existing light. Create energy through framing, scale, and overlap instead of filters, fake grain, heavy gradients, or synthetic lens effects.

## Components

Use one photo frame, one issue label, and one caption strip at most. Small registration marks, dates, and coordinates may add documentary rhythm, but they must remain secondary to the image and headline. Code images may treat the code window as the photograph, surrounded by the same issue and caption system.

## Do's and Don'ts

- Do preserve useful sky, walls, or other negative space for typography.
- Do let the image determine which accent color dominates.
- Do keep metadata factual, compact, and visibly secondary.
- Don't use fake social-media chrome, camera controls, or film perforations.
- Don't scatter stickers, tape strips, handwritten notes, or repeated mini photos.
- Don't apply effects that make the source image less legible or recognizable.
