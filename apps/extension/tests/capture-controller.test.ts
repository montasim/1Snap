import { beforeEach, describe, expect, it, vi } from 'vitest';
import { captureFullPage } from '../src/application/capture-controller';
import { saveCapture } from '../src/infrastructure/capture-store';

vi.mock('../src/infrastructure/capture-store', () => ({
  saveCapture: vi.fn(async () => undefined),
}));

const onePixelPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nXcAAAAASUVORK5CYII=';

function makeChromeMock() {
  const executeScript = vi.fn(
    async ({
      args,
    }: {
      args: Array<{ type: 'prepare' | 'scroll' | 'restore'; scrollY?: number }>;
    }) => {
      const command = args[0];
      if (command?.type === 'restore') return [{ result: { restored: true } }];
      return [
        {
          result: {
            viewportWidth: 1_200,
            viewportHeight: 900,
            pageWidth: 1_200,
            pageHeight: 900,
            devicePixelRatio: 1,
            scrollY: command?.scrollY ?? 0,
          },
        },
      ];
    },
  );
  const create = vi.fn(async () => ({ id: 99 }));
  const chromeMock = {
    scripting: { executeScript },
    action: {
      setBadgeBackgroundColor: vi.fn(async () => undefined),
      setBadgeText: vi.fn(async () => undefined),
      setTitle: vi.fn(async () => undefined),
    },
    runtime: { getURL: (path: string) => `chrome-extension://1snap${path}` },
    tabs: {
      get: vi.fn(async () => ({ id: 7, active: true, windowId: 3 })),
      captureVisibleTab: vi.fn(async () => onePixelPng),
      create,
    },
  };
  vi.stubGlobal('chrome', chromeMock);
  return { chromeMock, create, executeScript };
}

describe('captureFullPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('captures, stores, restores, and opens one viewport-sized page', async () => {
    const { chromeMock, create, executeScript } = makeChromeMock();
    await captureFullPage({
      id: 7,
      windowId: 3,
      active: true,
      title: 'Example page',
      url: 'https://example.com/article',
    } as chrome.tabs.Tab);

    expect(chromeMock.tabs.captureVisibleTab).toHaveBeenCalledOnce();
    expect(saveCapture).toHaveBeenCalledWith(
      expect.objectContaining({
        pageTitle: 'Example page',
        sourceHost: 'example.com',
        pageHeight: 900,
        tiles: [expect.objectContaining({ index: 0, scrollY: 0 })],
      }),
    );
    expect(executeScript.mock.calls.map((call) => call[0]?.args[0]?.type)).toEqual([
      'prepare',
      'scroll',
      'restore',
    ]);
    expect(create).toHaveBeenCalledWith({
      url: expect.stringContaining('chrome-extension://1snap/result.html?capture='),
    });
  });

  it('explains restricted pages without trying to inject a script', async () => {
    const { chromeMock, create, executeScript } = makeChromeMock();
    await captureFullPage({
      id: 7,
      windowId: 3,
      active: true,
      title: 'Extensions',
      url: 'chrome://extensions',
    } as chrome.tabs.Tab);

    expect(executeScript).not.toHaveBeenCalled();
    expect(chromeMock.tabs.captureVisibleTab).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({
      url: expect.stringContaining('error=Chrome+does+not+allow+full-page+capture+here'),
    });
  });

  it('revalidates the active source tab after waiting and before capture', async () => {
    const { chromeMock, create } = makeChromeMock();
    chromeMock.tabs.get
      .mockResolvedValueOnce({ id: 7, active: true, windowId: 3 })
      .mockResolvedValueOnce({ id: 7, active: false, windowId: 3 });

    await captureFullPage({
      id: 7,
      windowId: 3,
      active: true,
      title: 'Example page',
      url: 'https://example.com/article',
    } as chrome.tabs.Tab);

    expect(chromeMock.tabs.captureVisibleTab).not.toHaveBeenCalled();
    expect(saveCapture).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({
      url: expect.stringContaining('error=The+page+tab+changed+during+capture'),
    });
  });

  it('rejects a captured frame if the active tab changes during capture', async () => {
    const { chromeMock, create } = makeChromeMock();
    chromeMock.tabs.get
      .mockResolvedValueOnce({ id: 7, active: true, windowId: 3 })
      .mockResolvedValueOnce({ id: 7, active: true, windowId: 3 })
      .mockResolvedValueOnce({ id: 7, active: false, windowId: 3 });

    await captureFullPage({
      id: 7,
      windowId: 3,
      active: true,
      title: 'Example page',
      url: 'https://example.com/article',
    } as chrome.tabs.Tab);

    expect(chromeMock.tabs.captureVisibleTab).toHaveBeenCalledOnce();
    expect(saveCapture).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({
      url: expect.stringContaining('error=The+page+tab+changed+during+capture'),
    });
  });

  it('extends the capture plan when lazy content increases the page height', async () => {
    vi.useFakeTimers();
    const { chromeMock, executeScript } = makeChromeMock();
    executeScript.mockImplementation(
      async ({
        args,
      }: {
        args: Array<{ type: 'prepare' | 'scroll' | 'restore'; scrollY?: number }>;
      }) => {
        const command = args[0];
        if (command?.type === 'restore') return [{ result: { restored: true } }];
        return [
          {
            result: {
              viewportWidth: 1_200,
              viewportHeight: 900,
              pageWidth: 1_200,
              pageHeight: command?.type === 'prepare' ? 1_800 : 2_700,
              devicePixelRatio: 1,
              scrollY: command?.scrollY ?? 0,
            },
          },
        ];
      },
    );

    try {
      const capture = captureFullPage({
        id: 7,
        windowId: 3,
        active: true,
        title: 'Growing page',
        url: 'https://example.com/growing',
      } as chrome.tabs.Tab);
      await vi.runAllTimersAsync();
      await capture;

      expect(chromeMock.tabs.captureVisibleTab).toHaveBeenCalledTimes(3);
      expect(saveCapture).toHaveBeenCalledWith(
        expect.objectContaining({
          pageHeight: 2_700,
          tiles: [
            expect.objectContaining({ scrollY: 0 }),
            expect.objectContaining({ scrollY: 900 }),
            expect.objectContaining({ scrollY: 1_800 }),
          ],
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
