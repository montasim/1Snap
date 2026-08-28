# Security policy

## Supported versions

1Snap is currently a `0.1.x` pre-release. Security fixes are applied to the latest source and
latest published pre-release only.

## Reporting a vulnerability

Do not open a public issue containing exploit details, captured page content, credentials, or
other sensitive information. Use GitHub's private vulnerability reporting when it is available
for this repository. If that channel is unavailable, contact the maintainer
privately through the [Montasim GitHub profile](https://github.com/montasim).

Include the affected version, Chrome version, impact, reproduction steps, and the smallest safe
proof of concept. Remove personal data, authentication material, and unrelated page content.

## Security boundaries

1Snap captures pixels from the explicitly active tab and temporarily stores recent frames in
extension-owned IndexedDB. It does not require an account or remote processing. Users remain
responsible for deciding whether captured content is safe to copy, download, or share.
