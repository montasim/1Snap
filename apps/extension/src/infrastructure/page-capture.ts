import type { PageCaptureMetrics } from '../application/capture-model';

export type PageCaptureCommand =
  | { type: 'prepare' }
  | { type: 'scroll'; scrollY: number; includeFixedElements: boolean }
  | { type: 'restore' };

type PageCaptureResult = PageCaptureMetrics | { restored: true };

type OneSnapPageState = {
  originalScrollX: number;
  originalScrollY: number;
  documentStyle: string;
  bodyStyle: string | null;
  anchoredElements: Array<{
    element: HTMLElement;
    visibility: string;
    kind: 'fixed' | 'sticky';
    documentTop: number;
    height: number;
    hasBeenShown: boolean;
  }>;
  styleElement: HTMLStyleElement;
};

declare global {
  interface Window {
    __oneSnapPageState?: OneSnapPageState;
  }
}

export async function runPageCaptureCommand(
  command: PageCaptureCommand,
): Promise<PageCaptureResult> {
  const waitForPaint = async (delay = 0) => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    if (delay > 0) await new Promise<void>((resolve) => setTimeout(resolve, delay));
  };

  const waitForViewportImages = async () => {
    const viewportMargin = 320;
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'))
      .filter((image) => {
        const bounds = image.getBoundingClientRect();
        return (
          bounds.bottom >= -viewportMargin && bounds.top <= window.innerHeight + viewportMargin
        );
      })
      .slice(0, 120);

    await Promise.allSettled(
      images.map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            const done = () => resolve();
            image.addEventListener('load', done, { once: true });
            image.addEventListener('error', done, { once: true });
            setTimeout(done, 1_500);
          });
        }
        if (image.complete && image.naturalWidth > 0 && typeof image.decode === 'function') {
          await Promise.race([
            image.decode().catch(() => undefined),
            new Promise<void>((resolve) => setTimeout(resolve, 800)),
          ]);
        }
      }),
    );
  };

  const waitForStableLayout = async () => {
    let previousHeight = measure().pageHeight;
    let stableSamples = 0;
    for (let sample = 0; sample < 4 && stableSamples < 2; sample += 1) {
      await waitForPaint(80);
      const nextHeight = measure().pageHeight;
      stableSamples = nextHeight === previousHeight ? stableSamples + 1 : 0;
      previousHeight = nextHeight;
    }
  };

  const measure = (): PageCaptureMetrics => {
    const root = document.documentElement;
    const body = document.body;
    const pageHeight = Math.max(
      root.scrollHeight,
      root.offsetHeight,
      root.clientHeight,
      body?.scrollHeight ?? 0,
      body?.offsetHeight ?? 0,
      body?.clientHeight ?? 0,
    );
    const pageWidth = Math.max(
      root.scrollWidth,
      root.offsetWidth,
      root.clientWidth,
      body?.scrollWidth ?? 0,
      body?.offsetWidth ?? 0,
      body?.clientWidth ?? 0,
    );
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pageWidth,
      pageHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      scrollY: window.scrollY,
    };
  };

  if (command.type === 'restore') {
    const state = window.__oneSnapPageState;
    if (state) {
      document.documentElement.style.cssText = state.documentStyle;
      if (document.body && state.bodyStyle !== null) document.body.style.cssText = state.bodyStyle;
      for (const item of state.anchoredElements) item.element.style.visibility = item.visibility;
      state.styleElement.remove();
      window.scrollTo(state.originalScrollX, state.originalScrollY);
      delete window.__oneSnapPageState;
      await waitForPaint();
    }
    return { restored: true };
  }

  if (command.type === 'prepare') {
    if (window.__oneSnapPageState) {
      await runPageCaptureCommand({ type: 'restore' });
    }

    const styleElement = document.createElement('style');
    styleElement.id = '__oneSnap-capture-style';
    styleElement.textContent = `
      html { scroll-behavior: auto !important; scrollbar-width: none !important; }
      html::-webkit-scrollbar, body::-webkit-scrollbar { display: none !important; }
      *, *::before, *::after {
        animation-play-state: paused !important;
        caret-color: transparent !important;
      }
    `;
    document.documentElement.append(styleElement);

    window.__oneSnapPageState = {
      originalScrollX: window.scrollX,
      originalScrollY: window.scrollY,
      documentStyle: document.documentElement.style.cssText,
      bodyStyle: document.body?.style.cssText ?? null,
      anchoredElements: [],
      styleElement,
    };

    document.documentElement.style.scrollBehavior = 'auto';
    if (document.body) document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    await waitForPaint();

    const state = window.__oneSnapPageState;
    state.anchoredElements = [...document.querySelectorAll<HTMLElement>('body *')]
      .map((element) => ({ element, position: getComputedStyle(element).position }))
      .filter(
        (item): item is { element: HTMLElement; position: 'fixed' | 'sticky' } =>
          item.position === 'fixed' || item.position === 'sticky',
      )
      .map(({ element, position }) => {
        const bounds = element.getBoundingClientRect();
        return {
          element,
          visibility: element.style.visibility,
          kind: position,
          documentTop: bounds.top + window.scrollY,
          height: bounds.height,
          hasBeenShown: false,
        };
      });

    await Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => setTimeout(resolve, 1_500)),
    ]).catch(() => undefined);
    await waitForViewportImages();
    await waitForStableLayout();
    return measure();
  }

  const state = window.__oneSnapPageState;
  if (!state) throw new Error('1Snap lost access to the page capture state.');
  window.scrollTo({ left: 0, top: command.scrollY, behavior: 'instant' });
  await waitForPaint(120);

  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  for (const item of state.anchoredElements) {
    if (item.kind === 'fixed') {
      item.element.style.visibility = command.includeFixedElements ? item.visibility : 'hidden';
      continue;
    }

    const documentBottom = item.documentTop + item.height;
    const intersectsViewport = documentBottom > viewportTop && item.documentTop < viewportBottom;
    const fitsInViewport = documentBottom <= viewportBottom || item.documentTop < viewportTop;
    const shouldShow =
      !item.hasBeenShown &&
      intersectsViewport &&
      (fitsInViewport || item.height >= window.innerHeight);
    item.element.style.visibility = shouldShow ? item.visibility : 'hidden';
    if (shouldShow) item.hasBeenShown = true;
  }

  await waitForPaint();
  await waitForViewportImages();
  await waitForStableLayout();
  return measure();
}
