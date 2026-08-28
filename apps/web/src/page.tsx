import { ArrowIcon, CheckIcon, CopyIcon, DownloadIcon } from './icons';

const captureSteps = [
  {
    title: 'Click 1Snap.',
    text: 'Start from the toolbar. 1Snap measures the page before it moves a pixel.',
  },
  {
    title: 'Let the page pass through.',
    text: 'The active tab scrolls in measured frames, then returns to the position where you left it.',
  },
  {
    title: 'Use the finished PNG.',
    text: 'The proof opens in its own tab, ready to inspect, copy, or download.',
  },
];

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero page-shell">
          <div className="hero-copy">
            <h1>
              A full page.
              <span>One clean shot.</span>
            </h1>
            <p>
              Capture the entire page in one deliberate click. 1Snap stitches it locally, then opens
              a measured PNG proof you can inspect, copy, or download.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#install">
                Install 1Snap <ArrowIcon />
              </a>
              <a className="button button-secondary" href="#how-it-works">
                See the capture path
              </a>
            </div>
            <ul className="truth-line" aria-label="Product facts">
              <li>No account</li>
              <li>No upload</li>
              <li>Chrome 120+</li>
            </ul>
          </div>
          <CaptureRig />
        </section>

        <section className="fact-band" aria-label="1Snap boundaries">
          <div className="page-shell fact-band-inner">
            <p>One toolbar action</p>
            <p>Local PNG assembly</p>
            <p>Inspect · Copy · Download</p>
          </div>
        </section>

        <section id="how-it-works" className="workflow page-shell">
          <div className="section-heading">
            <h2>The page moves. Your workflow doesn’t.</h2>
            <p>
              1Snap handles the long part, restores the page, and leaves you with one ordinary image
              file.
            </p>
          </div>
          <ol className="workflow-list">
            {captureSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="result" className="result-demo-section">
          <div className="page-shell result-demo-grid">
            <div className="result-copy">
              <h2>The screenshot is the workspace.</h2>
              <p>
                No editor to dismiss. No project to name. The finished image stays at the center,
                with only the measurements and actions you need around it.
              </p>
              <ul>
                <li>
                  <CheckIcon /> Real output dimensions
                </li>
                <li>
                  <CheckIcon /> Real file size and frame count
                </li>
                <li>
                  <CheckIcon /> Actual source and capture time
                </li>
              </ul>
            </div>
            <ResultMiniature />
          </div>
        </section>

        <section id="privacy" className="privacy-section">
          <div className="page-shell privacy-grid">
            <h2>Nothing leaves the browser.</h2>
            <div>
              <p className="privacy-lead">
                1Snap needs the active page long enough to capture it. The frames are stitched into
                a PNG inside the extension and stored locally for the result tab.
              </p>
              <dl>
                <div>
                  <dt>Accounts</dt>
                  <dd>None.</dd>
                </div>
                <div>
                  <dt>Uploads</dt>
                  <dd>None.</dd>
                </div>
                <div>
                  <dt>Analytics</dt>
                  <dd>None.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="install" className="install-section page-shell">
          <div className="install-copy">
            <h2>Load it once. Keep the full page.</h2>
            <p>
              1Snap is ready to run locally as an unpacked Chrome extension while the store listing
              is prepared.
            </p>
          </div>
          <ol className="install-list">
            <li>
              <span>01</span>
              <div>
                <strong>Build the extension</strong>
                <code>pnpm build:extension</code>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Open Chrome extensions</strong>
                <code>chrome://extensions</code>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Load the unpacked build</strong>
                <code>apps/extension/.output</code>
              </div>
            </li>
          </ol>
        </section>
      </main>
      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <Brand />
          <p>A focused full-page screenshot tool for Chrome.</p>
          <a href="#top">Back to top</a>
        </div>
      </footer>
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
          Get 1Snap
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

function CaptureRig() {
  return (
    <div className="capture-rig" aria-label="1Snap measuring and capturing a complete page">
      <div className="rig-readout">
        <span>
          <i /> Capturing
        </span>
        <span>06 / 08 frames</span>
      </div>
      <div className="rig-body">
        <div className="rig-ruler" aria-hidden="true">
          <span style={{ top: '0%' }}>0</span>
          <span style={{ top: '20%' }}>1,000</span>
          <span style={{ top: '40%' }}>2,000</span>
          <span style={{ top: '60%' }}>3,000</span>
          <span style={{ top: '80%' }}>4,000</span>
        </div>
        <div className="page-specimen">
          <span className="registration registration-a" />
          <span className="registration registration-b" />
          <div className="specimen-nav">
            <b>FIELDWORK</b>
            <span>Stories&nbsp;&nbsp;Places&nbsp;&nbsp;About</span>
          </div>
          <div className="specimen-hero">
            <p>Independent field journal</p>
            <h2>Notes from a city built around water.</h2>
            <div className="specimen-image">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="specimen-story">
            <strong>The long way through</strong>
            <p>A measured walk from the old ferry steps to the eastern workshops.</p>
          </div>
          <div className="specimen-columns">
            <div>
              <span>Architecture</span>
              <b>Shadows at noon</b>
            </div>
            <div>
              <span>People</span>
              <b>Working the river edge</b>
            </div>
          </div>
          <div className="specimen-footer">Field notes · Issue 08</div>
        </div>
        <div className="frame-stack" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((frame) => (
            <i key={frame} className={frame < 6 ? 'is-done' : ''} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultMiniature() {
  return (
    <div className="result-miniature" aria-label="1Snap result page preview">
      <div className="mini-header">
        <b>1Snap</b>
        <span>
          <i /> Capture ready
        </span>
        <div>
          <CopyIcon />
          <DownloadIcon />
        </div>
      </div>
      <div className="mini-stage">
        <div className="mini-ruler">
          <span>0</span>
          <span>2,000</span>
          <span>4,000</span>
        </div>
        <div className="mini-proof">
          <span className="registration registration-a" />
          <span className="registration registration-b" />
          <div className="mini-proof-nav" />
          <h3>A complete page, ready to keep.</h3>
          <div className="mini-proof-block" />
          <div className="mini-proof-lines" />
          <div className="mini-proof-block small" />
          <div className="mini-proof-lines short" />
        </div>
      </div>
      <div className="mini-meta">
        <span>8 frames stitched</span>
        <span>1440 × 8660</span>
        <span>PNG</span>
        <span>12.4 MB</span>
      </div>
    </div>
  );
}
