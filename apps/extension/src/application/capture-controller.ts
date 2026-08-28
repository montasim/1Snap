import type { CaptureRecord, PageCaptureMetrics } from './capture-model';
import { MAX_CAPTURE_FRAMES, planCapturePositions } from './capture-plan';
import { saveCapture } from '../infrastructure/capture-store';
import { runPageCaptureCommand, type PageCaptureCommand } from '../infrastructure/page-capture';

const MIN_CAPTURE_INTERVAL_MS = 650;
const activeCaptures = new Set<number>();

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

function isCaptureMetrics(value: unknown): value is PageCaptureMetrics {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PageCaptureMetrics>;
  return (
    typeof candidate.viewportWidth === 'number' &&
    typeof candidate.viewportHeight === 'number' &&
    typeof candidate.pageWidth === 'number' &&
    typeof candidate.pageHeight === 'number' &&
    typeof candidate.devicePixelRatio === 'number' &&
    typeof candidate.scrollY === 'number'
  );
}

async function runOnPage(tabId: number, command: PageCaptureCommand): Promise<PageCaptureMetrics> {
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId },
    func: runPageCaptureCommand,
    args: [command],
  });
  if (!isCaptureMetrics(injection?.result)) {
    throw new Error('The page stopped responding before 1Snap could finish.');
  }
  return injection.result;
}

async function restorePage(tabId: number): Promise<void> {
  await chrome.scripting
    .executeScript({
      target: { tabId },
      func: runPageCaptureCommand,
      args: [{ type: 'restore' } satisfies PageCaptureCommand],
    })
    .catch(() => undefined);
}

async function setProgress(tabId: number, current: number, total: number): Promise<void> {
  const percentage = Math.round((current / total) * 100);
  await Promise.allSettled([
    chrome.action.setBadgeBackgroundColor({ color: '#6A3FB5', tabId }),
    chrome.action.setBadgeText({ text: `${percentage}`, tabId }),
    chrome.action.setTitle({ title: `1Snap is capturing · ${current} of ${total}`, tabId }),
  ]);
}

async function clearProgress(tabId: number): Promise<void> {
  await Promise.allSettled([
    chrome.action.setBadgeText({ text: '', tabId }),
    chrome.action.setTitle({ title: 'Capture full page with 1Snap', tabId }),
  ]);
}

async function openResult(parameters: URLSearchParams): Promise<void> {
  const resultUrl = new URL(chrome.runtime.getURL('/result.html'));
  resultUrl.search = parameters.toString();
  await chrome.tabs.create({ url: resultUrl.href });
}

async function assertSourceTabIsActive(tabId: number, windowId: number): Promise<void> {
  const currentTab = await chrome.tabs.get(tabId);
  if (!currentTab.active || currentTab.windowId !== windowId) {
    throw new Error('The page tab is not active.');
  }
}

function describeCaptureError(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : '';
  if (/cannot access|extensions gallery|chrome:\/\//i.test(message)) {
    return 'Chrome does not allow extensions to capture this page. Open a regular website and try again.';
  }
  if (/active tab|not active|No tab with id/i.test(message)) {
    return 'The page tab changed during capture. Keep the page active until 1Snap finishes.';
  }
  return message || '1Snap could not finish this capture. Reload the page and try again.';
}

export async function captureFullPage(tab: chrome.tabs.Tab): Promise<void> {
  const tabId = tab.id;
  const windowId = tab.windowId;
  const sourceUrl = tab.url ?? '';
  if (tabId === undefined || windowId === undefined) return;

  if (!/^https?:\/\//i.test(sourceUrl)) {
    await openResult(
      new URLSearchParams({
        error:
          'Chrome does not allow full-page capture here. Open a regular http or https website and try again.',
      }),
    );
    return;
  }
  if (activeCaptures.has(tabId)) return;

  activeCaptures.add(tabId);
  let prepared = false;
  try {
    await chrome.action.setBadgeBackgroundColor({ color: '#6A3FB5', tabId });
    await chrome.action.setBadgeText({ text: '0', tabId });
    const metrics = await runOnPage(tabId, { type: 'prepare' });
    prepared = true;
    const tiles: CaptureRecord['tiles'] = [];
    let lastCaptureAt = 0;
    let pageHeight = metrics.pageHeight;
    let pageWidth = metrics.pageWidth;
    let requestedY = 0;

    while (true) {
      if (tiles.length >= MAX_CAPTURE_FRAMES) {
        throw new Error(
          `This page needs more than ${MAX_CAPTURE_FRAMES} capture frames. Try a shorter page or a taller browser window.`,
        );
      }

      await assertSourceTabIsActive(tabId, windowId);
      const scrolled = await runOnPage(tabId, {
        type: 'scroll',
        scrollY: requestedY,
        includeFixedElements: tiles.length === 0,
      });
      pageHeight = Math.max(pageHeight, scrolled.pageHeight);
      pageWidth = Math.max(pageWidth, scrolled.pageWidth);
      const plannedTotal = planCapturePositions(pageHeight, metrics.viewportHeight).length;
      await setProgress(tabId, tiles.length, plannedTotal);

      const waitForRateLimit = MIN_CAPTURE_INTERVAL_MS - (Date.now() - lastCaptureAt);
      if (waitForRateLimit > 0) await delay(waitForRateLimit);
      await assertSourceTabIsActive(tabId, windowId);
      const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
      await assertSourceTabIsActive(tabId, windowId);
      lastCaptureAt = Date.now();
      const blob = await (await fetch(dataUrl)).blob();
      tiles.push({ index: tiles.length, scrollY: scrolled.scrollY, blob });
      await setProgress(tabId, tiles.length, plannedTotal);

      const finalOffset = Math.max(0, Math.ceil(pageHeight - metrics.viewportHeight));
      if (scrolled.scrollY >= finalOffset) break;
      const nextY = Math.min(scrolled.scrollY + metrics.viewportHeight, finalOffset);
      if (nextY <= scrolled.scrollY) {
        throw new Error('The page stopped scrolling before 1Snap could reach the bottom.');
      }
      requestedY = nextY;
    }

    const parsedUrl = new URL(sourceUrl);
    const record: CaptureRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      pageTitle: tab.title?.trim() || parsedUrl.hostname,
      sourceUrl,
      sourceHost: parsedUrl.hostname.replace(/^www\./, ''),
      viewportWidth: metrics.viewportWidth,
      viewportHeight: metrics.viewportHeight,
      pageWidth,
      pageHeight,
      devicePixelRatio: metrics.devicePixelRatio,
      tiles,
    };
    await saveCapture(record);
    await openResult(new URLSearchParams({ capture: record.id }));
  } catch (cause) {
    await openResult(new URLSearchParams({ error: describeCaptureError(cause) }));
  } finally {
    if (prepared) await restorePage(tabId);
    await clearProgress(tabId);
    activeCaptures.delete(tabId);
  }
}
