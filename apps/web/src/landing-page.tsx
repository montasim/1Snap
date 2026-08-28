const supportUrl = 'https://www.supportkori.com/montasim';

const captureSteps = [
  {
    title: 'Open the page',
    text: 'Choose any regular web page and start 1Snap from the Chrome toolbar.',
  },
  {
    title: 'Let it travel',
    text: '1Snap scrolls from top to bottom, then returns you to where you were.',
  },
  {
    title: 'Keep one PNG',
    text: 'Inspect the finished image, copy it, or download it with a clear filename.',
  },
];

const resultActions = [
  {
    title: 'Inspect',
    text: 'Check where the image came from, when it was captured, and its dimensions and file size.',
  },
  {
    title: 'Copy',
    text: 'Place the complete PNG on your clipboard without leaving the result page.',
  },
  {
    title: 'Download',
    text: 'Save one clearly named image directly to your device.',
  },
];

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="hero page-shell">
          <div className="hero-copy">
            <p className="eyebrow">Full-page capture for Chrome</p>
            <h1>
              Every scroll.
              <span>One screenshot.</span>
            </h1>
            <p className="hero-summary">
              1Snap scrolls, stitches, and opens a clean PNG you can inspect, copy, or download.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#result">
                See the result
              </a>
              <a className="button button-secondary" href="#how-it-works">
                How it works
              </a>
            </div>
          </div>

          <figure className="hero-proof">
            <div className="proof-backdrop" aria-hidden="true" />
            <div className="proof-window">
              <div className="proof-window-bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <i />
              </div>
              <img
                src="/screenshots/1snap-result.png"
                alt="1Snap result page showing a complete captured page with copy and download actions"
                width="1268"
                height="713"
                fetchPriority="high"
              />
            </div>
            <figcaption>
              <strong>The complete page stays visible.</strong>
              <span>No editor, account, or cloud upload in the way.</span>
            </figcaption>
          </figure>
        </section>

        <section className="fact-band" aria-label="1Snap product facts">
          <div className="page-shell fact-band-inner">
            <p>
              <strong>Private by default</strong>
              Screenshots stay on your device.
            </p>
            <p>
              <strong>One toolbar click</strong>
              Capture starts on demand.
            </p>
            <p>
              <strong>Ready as a PNG</strong>
              Copy it or save it right away.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="workflow page-shell">
          <div className="section-intro">
            <h2>The long page handles itself.</h2>
            <p>
              Stay on the page you need. 1Snap manages the movement, measurements, and assembly.
            </p>
          </div>

          <ol className="workflow-track">
            {captureSteps.map((step) => (
              <li className="workflow-step" key={step.title}>
                <span className="workflow-marker" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="result" className="result-section">
          <div className="page-shell result-layout">
            <figure className="result-visual">
              <img
                src="/screenshots/1snap-result.png"
                alt="1Snap screenshot result with capture dimensions and file details"
                width="1268"
                height="713"
                loading="lazy"
              />
              <figcaption>Copy and Download stay close to the finished image.</figcaption>
            </figure>

            <div className="result-copy">
              <h2>The screenshot is the workspace.</h2>
              <p>
                The result tab is built around the image. Everything else helps you verify and keep
                it.
              </p>
              <div className="result-actions" aria-label="Result page actions">
                {resultActions.map((action) => (
                  <article key={action.title}>
                    <h3>{action.title}</h3>
                    <p>{action.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="privacy" className="privacy-section page-shell">
          <div className="privacy-copy">
            <p className="eyebrow">Private by design</p>
            <h2>A screenshot tool without a cloud-shaped catch.</h2>
            <p>Your screenshots are put together inside Chrome and stay on your device.</p>
          </div>

          <dl className="privacy-facts">
            <div>
              <dt>Accounts</dt>
              <dd>None</dd>
              <p>No sign-up needed.</p>
            </div>
            <div>
              <dt>Uploads</dt>
              <dd>None</dd>
              <p>Your screenshots stay in your browser.</p>
            </div>
            <div>
              <dt>Analytics</dt>
              <dd>None</dd>
              <p>What you capture is not tracked.</p>
            </div>
          </dl>
        </section>

        <section id="release" className="release-section page-shell">
          <div className="release-panel">
            <div className="release-copy">
              <h2>Coming soon to Chrome.</h2>
              <p>
                1Snap is getting ready for the Chrome Web Store. Once it launches, one toolbar click
                will capture the whole page and open a finished PNG.
              </p>
            </div>

            <ul className="release-list">
              <ReleaseItem label="One click">Start from the 1Snap button in Chrome.</ReleaseItem>
              <ReleaseItem label="Stays private">
                Your page is processed on your device, not uploaded.
              </ReleaseItem>
              <ReleaseItem label="Ready to use">
                Copy the finished image or download it as a PNG.
              </ReleaseItem>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <div>
            <Brand />
            <p>Full-page screenshots, stitched locally in Chrome.</p>
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
    <header className="site-header">
      <div className="page-shell header-inner">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#result">Result page</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <a className="header-cta" href="#release">
          Coming soon
        </a>
      </div>
    </header>
  );
}

function Brand() {
  return (
    <a className="site-brand" href="#top" aria-label="1Snap home">
      <img src="/brand/1snap-mark.svg" alt="" width="34" height="34" />
      <span>1Snap</span>
    </a>
  );
}

function ReleaseItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li>
      <strong>{label}</strong>
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
      <span className="support-mark" aria-hidden="true">
        K
      </span>
      <span>
        <strong>Support 1Snap</strong>
        <small>SupportKori</small>
      </span>
    </a>
  );
}
