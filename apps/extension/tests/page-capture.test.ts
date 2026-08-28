import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runPageCaptureCommand } from '../src/infrastructure/page-capture';

describe('runPageCaptureCommand', () => {
  let scrollY = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollY = 0;
    document.body.innerHTML = `
      <header id="fixed" style="position: fixed">Fixed header</header>
      <aside id="sticky" style="position: sticky">Sticky note</aside>
    `;
    Object.defineProperties(window, {
      innerHeight: { configurable: true, value: 800 },
      innerWidth: { configurable: true, value: 1_200 },
      scrollX: { configurable: true, get: () => 0 },
      scrollY: { configurable: true, get: () => scrollY },
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(
      (optionsOrX?: ScrollToOptions | number, y?: number) => {
        scrollY = typeof optionsOrX === 'number' ? (y ?? 0) : (optionsOrX?.top ?? 0);
      },
    );
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });

    for (const element of [document.documentElement, document.body]) {
      Object.defineProperties(element, {
        scrollHeight: { configurable: true, value: 2_400 },
        offsetHeight: { configurable: true, value: 2_400 },
        clientHeight: { configurable: true, value: 800 },
        scrollWidth: { configurable: true, value: 1_200 },
        offsetWidth: { configurable: true, value: 1_200 },
        clientWidth: { configurable: true, value: 1_200 },
      });
    }

    const fixed = document.querySelector<HTMLElement>('#fixed')!;
    const sticky = document.querySelector<HTMLElement>('#sticky')!;
    fixed.getBoundingClientRect = () =>
      ({ top: 0, bottom: 64, height: 64, left: 0, right: 1_200, width: 1_200 }) as DOMRect;
    sticky.getBoundingClientRect = () =>
      ({
        top: 1_200 - scrollY,
        bottom: 1_320 - scrollY,
        height: 120,
        left: 0,
        right: 320,
        width: 320,
      }) as DOMRect;
  });

  afterEach(async () => {
    if (window.__oneSnapPageState) {
      const restoring = runPageCaptureCommand({ type: 'restore' });
      await vi.runAllTimersAsync();
      await restoring;
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const runCommand = async (
    command: Parameters<typeof runPageCaptureCommand>[0],
  ): Promise<Awaited<ReturnType<typeof runPageCaptureCommand>>> => {
    const result = runPageCaptureCommand(command);
    await vi.runAllTimersAsync();
    return result;
  };

  it('captures fixed content first and a below-fold sticky element exactly once', async () => {
    const fixed = document.querySelector<HTMLElement>('#fixed')!;
    const sticky = document.querySelector<HTMLElement>('#sticky')!;

    await runCommand({ type: 'prepare' });
    await runCommand({ type: 'scroll', scrollY: 0, includeFixedElements: true });
    expect(fixed.style.visibility).toBe('');
    expect(sticky.style.visibility).toBe('hidden');

    await runCommand({ type: 'scroll', scrollY: 800, includeFixedElements: false });
    expect(fixed.style.visibility).toBe('hidden');
    expect(sticky.style.visibility).toBe('');

    await runCommand({ type: 'scroll', scrollY: 1_600, includeFixedElements: false });
    expect(sticky.style.visibility).toBe('hidden');

    await runCommand({ type: 'restore' });
    expect(fixed.style.visibility).toBe('');
    expect(sticky.style.visibility).toBe('');
  });
});
