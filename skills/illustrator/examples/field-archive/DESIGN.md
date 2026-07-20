---
version: "alpha"
name: Field Archive
description: A contemporary natural-history identity where one plant specimen, measured annotation, and restrained catalog metadata turn observation into a clear visual system.
colors:
  paper: "#F1EBDD"
  specimen: "#31533C"
  moss: "#66715A"
  ink: "#20241F"
  graphite: "#8A897F"
  rule: "#C9C1B0"
  label: "#DDD2B9"
  signal: "#C94B3C"
  white: "#FFFDF7"
typography:
  display:
    fontFamily: Noto Sans SC
    fontSize: 72px
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: -0.04em
  headline:
    fontFamily: Noto Sans SC
    fontSize: 38px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.025em
  body:
    fontFamily: Noto Sans SC
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0.11em
  metric:
    fontFamily: JetBrains Mono
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.1
spacing:
  xs: 8px
  sm: 16px
  md: 30px
  lg: 56px
  xl: 88px
components:
  canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  specimen-field:
    backgroundColor: "{colors.white}"
    specimenColor: "{colors.specimen}"
  catalog-label:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  measurement-rail:
    textColor: "{colors.graphite}"
    ruleColor: "{colors.rule}"
    typography: "{typography.label}"
  observation-marker:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.white}"
---

## Overview

Field Archive treats one natural object as a subject of contemporary observation. A plant, stone, shell, material sample, or similarly focused object occupies the visual center while measured annotation and compact catalog metadata reveal its form. The result should feel attentive, exact, and quietly alive rather than nostalgic or institutional.

This identity is useful for natural history, field research, cultural objects, materials, collections, product stories, and explanatory content where one subject benefits from close looking.

## Colors

Use warm archive paper as the canvas and deep mineral green as the primary specimen color. Ink remains nearly black with a subtle green cast. Moss and graphite support secondary text, while quiet tan rules divide information without boxing it into cards.

Reserve signal red for one observed feature, active note, or catalog status. Never repeat it across every label. Keep photography natural; derive small palette adjustments from the subject without tinting the entire image.

Avoid yellowed vintage paper, sepia filters, tea stains, dark museum interiors, or multicolor botanical palettes. The archive should feel current and usable.

## Typography

Use Noto Sans SC for titles, observations, and prose. Keep the main title concise, medium-heavy, and editorial rather than monumental. Use deliberate line breaks when a Chinese phrase needs more presence.

Use JetBrains Mono for accession numbers, dimensions, dates, coordinates, material names, classification labels, and short English metadata. Do not invent scientific names, collection claims, locations, or measurements when the source does not provide them. Neutral identifiers such as `FIELD NOTE 024` may be used as compositional metadata.

## Composition

Default to a portrait canvas. Give one specimen roughly half to two-thirds of the image and preserve its complete identifying silhouette. Place it slightly off center so one side can carry a measurement rail and the other can hold no more than three short observation notes.

Use one strong vertical axis, one compact title block, and a quiet footer rail. Let annotation lines terminate precisely at a visible feature. Keep their routes straight or single-bend; do not create a web of connectors.

Negative space is part of the archive. Do not fill every open area with taxonomy, paragraphs, coordinates, stamps, or decoration.

## Specimen Treatment

Use `contain` for isolated subjects so stems, tips, handles, edges, or other identifying features remain intact. A transparent subject may sit directly on the paper field. A supplied image with an existing background may appear as one borderless scan plane or intentional crop.

Preserve natural asymmetry, tears, discoloration, and other visible evidence. Do not repair a specimen into a perfect stock silhouette. Avoid artificial cut-paper shadows, glossy product retouching, heavy duotones, or generated detail.

When no image is supplied, draw one simplified but identifiable natural form with crisp SVG geometry. Do not compensate for a weak focal form by adding a collection of small specimens.

## Measurement and Annotation

A measurement rail uses one fine vertical or horizontal rule, sparse ticks, and compact monospaced labels. Treat it as a visual scale unless verified measurements are available; label unverified divisions as structural zones such as `TOP / MID / BASE` or as sample indexes rather than physical units. Keep the rail directly on the canvas instead of placing it on a contrasting background strip.

Observation notes should name visible form, texture, rhythm, damage, or directional growth. Keep them descriptive and short. Use one red marker to connect the primary observation to one real feature. Other leaders remain graphite or moss.

Do not imitate a scientific paper with fabricated Latin taxonomy, false laboratory values, or decorative equations.

## Components

Use one specimen field, one catalog label, one measurement rail, and up to three annotation lines. A single observation marker may highlight the most important feature. Keep all components aligned to the specimen's axis or the page margins.

For code images, treat the code as a preserved working sample. Use line numbers as the measurement rail, place one annotation on a meaningful code fragment, and keep the file name, language, and version in the catalog label. Preserve neutral syntax contrast and avoid editor chrome, glass panels, or ornamental botanical decoration around the code.

## Supplied Images

Make one supplied image the subject. Prefer isolated plants, natural objects, material fragments, or clear single-object photographs. Preserve aspect ratio and protect the complete silhouette when recognition depends on it.

If the background has useful environmental context, retain one decisive crop rather than removing it automatically. If the subject is already isolated, let it sit directly on the archive paper without a card, frame, mat, or drop shadow. Credit supplied photography when requested or required.

## Do's and Don'ts

- Do make one specimen immediately dominant.
- Do connect every annotation to a visible feature or real supplied fact.
- Do preserve natural irregularities and complete identifying edges.
- Do keep measurement, identifiers, and labels sparse and aligned.
- Don't turn the page into a vintage scrapbook with tape, stamps, torn paper, or handwriting.
- Don't scatter several leaves, flowers, insects, and stones at equal weight.
- Don't fabricate species, locations, dimensions, or research conclusions.
- Don't turn the specimen into a bouquet or tactile gift composition.
- Don't place the specimen inside a rounded card or interface panel.
