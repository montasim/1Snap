# Changelog

All notable changes to 1Snap are documented here. The project follows Semantic Versioning.

## Unreleased

## 0.1.1 - 2026-08-29

### Added

- Non-destructive Marker, Highlight, and Border tools on the screenshot result page
- Annotation colors, stroke widths, selection, movement, resizing, undo, redo, clear, cancel, and
  done controls
- Local annotation persistence for recent captures and original-resolution composition for Copy
  and Download
- Branded 404 and 500 pages for the product website

### Changed

- Copy and Download now export the annotated PNG when marks are present
- Product website typography, public-facing annotation copy, result-page screenshot, and social
  preview
- Website download actions now resolve through the latest GitHub release URL

### Fixed

- SupportKori content-security-policy access and duplicate website support controls
- Annotation width control spacing at desktop and mobile sizes

## 0.1.0 - 2026-08-28

### Added

- Full-page capture from the Chrome toolbar with active-tab progress
- Local frame storage, page restoration, and browser-canvas PNG stitching
- Inspect, copy, and download actions on a measured result page
- Loading, ready, error, responsive, and reduced-motion result states
- White product website with product proof, plain-language privacy details, honest Chrome launch
  messaging, and SupportKori access
- Unified Capture Orange identity across the extension, website, icons, favicons, and social card
- Automated favicon and social-preview generation
- Verified Chrome ZIP packaging with a SHA-256 checksum
