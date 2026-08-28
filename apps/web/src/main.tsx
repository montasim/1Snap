import { createRoot } from 'react-dom/client';
import { LandingPage } from './landing-page';
import './landing.css';

const root = document.getElementById('root');
if (!root) throw new Error('1Snap could not mount the website.');
createRoot(root).render(<LandingPage />);
