import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const siteUrl = (
  process.env.URL ??
  process.env.VITE_SITE_URL ??
  'https://1snap.netlify.app'
).replace(/\/+$/, '');

export default defineConfig({
  build: {
    rollupOptions: {
      input: ['index.html', '404.html', '500.html'],
    },
  },
  plugins: [
    react(),
    {
      name: '1snap-html-metadata',
      transformIndexHtml(html) {
        return html.replaceAll('%ONESNAP_SITE_URL%', siteUrl);
      },
    },
  ],
});
