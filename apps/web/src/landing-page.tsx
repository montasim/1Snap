import { ArrowIcon, CheckIcon, CoffeeIcon, CopyIcon, DownloadIcon } from './icons';

const supportUrl = 'https://www.supportkori.com/montasim';

const captureSteps = [
  {
    title: 'Start from the toolbar',
    text: 'Open the page you need and click 1Snap once.',
  },
  {
    title: 'Let 1Snap scroll',
    text: 'The extension captures measured frames, then restores your position.',
  },
  {
    title: 'Use the finished PNG',
    text: 'Inspect it, copy it, or download it from the dedicated result page.',
  },
];

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero page-shell">
          <div className="hero-copy">
            <p className="hero-kicker">Full-page capture for Chrome</p>
            <h1>
              The whole page.
              <span>One clean shot.</span>
            </h1>
            <p className="hero-summary">
              Capture any scrollable page, then copy or download one locally stitched PNG.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#install">
                Install 1Snap <ArrowIcon />
              </a>
              <a className="button button-secondary" href="#how-it-works">
                See how it works
              </a>
            </div>
          </div>

          <figure className="product-visual">
            <div className="product-shot">
              <img
                src="/screenshots/1snap-result.png"
                alt="1Snap result page with a full-page capture, dimensions, and image actions"
              />
            </div>
            <figcaption>A focused result page built around the image, not an editor.</figcaption>
          </figure>
        </section>

        <section className="trust-strip" aria-label="1Snap product facts">
          <div className="page-shell trust-strip-inner">
            <p>
              <strong>Local by default</strong>
              Frames stay inside the browser.
            </p>
            <p>
              <strong>No account</strong>
              Install it and start capturing.
            </p>
            <p>
              <strong>One PNG</strong>
              No project or editor to manage.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="workflow page-shell">
          <div className="workflow-intro">
            <h2>Long pages become ordinary images.</h2>
            <p>1Snap handles the scrolling and stitching, then gives you one familiar file.</p>
          </div>

          <ol className="workflow-list">
            {captureSteps.map((step) => (
              <li key={step.title}>
                <CheckIcon />
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="result" className="output-section">
          <div className="page-shell output-layout">
            <div className="output-copy">
              <h2>Ready for wherever it goes next.</h2>
              <p>
                The result page keeps the screenshot large and puts only the essential actions
                within reach.
              </p>
            </div>

            <div className="action-grid" aria-label="Result page actions">
              <article className="action-card action-card-primary">
                <CopyIcon />
                <div>
                  <h3>Copy</h3>
                  <p>Place the PNG directly on your clipboard.</p>
                </div>
              </article>
              <article className="action-card">
                <DownloadIcon />
                <div>
                  <h3>Download</h3>
                  <p>Save a clearly named PNG to your device.</p>
                </div>
              </article>
              <article className="action-card action-card-soft">
                <CheckIcon />
                <div>
                  <h3>Inspect</h3>
                  <p>Check dimensions, source, file size, and capture time.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="privacy" className="privacy-section">
          <div className="page-shell privacy-layout">
            <div className="privacy-copy">
              <p className="section-kicker">Private by design</p>
              <h2>Your screenshot does not need a cloud.</h2>
              <p>Frames are assembled inside the extension and kept locally for the result tab.</p>
            </div>
            <dl className="privacy-facts">
              <div>
                <dt>Accounts</dt>
                <dd>None</dd>
              </div>
              <div>
                <dt>Uploads</dt>
                <dd>None</dd>
              </div>
              <div>
                <dt>Analytics</dt>
                <dd>None</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="install" className="install-section page-shell">
          <div className="install-copy">
            <h2>Three quick actions, then it stays in Chrome.</h2>
            <p>
              1Snap is available as an unpacked extension while the Chrome Web Store listing is
              prepared.
            </p>
          </div>
          <ol className="install-list">
            <InstallItem label="Build">
              Run <code>pnpm build:extension</code>
            </InstallItem>
            <InstallItem label="Open">
              Visit <code>chrome://extensions</code> and enable Developer mode
            </InstallItem>
            <InstallItem label="Load">
              Choose <code>apps/extension/.output</code> as an unpacked extension
            </InstallItem>
          </ol>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <div>
            <Brand />
            <p>A focused full-page screenshot extension for Chrome.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#privacy">Privacy</a>
            <a href={supportUrl} target="_blank" rel="noreferrer">
              Support
            </a>
          </nav>
        </div>
      </footer>

      <SupportWidget />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <div className="page-shell header-inner">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#result">Result page</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <a className="header-cta" href="#install">
          Install 1Snap
        </a>
      </div>
    </header>
  );
}

function Brand() {
  return (
    <a className="site-brand" href="#top" aria-label="1Snap home">
      <img src="/brand/1snap-mark.svg" alt="" />
      <span>1Snap</span>
    </a>
  );
}

function InstallItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li>
      <span>{label}</span>
      <p>{children}</p>
    </li>
  );
}

function SupportWidget() {
  return (
    <a
      className="support-widget"
      href={supportUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Support 1Snap on SupportKori"
    >
      <span className="support-icon" aria-hidden="true">
        <CoffeeIcon />
      </span>
      <span>
        <strong>Support 1Snap</strong>
        <small>SupportKori</small>
      </span>
    </a>
  );
}
