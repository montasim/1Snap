import { createRoot } from 'react-dom/client';
import { ErrorPage, SiteErrorBoundary } from './error-page';
import { LandingPage } from './landing-page';
import './landing.css';

const root = document.getElementById('root');
if (!root) throw new Error('1Snap could not mount the website.');

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const isLandingPage = path === '/' || path === '/index.html';
const isServerError = path === '/500' || path === '/500.html';
const status = isServerError ? 500 : 404;

if (!isLandingPage) {
  document.title = status === 500 ? 'Something went wrong · 1Snap' : 'Page not found · 1Snap';
}

createRoot(root).render(
  isLandingPage ? (
    <SiteErrorBoundary>
      <LandingPage />
    </SiteErrorBoundary>
  ) : (
    <ErrorPage status={status} />
  ),
);
