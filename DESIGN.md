---
name: 1Snap
description: A measured press-proof system for local full-page capture.
colors:
  ink: '#211c22'
  muted-ink-result: '#665e67'
  muted-ink-web: '#625b63'
  warm-paper: '#f1ede7'
  white-paper: '#fffefc'
  web-background: '#ffffff'
  web-surface-soft: '#f6f3fa'
  rule-gray-result: '#d4ccc5'
  rule-gray-web: '#ded9e3'
  rule-gray-strong-result: '#968a83'
  rule-gray-strong-web: '#bdb5c7'
  capture-orange: '#c74924'
  capture-orange-dark: '#973317'
  registration-ink: '#17211d'
  capture-green: '#2b7a55'
  stop-red: '#b13a4b'
  pale-orange-hover: '#fbe2d7'
typography:
  display:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)'
    fontWeight: 690
    lineHeight: 0.98
    letterSpacing: '-0.04em'
  headline:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: 'clamp(1.875rem, 3vw, 2.5rem)'
    fontWeight: 660
    lineHeight: 1.05
    letterSpacing: '-0.035em'
  result-heading:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: '36px'
    fontWeight: 700
    letterSpacing: '-0.04em'
  body:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.65
  body-large:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.65
  control:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: '14px'
    fontWeight: 650
  action:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: '14px'
    fontWeight: 560
  measurement:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: '11px'
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: '0.04em'
  metadata:
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif"
    fontSize: '12px'
    fontWeight: 400
rounded:
  square: '0px'
  control-result: '8px'
  control-web: '12px'
  panel-web: '18px'
  registration: '50%'
spacing:
  control-gap: '8px'
  control-block: '11px'
  control-inline: '18px'
  utility-gap: '24px'
  result-header-inline: '32px'
  web-shell-gutter: '24px'
  web-shell-gutter-compact: '16px'
  section-major: '108px'
components:
  button-primary-web:
    backgroundColor: '{colors.capture-orange}'
    textColor: '{colors.white-paper}'
    typography: '{typography.control}'
    rounded: '{rounded.control-web}'
    padding: '0 20px'
  button-primary-web-hover:
    backgroundColor: '{colors.capture-orange-dark}'
    textColor: '{colors.white-paper}'
    typography: '{typography.control}'
    rounded: '{rounded.control-web}'
    padding: '0 20px'
  button-secondary-web:
    backgroundColor: '{colors.web-background}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control-web}'
    padding: '0 20px'
  button-action-result:
    backgroundColor: 'transparent'
    textColor: '{colors.capture-orange}'
    typography: '{typography.action}'
    rounded: '{rounded.control-result}'
    padding: '8px 12px'
  button-action-result-hover:
    backgroundColor: '{colors.pale-orange-hover}'
    textColor: '{colors.capture-orange-dark}'
    typography: '{typography.action}'
    rounded: '{rounded.control-result}'
    padding: '8px 12px'
  button-primary-result:
    backgroundColor: '{colors.capture-orange}'
    textColor: '{colors.white-paper}'
    typography: '{typography.control}'
    rounded: '{rounded.control-result}'
    padding: '10px 18px'
  navigation-site:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    typography: '{typography.action}'
    rounded: '{rounded.square}'
    padding: '0 24px'
    height: '68px'
  capture-summary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.action}'
    rounded: '{rounded.square}'
    padding: '0'
  measurement-ruler:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.measurement}'
    rounded: '{rounded.square}'
    width: '70px'
  proof-sheet:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.square}'
  metadata-rail:
    backgroundColor: '{colors.white-paper}'
    textColor: '{colors.ink}'
    typography: '{typography.metadata}'
    rounded: '{rounded.square}'
    height: '64px'
---

# Design System: 1Snap

## Overview

**Creative North Star: "The Pressroom Proof"**

1Snap treats every capture as a pressroom proof: exact, measured, and ready to release. The system is precise, calm, and editorial-production in character. Warm proof stock creates the extension's inspection field, while the product website stays bright white. Press Ink, disciplined rules, and code-native measurements make the interface feel like trustworthy instrumentation rather than decoration.

