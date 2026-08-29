# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

WXT, React, and TypeScript for a Chrome Manifest V3 extension, with a Vite and React product website in the same pnpm workspace.

## Users

People who need a complete visual record of a web page while browsing and want the result immediately available as an image they can reuse.

## Product Purpose

1Snap captures the full scrollable length of the active web page and opens a dedicated result page where the user can inspect, copy, or download the finished PNG. Success means one deliberate toolbar action produces one trustworthy full-page image without an account or external service.

## Positioning

1Snap is a focused, local-first capture tool: it scrolls and stitches the page in the browser, then turns the finished image into a calm proofing surface instead of adding editing, annotation, PDF, or cloud-workspace complexity.

## Operating Context

The primary workflow starts from a normal Chrome tab. The user clicks the 1Snap toolbar icon, briefly waits while the extension moves through the page, and lands on a new extension-owned result tab containing the full screenshot and image actions.

## Capabilities and Constraints

- Capture the full vertical length of the active regular web page at the current viewport width.
- Create a PNG result page with inspect, non-destructive annotation, copy, and download actions.
- Mark a capture with freehand strokes, translucent highlights, or measured borders while keeping the original PNG unchanged.
- Keep captures local to the browser; no account, analytics, upload, or remote processing is required.
- Use only the permissions needed for capture, local storage, and download behavior.
- Restore the page's original scroll position and temporarily changed presentation after capture.
- Explain restricted pages, oversized pages, and capture interruptions in plain language.
- Provide optional SupportKori access without loading remote scripts inside the extension.
- Chrome is the initial supported browser. Chrome-owned pages and other restricted URLs cannot be captured by extensions.

## Brand Commitments

- Product name: 1Snap.
- The implementation must not reuse the existing Thoughtline or ReproKit visual themes.
- ReproKit's compact, purposeful extension-tool character is a quality reference, not a palette or component source.
- The supplied GoFullPage result-page image is a functional reference for a large screenshot canvas and immediately available actions, not a visual template.

## Evidence on Hand

- Functional result-page reference: `/tmp/codex-clipboard-e772fab0-22d3-4a04-8756-8885f99988b8.png`.
- Stack and landing-page architecture reference: `/home/montasim/Work/Personal/Thoughtline`.
- Extension interaction-density reference: `/home/montasim/Work/Personal/ReproKit`.
- Verified support destination: `https://www.supportkori.com/montasim`.
- No testimonials, install counts, store listing, commercial claims, or hosted service exist yet; future work must not fabricate them.

## Product Principles

- One action in, one finished image out.
- Local work stays local.
- Show progress and recover cleanly when capture cannot finish.
- Keep the screenshot—not the interface—as the dominant object.
- Add no feature that makes the core capture path harder to understand.

## Accessibility & Inclusion

All actions must be keyboard reachable, carry visible focus, meet WCAG AA contrast, communicate progress and errors without color alone, and respect reduced-motion preferences.
