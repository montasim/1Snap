export const MAX_CAPTURE_FRAMES = 50;

export function planCapturePositions(
  pageHeight: number,
  viewportHeight: number,
  maxFrames = MAX_CAPTURE_FRAMES,
): number[] {
  if (!Number.isFinite(pageHeight) || !Number.isFinite(viewportHeight)) {
    throw new Error('1Snap received invalid page dimensions.');
  }
  if (pageHeight <= 0 || viewportHeight <= 0) {
    throw new Error('1Snap cannot capture a page with an empty viewport.');
  }

  const finalOffset = Math.max(0, Math.ceil(pageHeight - viewportHeight));
  if (finalOffset === 0) return [0];

  const positions: number[] = [];
  for (let offset = 0; offset < finalOffset; offset += viewportHeight) {
    positions.push(offset);
    if (positions.length >= maxFrames) break;
  }

  if (positions.length >= maxFrames && positions.at(-1) !== finalOffset) {
    throw new Error(
      `This page needs more than ${maxFrames} capture frames. Try a shorter page or a taller browser window.`,
    );
  }

  if (positions.at(-1) !== finalOffset) positions.push(finalOffset);
  return positions;
}

export function makeCaptureFilename(title: string, createdAt = new Date()): string {
  const safeTitle = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 72);
  const stamp = createdAt.toISOString().replace(/[:.]/g, '-');
  return `1snap-${safeTitle || 'full-page'}-${stamp}.png`;
}

export function chooseRulerInterval(height: number): number {
  if (height <= 5_000) return 500;
  if (height <= 12_000) return 1_000;
  if (height <= 30_000) return 2_000;
  return 5_000;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}
