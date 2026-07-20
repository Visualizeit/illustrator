---
version: "alpha"
name: Grid Operator
description: A landscape automation identity where a cropped semantic spreadsheet and an oversized pointer cursor turn repetitive office work into one precise visual interaction.
colors:
  canvas: "#F3F5F0"
  paper: "#FFFFFF"
  ink: "#14241B"
  body: "#536158"
  grid: "#CAD4CC"
  gridSoft: "#E7ECE8"
  green: "#218B57"
  greenDark: "#12623C"
  lime: "#BDF36B"
  coral: "#FF7958"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 88px
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: -0.055em
  headline:
    fontFamily: Noto Sans SC
    fontSize: 34px
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: -0.025em
  body:
    fontFamily: Noto Sans SC
    fontSize: 18px
    fontWeight: 450
    lineHeight: 1.55
  label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.12em
spacing:
  xs: 8px
  sm: 16px
  md: 28px
  lg: 52px
  xl: 80px
components:
  canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  spreadsheet:
    backgroundColor: "{colors.paper}"
    borderColor: "{colors.grid}"
    selectionColor: "{colors.green}"
  pointer:
    fillColor: "{colors.paper}"
    borderColor: "{colors.ink}"
    shadowColor: "{colors.lime}"
  automation-state:
    activeColor: "{colors.green}"
    signalColor: "{colors.lime}"
---

## Overview

Grid Operator gives office automation a physical point of action. A large pointer cursor aligns with one selected spreadsheet cell while semantic status symbols make the automated work visible inside the grid. The spreadsheet is the working surface and the cursor is the operator; their interaction carries the idea without an external workflow diagram.

The mood is capable, direct, and optimistic. Use it for AI office automation, workflow orchestration, spreadsheet productivity, operations, reporting, and other subjects where repetitive digital work becomes a repeatable system.

## Colors

Use a warm grey-green canvas and white spreadsheet paper. Near-black green anchors large typography, while spreadsheet green identifies selection, progress, and action. Acid lime is a concentrated signal color for the cursor shadow, one active cell, or one short underline. Coral may mark an exception or manual intervention, but it must never compete with green.

Do not use a default purple-blue AI gradient, multicolor glow, dark glass panels, or a rainbow set of workflow states. Keep the palette flat and high-contrast.

## Typography

Use Noto Sans SC for the main statement and supporting Chinese copy. Headlines should be short, heavy, and tightly spaced. Keep the main title on one line in landscape compositions whenever it fits without compression. Use JetBrains Mono for column letters, row numbers, formulas, state labels, and concise English workflow terms.

The theme works best when the main message names the benefit rather than describing the interface. Examples include “从重复中解放生产力”, “让工作自己流转”, and “一次编排，持续执行”.

## Composition

Default to a landscape canvas. Reserve the left half for a single-line headline and let a cropped spreadsheet enter from the right or lower-right edge. Rotate it by only four to eight degrees so it feels active while the grid remains immediately recognizable.

Let the spreadsheet occupy roughly half to two-thirds of the canvas, but reveal only one corner or partial working area. Place the pointer near the selected range and keep its tip precise. The cursor may cross the spreadsheet edge to create depth.

Keep the space between the left-side statement and the spreadsheet open. Express automation through cell states, progress, and selection rather than an external curved workflow path. Do not scatter unrelated arrows or nodes around the canvas.

## Spreadsheet Field

Build the spreadsheet from crisp rows, columns, headers, selection outlines, and a small fill handle. Use sparse semantic cell motifs instead of repeating generic placeholder lines: trigger dots, two-level task summaries, miniature metric bars, completion checks, progress tracks, and connected flow nodes. Give each column one consistent role so the sheet suggests real data even at thumbnail size.

The field should suggest spreadsheet software without reproducing a product screenshot. Do not include Microsoft Excel logos, ribbon controls, branded icons, account information, or a recognizable proprietary interface. Avoid rounded card containers around the table; the sheet itself is the large geometric surface.

## Pointer Cursor

Draw one oversized arrow cursor as a compact SVG path. Give it a white fill, a dark two-to-four-pixel outline, and a close lime offset shadow. Keep the silhouette familiar and sharp. Place the pointer tip inside the selected cell, align it with the cell's vertical center, and inset it sixteen to twenty-eight pixels from the right edge so the target remains fully visible.

When the click needs clarification, place one small transparent lime ring directly beneath the pointer tip. Keep it to a single twenty-to-twenty-four-pixel circle with a three-pixel stroke. The selected cell outline already provides the directional frame, so do not add focus brackets, concentric rings, radial bursts, glow, or a filled status dot around the cursor. Avoid a hand cursor, several cursors, a physical mouse, photorealistic rendering, or cartoon facial features.

## Automation Signals

Keep automation signals inside the spreadsheet. A column may use trigger dots, another may use completion checks, and another may show progress tracks or a compact three-node sequence. Give each motif a stable meaning across the rows.

Do not add an external process curve by default. If a special composition needs a connector, keep it short, straight, and contained within the grid so it does not compete with the cursor-and-cell interaction.

## Components

Use one cropped spreadsheet, one pointer cursor, one headline, and one concise supporting statement. A compact status label or formula fragment may be added when it strengthens the office context. Keep every secondary element subordinate to the cursor-and-cell interaction.

For code images, replace the spreadsheet with a cropped code or automation-script field while preserving the pointer, green selection system, internal state signals, and left-led headline hierarchy.

## Do's and Don'ts

- Do make the pointer tip and selected cell the focal interaction.
- Do keep grid lines fine, straight, and visibly quieter than the selection.
- Do crop the spreadsheet decisively so it reads as a working surface rather than a screenshot.
- Do use internal cell states to communicate automation without an external diagram.
- Don't reproduce Excel branding or a complete application interface.
- Don't fill every cell with text, formulas, charts, or decorative numbers.
- Don't turn the composition into a generic node-based dashboard.
- Don't add several AI sparkles, gradients, glass cards, or unrelated icons.
