import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CaptureRecord } from '../src/application/capture-model';
import { ResultApp } from '../src/ui/result/result-app';

const mocks = vi.hoisted(() => ({
  getCapture: vi.fn(),
  stitchCapture: vi.fn(),
}));

vi.mock('../src/infrastructure/capture-store', () => ({ getCapture: mocks.getCapture }));
vi.mock('../src/application/stitch-capture', () => ({ stitchCapture: mocks.stitchCapture }));

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
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();
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
