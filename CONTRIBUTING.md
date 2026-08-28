# Contributing to 1Snap

Thanks for helping improve 1Snap. Contributions should preserve its focused workflow: one
toolbar action produces one local full-page PNG.

## Development setup

You need Node.js 24, pnpm 11.7.0, and Chrome 120 or later.

```bash
pnpm install
pnpm check
```

Use `pnpm dev:extension` for extension development and `pnpm dev:web` for the product website.

## Before opening a pull request

1. Keep changes scoped and preserve unrelated work.
2. Add or update tests for behavior changes.
3. Run `pnpm format` and review the result.
4. Run `pnpm check`.
5. For capture changes, load `apps/extension/.output` in Chrome and test a short page, a long
   page, and an expected error on a restricted URL.
6. For result-page changes, verify keyboard focus, narrow widths, long screenshots, notices,
   and the fixed metadata rail.

## Reporting capture defects

Include the Chrome version, operating system, page type, approximate page height, expected
result, and actual result. Share the target URL only when it is public and safe. Never attach a
screenshot containing credentials, private messages, financial information, health data, or
other sensitive content.

## Pull requests

Explain the user-facing problem, the chosen approach, and the validation performed. Keep
release notes focused on observable changes rather than implementation detail.
