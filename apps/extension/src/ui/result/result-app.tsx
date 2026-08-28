import { useEffect, useMemo, useState } from 'react';
import type { CaptureRecord } from '../../application/capture-model';
import {
  chooseRulerInterval,
  formatBytes,
  makeCaptureFilename,
} from '../../application/capture-plan';
import { stitchCapture } from '../../application/stitch-capture';
import { getCapture } from '../../infrastructure/capture-store';
import { Brand } from '../brand';
import {
  CheckIcon,
  CloseIcon,
  CoffeeIcon,
  CopyIcon,
  DownloadIcon,
  FramesIcon,
  GlobeIcon,
} from '../icons';

const SUPPORT_URL = 'https://www.supportkori.com/montasim';

type ReadyCapture = {
  record: CaptureRecord;
  png: Blob;
  url: string;
  width: number;
  height: number;
};

type ViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; capture: ReadyCapture };

function readInitialError(): string | null {
  return new URLSearchParams(window.location.search).get('error');
}

export function ResultApp() {
  const [state, setState] = useState<ViewState>(() => {
    const initialError = readInitialError();
    return initialError ? { status: 'error', message: initialError } : { status: 'loading' };
  });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (state.status === 'error') return;
    const captureId = new URLSearchParams(window.location.search).get('capture');
    if (!captureId) {
      setState({
        status: 'error',
        message: 'This capture link is incomplete. Capture the page again.',
      });
      return;
    }

    let cancelled = false;
    let objectUrl = '';
    void getCapture(captureId)
      .then(async (record) => {
        if (!record)
          throw new Error('This local capture is no longer available. Capture the page again.');
        const stitched = await stitchCapture(record);
        objectUrl = URL.createObjectURL(stitched.blob);
        if (!cancelled) {
          document.title = `${record.pageTitle} · 1Snap`;
          setState({
            status: 'ready',
            capture: {
              record,
              png: stitched.blob,
              url: objectUrl,
              width: stitched.width,
              height: stitched.height,
            },
          });
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              cause instanceof Error
                ? cause.message
                : '1Snap could not assemble the final screenshot.',
          });
        }
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  async function copyImage(capture: ReadyCapture) {
    setNotice('');
    try {
      await writeImageToClipboard(capture);
      setNotice('Image copied');
    } catch {
      setNotice('Chrome could not copy this PNG. Download it instead.');
    }
  }

  function startDownload(capture: ReadyCapture) {
    const link = document.createElement('a');
    link.href = capture.url;
    link.download = makeCaptureFilename(
      capture.record.pageTitle,
      new Date(capture.record.createdAt),
    );
    link.click();
  }

  function downloadImage(capture: ReadyCapture) {
    startDownload(capture);
    setNotice('Download started');
  }

  const ready = state.status === 'ready' ? state.capture : null;

  return (
    <main className="result-shell">
      <header className="result-header">
        <Brand />
        {ready ? (
          <div className="capture-summary" aria-label="Capture status">
            <span className="ready-dot" />
            <span>Capture ready</span>
            <span className="summary-rule" />
            <span className="summary-dimensions">
              {ready.width.toLocaleString()} × {ready.height.toLocaleString()}
            </span>
          </div>
        ) : null}
        <nav className="result-actions" aria-label="Result actions">
          {ready ? (
            <>
              <ActionButton
                label="Copy"
                icon={<CopyIcon />}
                onClick={() => void copyImage(ready)}
              />
              <ActionButton
                label="Download"
                icon={<DownloadIcon />}
                onClick={() => downloadImage(ready)}
              />
              <span className="action-separator" aria-hidden="true" />
            </>
          ) : null}
          <SupportAction />
        </nav>
      </header>

      {state.status === 'loading' ? <LoadingState /> : null}
      {state.status === 'error' ? <ErrorState message={state.message} /> : null}
      {ready ? <Proof capture={ready} /> : null}

      {notice ? (
        <div className="notice" role="status">
          {notice}
        </div>
      ) : null}
    </main>
  );
}