The screenshot is always the dominant artifact. Controls stay compact and extension-native, production marks remain sparse and functional, and the visual system avoids adding an editor around a simple capture workflow. The result is quiet enough for inspection but distinctive through proof geometry, tabular data, and a rare registration accent.

**Key Characteristics:**

- Measured proof geometry with rulers, crop corners, registration targets, and metadata rails.
- Flat instrumentation organized around one deliberately lifted screenshot sheet.
- Instrument Sans for product language and IBM Plex Mono for measurements and capture facts.
- Shared Capture Orange, Press Ink, and Proof Green roles across a warm extension surface and white website.
- Compact literal actions, low radii, thin rules, and responsive disclosure instead of card-based composition.

## Colors

The Capture Orange palette reads like a production proof: clean neutral surfaces and Press Ink do most of the work, Capture Orange carries action and identity, and semantic colors appear only when their meaning is literal.

### Primary

- **Capture Orange** (#c74924): The main action and identity color for marks, primary controls, links, frame progress, dimensions, and focus outlines.
- **Dark Capture Orange** (#973317): The interaction partner reserved for orange hover and active states.
- **Pale Orange Hover** (#fbe2d7): The quiet extension action-hover field; use it behind orange utility actions, not as a broad surface color.

### Secondary

- **Registration Ink** (#17211d): The dark registration point inside the orange brand mark and a precise contrast detail, not a second accent color.

### Tertiary

- **Proof Green** (#2b7a55): Completion, ready state, successful frame progress, and affirmative checks.
- **Stop Red** (#b13a4b): Error-state iconography for a stopped or failed capture; the accompanying copy must also state the failure.

### Neutral

- **Warm Proof Stock** (#f1ede7): The dominant canvas behind extension result inspection surfaces.
- **Web White** (#ffffff): The locked light-theme background for the product website.
- **Web Soft Surface** (#f6f3fa): The restrained tinted section surface on the product website.
- **Warm Paper** (#fffefc): Sticky utility rails, the captured-page sheet, and restrained control surfaces.
- **Press Ink** (#211c22): Primary text and the privacy band; use it as the default high-contrast foreground.
- **Muted Ink — Extension** (#665e67): Secondary explanation text on the extension result surface.
- **Muted Ink — Web** (#625b63): Secondary explanation text on the landing surface.
- **Rule Hairline — Extension** (#d4ccc5): Regular dividers and borders on the result surface.
- **Rule Hairline — Web** (#d2cac3): Regular dividers and borders on the landing surface.
- **Rule Gray — Extension** (#968a83): Ruler edges and strong segmentation on the result surface.
- **Rule Gray — Web** (#968a83): Strong segmentation and control borders on the landing surface.

### Named Rules

**The Registration Exception Rule.** Registration Ink appears only in the brand mark's registration point. Proof marks use Capture Orange so the product has one coherent accent.

**The State Color Rule.** Proof Green means completed or ready, Stop Red means stopped or failed, and neither color communicates state without text or an icon.

## Typography

**Display Font:** Instrument Sans Variable (with system-ui and sans-serif fallback)

**Body Font:** Instrument Sans Variable (with system-ui and sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono (with monospace fallback)

**Character:** Instrument Sans is deliberate and self-hosted: its compact forms keep large editorial headlines and small extension controls in the same family. IBM Plex Mono provides the mechanical register for dimensions, frame counts, step numbers, source facts, and ruler labels.

### Hierarchy

- **Display** (Instrument Sans Variable, weight 690, 40–56px, line-height 0.98, letter-spacing -0.04em): The landing-page proposition; permitted to switch one line to Capture Orange without overpowering the screenshot proof.
- **Headline** (Instrument Sans Variable, weight 660, 30–40px, line-height 1.05, letter-spacing -0.035em): Major landing section statements with a clear step above body copy and subheadings.
- **Result Heading** (Instrument Sans Variable, weight 700, 36px, letter-spacing -0.04em): Empty and error-state titles; direct, compact, and never promotional.
- **Body** (Instrument Sans Variable, weight 400, 15px, line-height 1.65): Dense extension explanation and recovery copy.
- **Body Large** (Instrument Sans Variable, weight 400, 17px, line-height 1.65): Landing-page section introductions.
- **Control** (Instrument Sans Variable, weight 650, 14px): Literal verbs in strong primary and secondary controls.
- **Action** (Instrument Sans Variable, weight 560, 14px): The lighter result-header actions and compact navigation.
- **Measurement** (IBM Plex Mono, weight 500, 11px, line-height 1.3, letter-spacing 0.04em): Uppercase process facts and tabular dimensions, frame counts, step numbers, and ruler labels.
- **Metadata** (Instrument Sans Variable, weight 400, 12px): Compact values in the fixed result rail, quieter than the action layer.

### Named Rules

**The Instrument Split Rule.** Instrument Sans speaks to the user; IBM Plex Mono measures the capture. Do not use mono for marketing headlines or use proportional numerals for ruler and dimension data.

## Layout

The website uses a centered shell capped at 1200px with 24px side gutters, tightening to 16px below 620px. The desktop hero is an asymmetric 0.92fr / 1.08fr split with a responsive 40–76px gap, keeping the real result screenshot dominant without forcing oversized copy. Major sections use 108px vertical intervals and thin full-width rules instead of grids of detached cards.

The result page is an uninterrupted inspection surface between a 64px sticky utility header and a 64px fixed metadata rail. Its proof group is capped at 900px, with a 70px ruler and 16px gap; the screenshot occupies the remaining width. At 1050px the centered summary yields first, and at 680px the header becomes 58px, the ruler narrows to 44px, crop marks disappear, and metadata collapses to the source, frame count, and ready state needed on a narrow viewport.

The website stacks major two-column compositions at 900px, hides the center navigation at that breakpoint, and makes paired hero actions full-width below 620px. Mobile preserves the same editorial order rather than inventing an alternate card layout.

### Named Rules

**The Screenshot-First Rule.** Allocate scale to the captured page before adding interface chrome; measurement and action layers must remain visibly subordinate at every breakpoint.

## Elevation & Depth

The system is flat instrumentation around a deliberately lifted screenshot sheet. Depth comes primarily from Warm Paper against Warm Proof Stock, 1px rules, and fixed or sticky rails. The captured page receives the strongest soft shadow; current sticky rails use only a low-contrast boundary shadow to remain legible over scrolling content, not to become floating panels.

### Shadow Vocabulary

- **Captured proof sheet** (`box-shadow: 0 18px 60px rgba(54, 42, 50, 0.16)`): Structural lift for the real screenshot on the extension result page.
- **Captured-page specimen** (`box-shadow: 0 18px 54px rgba(57, 42, 50, 0.17)`): The corresponding lift used by the landing hero's code-native capture demonstration.
- **Sticky utility edge** (`box-shadow: 0 8px 24px rgba(57, 42, 50, 0.05–0.06)`): A restrained scroll-boundary cue for the website and result headers; do not reuse it as card elevation.

### Named Rules

**The Lifted Proof Rule.** Large-area elevation belongs to the captured page. Surrounding rails, measurements, and sections stay flat; never turn them into a family of floating cards.

## Shapes

Proof geometry is square and low-radius. Screenshot sheets, rigs, rails, workflow cells, fact bands, and section boundaries use square corners. Compact buttons and status notices use the one recurring control radius; circles are reserved for ready dots and registration targets.

Lines are structural: 1px warm-gray dividers and borders, 1px ruler ticks, and 1px Press Ink crop corners. Registration targets use a circular 1px amber stroke crossed by 1px horizontal and vertical rules. These marks remain small, decorative-only, and never interactive.

### Named Rules

**The Proof Geometry Rule.** Square the work surface, round only compact controls, and reserve circles for literal status or registration marks.

## Components

### Buttons

- **Shape:** Compact, low-radius controls with an 8px corner and literal text labels.
- **Primary web CTA:** 48px minimum height with 11px × 18px padding, white on Capture Orange, and a small authored arrow. Hover shifts to Dark Capture Orange and lifts by 2px.
- **Secondary web action:** Shares the primary CTA's size and geometry, using a strong Rule Gray border over an off-white surface; hover resolves to white.
- **Result action:** 42px minimum height with 8px × 12px padding, a 20px authored line icon, and Capture Orange text on a transparent utility rail. Hover adds the Pale Orange Hover field and a 1px lift.
- **Recovery action:** 44px minimum height with 10px × 18px padding, white on Capture Orange, used only in the stopped state.
- **Focus:** All interactive elements receive a 2px Capture Orange outline with a 4px offset. Never remove the text label from a primary action; the result header may visually hide labels below 680px while preserving them for assistive technology.

### Navigation

The website header is a 68px sticky three-column rail: brand at the start, compact text links centered, and one Capture Orange install action at the end. Below 900px the center navigation hides and the brand/CTA pair remains. The extension header follows the same literal utility grammar at 64px but prioritizes capture actions over site navigation.

### Capture Status

Ready state combines a small Proof Green dot, the words “Capture ready,” a strong Rule Gray separator, and Capture Orange tabular dimensions. The status is centered in the desktop result header and removed at 1050px before actions or branding are compromised.

### Measurement Ruler & Proof Marks

The ruler is generated from real output height, uses IBM Plex Mono with tabular numerals, and places labels against a continuous strong Rule Gray edge with repeating hairline ticks. Crop corners sit 34px outside the screenshot on desktop. Four 14px registration targets straddle the sheet corners by 7px; mobile hides crop corners but keeps measurement context.

### Screenshot Proof

The real stitched PNG is a block-level responsive image inside a square Warm Paper sheet. The screenshot—not a decorative browser mockup—owns the stage. The sheet carries the structural proof shadow, registration targets, and crop marks but no extra border under the shadow.

### Metadata Rail

The fixed 64px footer segments frame count, source, dimensions, height, format, file size, time, and final state with strong 1px rules. Values use tabular numbers; the primary Capture Orange modifier identifies source and capture facts, while Proof Green identifies completion. At narrow widths, disclosure collapses instead of wrapping the rail into cards.

### Loading, Notices & Errors

Loading uses four 16px × 48px Capture Orange frame bars with a 1.2s staggered stitching motion and explicit local-assembly copy. Notices are compact Press Ink fields with an 8px radius. Error state uses the Stop Red close icon, a direct title, plain-language recovery copy, and one Capture Orange recovery button. Reduced-motion preference shortens all animation and transitions to 0.01ms with one iteration.

### Named Rules

**The Literal Action Rule.** Pair authored square-stroke icons with explicit verbs; do not substitute icon-only primary actions or decorative tool controls that 1Snap does not provide.

## Do's and Don'ts

### Do:

- **Do** keep the real screenshot or a code-native measured capture demonstration as the dominant visual object.
- **Do** use Capture Orange for identity, primary action, focus, and measured capture facts.
- **Do** reserve Press Ink for the brand registration point, and Proof Green for literal completion.
- **Do** generate ruler labels, dimensions, file size, frame count, source, and time from real capture data.
- **Do** collapse secondary metadata and ornament before compromising the screenshot, action labels, or keyboard focus.

### Don't:

- **Don't** build generic SaaS card grids, glass panels, soft purple gradients, or oversized pill controls.
- **Don't** surround the capture with fake editing tools, decorative production jargon, or a decorative screenshot mockup.
- **Don't** spread shadows across ordinary sections or containers; large-area lift belongs to the captured-page sheet.
- **Don't** introduce a competing purple or blue identity color, or rely on green/red without text and icon support.
- **Don't** flag Instrument Sans merely because its name contains “Instrument”; it is the deliberate self-hosted brand face.
