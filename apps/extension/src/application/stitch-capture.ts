import type { CaptureRecord } from './capture-model';

const MAX_CANVAS_HEIGHT = 32_000;
const MAX_CANVAS_WIDTH = 16_000;
const MAX_CANVAS_AREA = 120_000_000;

export type OutputGeometry = {
  width: number;
  height: number;
  sourceScale: number;
  downscale: number;
};

export function calculateOutputGeometry(
  sourceTileWidth: number,
  sourceTileHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  pageHeight: number,
): OutputGeometry {
  const scaleX = sourceTileWidth / viewportWidth;
  const scaleY = sourceTileHeight / viewportHeight;
  const sourceScale = Math.min(scaleX, scaleY);
  const sourceWidth = Math.round(viewportWidth * sourceScale);
  const sourceHeight = Math.ceil(pageHeight * sourceScale);
  const downscale = Math.min(
    1,
    MAX_CANVAS_WIDTH / sourceWidth,
    MAX_CANVAS_HEIGHT / sourceHeight,
    Math.sqrt(MAX_CANVAS_AREA / (sourceWidth * sourceHeight)),
  );
  return {
    width: Math.max(1, Math.floor(sourceWidth * downscale)),
    height: Math.max(1, Math.floor(sourceHeight * downscale)),
    sourceScale,
    downscale,
  };
}

export async function stitchCapture(record: CaptureRecord): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  const firstTile = record.tiles[0];
  if (!firstTile) throw new Error('This capture does not contain any image frames.');

  const firstBitmap = await createImageBitmap(firstTile.blob);
  const geometry = calculateOutputGeometry(
    firstBitmap.width,
    firstBitmap.height,
    record.viewportWidth,
    record.viewportHeight,
    record.pageHeight,
  );
  const canvas = document.createElement('canvas');
  canvas.width = geometry.width;
  canvas.height = geometry.height;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('Chrome could not prepare the final screenshot canvas.');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const drawTile = (bitmap: ImageBitmap, scrollY: number) => {
    const targetY = Math.round(scrollY * geometry.sourceScale * geometry.downscale);
    const targetWidth = Math.round(bitmap.width * geometry.downscale);
    const targetHeight = Math.round(bitmap.height * geometry.downscale);
    context.drawImage(bitmap, 0, targetY, targetWidth, targetHeight);
  };

  drawTile(firstBitmap, firstTile.scrollY);
  firstBitmap.close();
  for (const tile of record.tiles.slice(1)) {
    const bitmap = await createImageBitmap(tile.blob);
    drawTile(bitmap, tile.scrollY);
    bitmap.close();
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error('Chrome could not encode the PNG.'))),
      'image/png',
    );
  });
  return { blob, width: canvas.width, height: canvas.height };
}
