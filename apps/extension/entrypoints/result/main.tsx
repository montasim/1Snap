import { createRoot } from 'react-dom/client';
import { ResultApp } from '../../src/ui/result/result-app';
import '../../src/ui/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('1Snap could not mount the result page.');
createRoot(root).render(<ResultApp />);
