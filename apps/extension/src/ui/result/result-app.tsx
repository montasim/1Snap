import { useEffect, useMemo, useRef, useState } from 'react';
import {
  commitAnnotation,
  createAnnotationDocument,
  createAnnotationHistory,
  isAnnotationDocument,
  redoAnnotation,
  undoAnnotation,
  type Annotation,
  type AnnotationColor,
  type AnnotationHistory,
  type AnnotationTool,
} from '../../application/annotation-model';
import type { CaptureRecord } from '../../application/capture-model';
import {
  chooseRulerInterval,
  formatBytes,
  makeCaptureFilename,
} from '../../application/capture-plan';
import { stitchCapture } from '../../application/stitch-capture';
import { renderAnnotatedPng } from '../../application/render-annotations';
import {
  getAnnotationDocument,
  saveAnnotationDocument,
} from '../../infrastructure/annotation-store';
import { getCapture } from '../../infrastructure/capture-store';
import { Brand } from '../brand';
import {
  AnnotateIcon,
  CheckIcon,
  CloseIcon,
  CoffeeIcon,
  CopyIcon,
  DownloadIcon,
  FramesIcon,
  GlobeIcon,
} from '../icons';
import { AnnotationOverlay } from './annotation-overlay';
import { AnnotationToolbar } from './annotation-toolbar';

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
  const [annotations, setAnnotations] = useState<AnnotationHistory>(() =>
    createAnnotationHistory(createAnnotationDocument(1, 1)),
  );
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationTool, setAnnotationTool] = useState<AnnotationTool>('border');
  const [annotationColor, setAnnotationColor] = useState<AnnotationColor>('#c74924');
  const [annotationWidth, setAnnotationWidth] = useState(6);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [annotatedFileSize, setAnnotatedFileSize] = useState<number | null>(null);
  const annotationBaseline = useRef<AnnotationHistory | null>(null);
  const exportCache = useRef<{
    document: AnnotationHistory['present'];
    blob: Blob;
    url: string;
  } | null>(null);

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
        const [stitched, storedAnnotations] = await Promise.all([
          stitchCapture(record),
          getAnnotationDocument(captureId).catch(() => null),
        ]);
        objectUrl = URL.createObjectURL(stitched.blob);
        if (!cancelled) {
          const annotationDocument = isAnnotationDocument(
            storedAnnotations,
            stitched.width,
            stitched.height,
          )
            ? storedAnnotations
            : createAnnotationDocument(stitched.width, stitched.height);
          window.document.title = `${record.pageTitle} · 1Snap`;
          setAnnotations(createAnnotationHistory(annotationDocument));
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

  const ready = state.status === 'ready' ? state.capture : null;
  const annotationDocument = annotations.present;
  const annotationCount = annotationDocument.items.length;

  useEffect(() => {
    if (!ready || annotationDocument.imageWidth !== ready.width) return;
    const timeout = window.setTimeout(() => {
      void saveAnnotationDocument(ready.record.id, annotationDocument).catch(() => {
        setNotice('Annotations could not be saved locally. Copy or download before closing.');
      });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [annotationDocument, ready]);

  useEffect(() => {
    const cached = exportCache.current;
    if (!cached || cached.document === annotationDocument) return;
    URL.revokeObjectURL(cached.url);
    exportCache.current = null;
    setAnnotatedFileSize(null);
  }, [annotationDocument]);

  useEffect(
    () => () => {
      if (exportCache.current) URL.revokeObjectURL(exportCache.current.url);
    },
    [],
  );

  useEffect(() => {
    if (
      selectedAnnotationId &&
      !annotationDocument.items.some((item) => item.id === selectedAnnotationId)
    ) {
      setSelectedAnnotationId(null);
    }
  }, [annotationDocument, selectedAnnotationId]);

  useEffect(() => {
    if (!isAnnotating) return;
    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches('input, select, textarea');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) setAnnotations((history) => redoAnnotation(history));
        else setAnnotations((history) => undoAnnotation(history));
        return;
      }
      if (!isTyping && (event.key === 'Delete' || event.key === 'Backspace')) {
        if (!selectedAnnotationId) return;
        event.preventDefault();
        setAnnotations((history) =>
          commitAnnotation(history, { type: 'remove', id: selectedAnnotationId }),
        );
        setSelectedAnnotationId(null);
      }
      if (!isTyping && event.key === 'Escape') {
        setSelectedAnnotationId(null);
        setAnnotationTool('select');
      }
    }
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isAnnotating, selectedAnnotationId]);

  async function copyImage(capture: ReadyCapture) {
    setNotice('');
    try {
      const output = await prepareOutput(capture, annotationDocument);
      await writeImageToClipboard(output.blob);
      setNotice(annotationCount > 0 ? 'Annotated image copied' : 'Image copied');
    } catch {
      setNotice('Chrome could not copy this PNG. Download it instead.');
    }
  }

  function startDownload(capture: ReadyCapture, url: string, annotated: boolean) {
    const link = document.createElement('a');
    link.href = url;
    const filename = makeCaptureFilename(
      capture.record.pageTitle,
      new Date(capture.record.createdAt),
    );
    link.download = annotated ? filename.replace(/\.png$/i, '-annotated.png') : filename;
    link.click();
  }

  async function downloadImage(capture: ReadyCapture) {
    try {
      setNotice(annotationCount > 0 ? 'Preparing annotated PNG…' : 'Preparing download…');
      const output = await prepareOutput(capture, annotationDocument);
      startDownload(capture, output.url, annotationCount > 0);
      setNotice(annotationCount > 0 ? 'Annotated download started' : 'Download started');
    } catch {
      setNotice('Chrome could not prepare this PNG. Try again.');
    }
  }

  async function prepareOutput(
    capture: ReadyCapture,
    document: AnnotationHistory['present'],
  ): Promise<{ blob: Blob; url: string }> {
    if (document.items.length === 0) return { blob: capture.png, url: capture.url };
    const cached = exportCache.current;
    if (cached?.document === document) return { blob: cached.blob, url: cached.url };

    const blob = await renderAnnotatedPng(capture.png, document);
    const url = URL.createObjectURL(blob);
    if (exportCache.current) URL.revokeObjectURL(exportCache.current.url);
    exportCache.current = { document, blob, url };
    setAnnotatedFileSize(blob.size);
    return { blob, url };
  }

  function beginAnnotating() {
    annotationBaseline.current = annotations;
    setAnnotationTool('border');
    setSelectedAnnotationId(null);
    setIsAnnotating(true);
    setNotice('Drag on the screenshot to add a border.');
  }

  function chooseAnnotationTool(tool: AnnotationTool) {
    setAnnotationTool(tool);
    if (tool !== 'select') setSelectedAnnotationId(null);
    const instructions: Record<AnnotationTool, string> = {
      select: 'Select an annotation to move, resize, or delete it.',
      marker: 'Draw directly on the screenshot with the marker.',
      highlight: 'Drag over an area to add a translucent highlight.',
      border: 'Drag around an area to add a border.',
    };
    setNotice(instructions[tool]);
  }

  function cancelAnnotating() {
    if (annotationBaseline.current) setAnnotations(annotationBaseline.current);
    annotationBaseline.current = null;
    setSelectedAnnotationId(null);
    setIsAnnotating(false);
    setNotice('Annotation changes cancelled');
  }

  async function finishAnnotating() {
    annotationBaseline.current = null;
    setSelectedAnnotationId(null);
    setIsAnnotating(false);
    if (!ready || annotationCount === 0) {
      setNotice(annotationCount === 0 ? 'Annotation mode closed' : 'Annotations ready');
      return;
    }
    try {
      setNotice('Preparing annotated PNG…');
      await prepareOutput(ready, annotationDocument);
      setNotice(`${annotationCount} ${annotationCount === 1 ? 'annotation' : 'annotations'} ready`);
    } catch {
      setNotice('Annotations are visible, but the PNG could not be prepared yet.');
    }
  }

  function addAnnotation(annotation: Annotation) {
    setAnnotations((history) => commitAnnotation(history, { type: 'add', annotation }));
    setSelectedAnnotationId(annotation.id);
  }

  function replaceAnnotation(annotation: Annotation) {
    setAnnotations((history) => commitAnnotation(history, { type: 'replace', annotation }));
  }

  return (
    <main className={`result-shell${isAnnotating ? ' is-annotating' : ''}`}>
      <header className="result-header">
        <Brand />
        {ready ? (
          <div className="capture-summary" aria-label="Capture status">
            <span className={`ready-dot${isAnnotating ? ' is-editing' : ''}`} />
            <span>
              {isAnnotating
                ? 'Annotating'
                : annotationCount > 0
                  ? `${annotationCount} ${annotationCount === 1 ? 'annotation' : 'annotations'}`
                  : 'Capture ready'}
            </span>
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
                label="Annotate"
                icon={<AnnotateIcon />}
                active={isAnnotating}
                onClick={isAnnotating ? () => void finishAnnotating() : beginAnnotating}
              />
              <ActionButton
                label="Copy"
                icon={<CopyIcon />}
                onClick={() => void copyImage(ready)}
              />
              <ActionButton
                label="Download"
                icon={<DownloadIcon />}
                onClick={() => void downloadImage(ready)}
              />
              <span className="action-separator" aria-hidden="true" />
            </>
          ) : null}
          <SupportAction />
        </nav>
      </header>

      {ready && isAnnotating ? (
        <AnnotationToolbar
          tool={annotationTool}
          color={annotationColor}
          strokeWidth={annotationWidth}
          count={annotationCount}
          canUndo={annotations.past.length > 0}
          canRedo={annotations.future.length > 0}
          onToolChange={chooseAnnotationTool}
          onColorChange={setAnnotationColor}
          onStrokeWidthChange={setAnnotationWidth}
          onUndo={() => setAnnotations((history) => undoAnnotation(history))}
          onRedo={() => setAnnotations((history) => redoAnnotation(history))}
          onClear={() => {
            setAnnotations((history) => commitAnnotation(history, { type: 'clear' }));
            setSelectedAnnotationId(null);
          }}
          onCancel={cancelAnnotating}
          onDone={() => void finishAnnotating()}
        />
      ) : null}

      {state.status === 'loading' ? <LoadingState /> : null}
      {state.status === 'error' ? <ErrorState message={state.message} /> : null}
      {ready ? (
        <Proof
          capture={ready}
          annotations={annotationDocument}
          editing={isAnnotating}
          tool={annotationTool}
          color={annotationColor}
          displayStrokeWidth={annotationWidth}
          selectedId={selectedAnnotationId}
          outputSize={annotatedFileSize}
          onSelect={setSelectedAnnotationId}
          onAdd={addAnnotation}
          onReplace={replaceAnnotation}
        />
      ) : null}

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

async function writeImageToClipboard(png: Blob): Promise<void> {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
    throw new Error('Image clipboard is unavailable.');
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
}

function ActionButton({
  label,
  icon,
  onClick,
  active = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      className={`action-button${active ? ' is-active' : ''}`}
      type="button"
      aria-pressed={active || undefined}
      onClick={onClick}
    >
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

function Proof({
  capture,
  annotations,
  editing,
  tool,
  color,
  displayStrokeWidth,
  selectedId,
  outputSize,
  onSelect,
  onAdd,
  onReplace,
}: {
  capture: ReadyCapture;
  annotations: AnnotationHistory['present'];
  editing: boolean;
  tool: AnnotationTool;
  color: AnnotationColor;
  displayStrokeWidth: number;
  selectedId: string | null;
  outputSize: number | null;
  onSelect: (id: string | null) => void;
  onAdd: (annotation: Annotation) => void;
  onReplace: (annotation: Annotation) => void;
}) {
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
          <div className={`proof-image-wrap${editing ? ' is-editing' : ''}`}>
            <CropMarks />
            <RegistrationMark className="registration-top-left" />
            <RegistrationMark className="registration-top-right" />
            <RegistrationMark className="registration-bottom-left" />
            <RegistrationMark className="registration-bottom-right" />
            <img src={capture.url} alt={`Full-page capture of ${record.pageTitle}`} />
            <AnnotationOverlay
              document={annotations}
              editing={editing}
              tool={tool}
              color={color}
              displayStrokeWidth={displayStrokeWidth}
              selectedId={selectedId}
              onSelect={onSelect}
              onAdd={onAdd}
              onReplace={onReplace}
            />
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
        <MetadataItem>{formatBytes(outputSize ?? capture.png.size)}</MetadataItem>
        <MetadataItem>{formatCaptureTime(record.createdAt)}</MetadataItem>
        <MetadataItem icon={<CheckIcon />} tone="green">
          {annotations.items.length > 0
            ? `${annotations.items.length} ${annotations.items.length === 1 ? 'annotation' : 'annotations'} ready`
            : 'Capture ready'}
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
