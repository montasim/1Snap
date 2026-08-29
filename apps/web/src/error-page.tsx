import { Component, type ReactNode } from 'react';
import { releaseUrl, SiteFooter, SiteHeader } from './landing-page';

type ErrorStatus = 404 | 500;

const errorContent: Record<
  ErrorStatus,
  {
    label: string;
    title: string;
    message: string;
    frameMessage: string;
  }
> = {
  404: {
    label: 'Page not found',
    title: 'This page slipped out of frame.',
    message: 'The address may have changed, or the page may no longer be here.',
    frameMessage: 'Nothing was captured at this address.',
  },
  500: {
    label: 'Unexpected error',
    title: 'The page did not come together.',
    message: '1Snap hit an unexpected problem. Try again, or return home while it resets.',
    frameMessage: 'The page could not be assembled this time.',
  },
};

export function ErrorPage({ status }: { status: ErrorStatus }) {
  const content = errorContent[status];

  return (
    <div className="error-site">
      <SiteHeader homeHref="/" />
      <main className="error-main" id="main-content">
        <section className="error-layout page-shell" aria-labelledby="error-title">
          <div className="error-copy">
            <p className="error-label">
              <span>{status}</span>
              {content.label}
            </p>
            <h1 id="error-title">{content.title}</h1>
            <p className="error-message">{content.message}</p>
            <div className="error-actions">
              {status === 500 ? (
                <a className="button button-primary" href="">
                  Try again
                </a>
              ) : null}
              <a
                className={`button ${status === 404 ? 'button-primary' : 'button-secondary'}`}
                href="/"
              >
                Back to 1Snap
              </a>
              {status === 404 ? (
                <a className="button button-secondary" href={releaseUrl}>
                  Download latest
                </a>
              ) : null}
            </div>
          </div>

          <figure className="error-visual">
            <div className="error-frame" aria-hidden="true">
              <span className="frame-corner frame-corner-top-left" />
              <span className="frame-corner frame-corner-top-right" />
              <span className="frame-corner frame-corner-bottom-left" />
              <span className="frame-corner frame-corner-bottom-right" />
              <div className="error-ruler">
                <span>0</span>
                <i />
                <i />
                <i />
                <i />
                <span>{status}</span>
                <i />
                <i />
                <i />
                <i />
                <span>1Snap</span>
              </div>
              <div className="error-canvas">
                <img
                  className="error-canvas-mark"
                  src="/brand/1snap-mark.svg"
                  alt=""
                  width="34"
                  height="34"
                />
                <strong>{status}</strong>
                <p>{content.frameMessage}</p>
              </div>
            </div>
            <figcaption>Capture area unavailable</figcaption>
          </figure>
        </section>
      </main>
      <SiteFooter homeHref="/" />
    </div>
  );
}

export class SiteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    document.title = 'Something went wrong · 1Snap';
  }

  render() {
    return this.state.failed ? <ErrorPage status={500} /> : this.props.children;
  }
}
