import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CaptureRecord } from '../src/application/capture-model';
import { ResultApp } from '../src/ui/result/result-app';

const mocks = vi.hoisted(() => ({
  getCapture: vi.fn(),
  getAnnotationDocument: vi.fn(),
  saveAnnotationDocument: vi.fn(),
  renderAnnotatedPng: vi.fn(),
  stitchCapture: vi.fn(),
}));

vi.mock('../src/infrastructure/capture-store', () => ({ getCapture: mocks.getCapture }));
vi.mock('../src/infrastructure/annotation-store', () => ({
  getAnnotationDocument: mocks.getAnnotationDocument,
  saveAnnotationDocument: mocks.saveAnnotationDocument,
}));
vi.mock('../src/application/stitch-capture', () => ({ stitchCapture: mocks.stitchCapture }));
vi.mock('../src/application/render-annotations', () => ({
  renderAnnotatedPng: mocks.renderAnnotatedPng,
}));

const record: CaptureRecord = {
  id: 'capture-1',
  createdAt: '2026-08-28T12:30:00.000Z',
  pageTitle: 'Example page',
  sourceUrl: 'https://example.com/article',
  sourceHost: 'example.com',
  viewportWidth: 1_200,
  viewportHeight: 900,
  pageWidth: 1_200,
  pageHeight: 1_800,
  devicePixelRatio: 1,
  tiles: [
    { index: 0, scrollY: 0, blob: new Blob(['frame-1'], { type: 'image/png' }) },
    { index: 1, scrollY: 900, blob: new Blob(['frame-2'], { type: 'image/png' }) },
  ],
};

describe('ResultApp', () => {
  const clipboardWrite = vi.fn(async () => undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/result.html?capture=capture-1');
    mocks.getCapture.mockResolvedValue(record);
    mocks.getAnnotationDocument.mockResolvedValue(null);
    mocks.saveAnnotationDocument.mockResolvedValue(undefined);
    mocks.renderAnnotatedPng.mockResolvedValue(new Blob(['annotated'], { type: 'image/png' }));
    mocks.stitchCapture.mockResolvedValue({
      blob: new Blob(['stitched'], { type: 'image/png' }),
      width: 1_200,
      height: 1_800,
    });
    vi.stubGlobal(
      'ClipboardItem',
      class ClipboardItemMock {
        constructor(readonly data: Record<string, Blob>) {}
      },
    );
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: clipboardWrite },
    });
    URL.createObjectURL = vi.fn(() => 'blob:1snap-result');
    URL.revokeObjectURL = vi.fn();
  });

  it('shows real capture metadata and copies the PNG', async () => {
    render(<ResultApp />);

    expect(await screen.findAllByText('Capture ready')).toHaveLength(2);
    expect(screen.getByText('2 frames stitched')).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getAllByText('1,200 × 1,800').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(clipboardWrite).toHaveBeenCalledOnce());
    expect(screen.getByText('Image copied')).toBeInTheDocument();
    expect(mocks.renderAnnotatedPng).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
  });

  it('opens the annotation toolbar with the approved tools', async () => {
    render(<ResultApp />);

    fireEvent.click(await screen.findByRole('button', { name: 'Annotate' }));

    expect(screen.getByRole('region', { name: 'Annotation tools' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marker' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Highlight' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Border' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('composes saved annotations before copying', async () => {
    mocks.getAnnotationDocument.mockResolvedValue({
      version: 1,
      imageWidth: 1_200,
      imageHeight: 1_800,
      items: [
        {
          id: 'border-1',
          kind: 'border',
          color: '#c74924',
          strokeWidth: 8,
          x: 100,
          y: 120,
          width: 300,
          height: 180,
        },
      ],
    });
    render(<ResultApp />);

    fireEvent.click(await screen.findByRole('button', { name: 'Copy' }));

    await waitFor(() => expect(mocks.renderAnnotatedPng).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.getByText('Annotated image copied')).toBeInTheDocument());
    expect(clipboardWrite).toHaveBeenCalledOnce();
  });

  it('keeps the stitching state visible while a capture is loading', () => {
    mocks.getCapture.mockReturnValue(new Promise(() => undefined));
    render(<ResultApp />);

    expect(screen.getByText('Stitching captured frames…')).toBeInTheDocument();
    expect(screen.getByText('1Snap is assembling the local PNG.')).toBeInTheDocument();
  });

  it('links to the verified SupportKori page', () => {
    render(<ResultApp />);

    const supportLink = screen.getByRole('link', { name: 'Support 1Snap on SupportKori' });

    expect(supportLink).toHaveAttribute('href', 'https://www.supportkori.com/montasim');
    expect(supportLink.closest('nav')).toHaveAttribute('aria-label', 'Result actions');
  });

  it('shows a clear error supplied by the capture controller', () => {
    window.history.replaceState(
      {},
      '',
      '/result.html?error=Chrome%20does%20not%20allow%20full-page%20capture%20here.',
    );
    render(<ResultApp />);

    expect(screen.getByRole('heading', { name: 'Capture stopped.' })).toBeInTheDocument();
    expect(screen.getByText('Chrome does not allow full-page capture here.')).toBeInTheDocument();
    expect(mocks.getCapture).not.toHaveBeenCalled();
  });
});
