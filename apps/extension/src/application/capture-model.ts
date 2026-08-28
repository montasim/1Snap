export type CaptureTile = {
  index: number;
  scrollY: number;
  blob: Blob;
};

export type CaptureRecord = {
  id: string;
  createdAt: string;
  pageTitle: string;
  sourceUrl: string;
  sourceHost: string;
  viewportWidth: number;
  viewportHeight: number;
  pageWidth: number;
  pageHeight: number;
  devicePixelRatio: number;
  tiles: CaptureTile[];
};

export type PageCaptureMetrics = {
  viewportWidth: number;
  viewportHeight: number;
  pageWidth: number;
  pageHeight: number;
  devicePixelRatio: number;
  scrollY: number;
};

export type CaptureProgress = {
  capturedFrames: number;
  totalFrames: number;
};
