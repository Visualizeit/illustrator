---
version: "alpha"
name: Flower Market
description: A controlled dopamine identity inspired by weekend flower stalls, wrapping paper, price tags, and fresh-cut stems.
colors:
  primary: "#F0442E"
  secondary: "#238C4A"
  tertiary: "#B69CFF"
  butter: "#F4DA54"
  neutral: "#FFF8DE"
  ink: "#17251C"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 104px
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: -0.04em
  headline:
    fontFamily: Noto Sans SC
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: Noto Sans SC
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.12em
rounded:
  sm: 8px
  tag: 999px
  petal: 999px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  xl: 96px
components:
  canvas:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
  market-tag:
    backgroundColor: "{colors.butter}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: 14px
  flower-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.petal}"
---

## Overview

Flower Market is joyful but composed. It borrows the color confidence of a busy weekend flower stall while keeping one clear focal bouquet, assertive typography, and enough breathing room to feel designed rather than decorated.

## Colors

Use warm neutral as the ground and let one saturated color dominate each image. Tomato red carries energy, leaf green provides structure, butter yellow brings warmth, and lilac is a sparing surprise. Do not distribute all colors evenly.

## Typography

Use Noto Sans SC at extreme scale and weight for the message. Use JetBrains Mono only for prices, dates, coordinates, inventory marks, and short English labels. Create personality through scale, line breaks, spacing, and placement rather than unavailable display fonts.

## Layout

Build an asymmetric composition around one headline and one botanical cluster. Allow flowers or stems to cross a margin, but keep text clear. For supplied photos, treat the image as wrapping-paper material or a dominant product card rather than a generic full-bleed background.

## Shapes

Construct flowers from a small number of oversized oval petals, circular centers, straight stems, and pointed leaves. Use stripes, price dots, and wrapping-paper folds only when they reinforce the market story. Prefer flat color and crisp overlap over glossy gradients.

## Components

Use one compact market tag for contextual metadata. Let the bouquet act as the primary visual component. Code images may frame the code as a florist's inventory sheet, with color reserved for the canvas, header, and line markers rather than syntax readability.

## Do's and Don'ts

- Do use two or three saturated colors plus the neutral ground.
- Do preserve a clear dominant flower, title, or supplied image.
- Do keep Chinese text bold, concise, and immediately readable.
- Don't add random stickers, smiley faces, rainbows, or decorative blobs.
- Don't imitate handwriting or serif typography with the bundled fonts.
- Don't make every element rounded, tilted, or equally loud.