function SupportAction() {
  return (
    <a
      className="action-button support-action"
      href={SUPPORT_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Support 1Snap on SupportKori"
    >
      <CoffeeIcon />
      <span>Support</span>
    </a>
  );
}

async function writeImageToClipboard(capture: ReadyCapture): Promise<void> {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
    throw new Error('Image clipboard is unavailable.');
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': capture.png })]);
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="action-button" type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LoadingState() {
  return (
    <section className="loading-state" aria-live="polite">
      <div className="stitch-sequence" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <p>Stitching captured frames…</p>
      <span>1Snap is assembling the local PNG.</span>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="error-state">
      <CloseIcon className="error-icon" />
      <h1>Capture stopped.</h1>
      <p>{message}</p>
      <button className="primary-button" type="button" onClick={() => window.close()}>
        Return to the page
      </button>
    </section>
  );
}

function Proof({ capture }: { capture: ReadyCapture }) {
  const { record } = capture;
  const marks = useMemo(() => {
    const interval = chooseRulerInterval(capture.height);
    const values: number[] = [];
    for (let value = 0; value < capture.height; value += interval) values.push(value);
    if (values.at(-1) !== capture.height) values.push(capture.height);
    return values;
  }, [capture.height]);

  return (
    <>
      <section className="proof-stage" aria-label="Full-page screenshot proof">
        <div className="proof-group">
          <ol className="pixel-ruler" aria-label={`Screenshot height: ${capture.height} pixels`}>
            {marks.map((value) => (
              <li key={value} style={{ top: `${(value / capture.height) * 100}%` }}>
                <span>{value.toLocaleString()}</span>
              </li>
            ))}
          </ol>
          <div className="proof-image-wrap">
            <CropMarks />
            <RegistrationMark className="registration-top-left" />
            <RegistrationMark className="registration-top-right" />
            <RegistrationMark className="registration-bottom-left" />
            <RegistrationMark className="registration-bottom-right" />
            <img src={capture.url} alt={`Full-page capture of ${record.pageTitle}`} />
          </div>
        </div>
      </section>
      <footer className="metadata-rail" aria-label="Capture details">
        <MetadataItem icon={<FramesIcon />} tone="primary">
          {record.tiles.length} {record.tiles.length === 1 ? 'frame' : 'frames'} stitched
        </MetadataItem>
        <MetadataItem icon={<GlobeIcon />} tone="primary">
          <a href={record.sourceUrl} target="_blank" rel="noreferrer">
            {record.sourceHost}
          </a>
        </MetadataItem>
        <MetadataItem>
          {capture.width.toLocaleString()} × {capture.height.toLocaleString()} px
        </MetadataItem>
        <MetadataItem>{capture.height.toLocaleString()} px</MetadataItem>
        <MetadataItem>PNG</MetadataItem>
        <MetadataItem>{formatBytes(capture.png.size)}</MetadataItem>
        <MetadataItem>{formatCaptureTime(record.createdAt)}</MetadataItem>
        <MetadataItem icon={<CheckIcon />} tone="green">
          Capture ready
        </MetadataItem>
      </footer>
    </>
  );
}

function MetadataItem({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'primary' | 'green';
}) {
  return (
    <div className={`metadata-item${tone ? ` is-${tone}` : ''}`}>
      {icon}
      <span>{children}</span>
    </div>
  );
}

function CropMarks() {
  return (
    <div className="crop-marks" aria-hidden="true">
      <i className="crop-top-left" />
      <i className="crop-top-right" />
      <i className="crop-bottom-left" />
      <i className="crop-bottom-right" />
    </div>
  );
}

function RegistrationMark({ className }: { className: string }) {
  return <span className={`registration-mark ${className}`} aria-hidden="true" />;
}

function formatCaptureTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
