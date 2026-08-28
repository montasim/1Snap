import { defineConfig } from 'wxt';

export default defineConfig({
  outDirTemplate: '.',
  zip: {
    name: '1snap',
  },
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '1Snap',
    short_name: '1Snap',
    description: 'Capture a complete web page and turn it into one locally stitched PNG.',
    homepage_url: 'https://1snap.netlify.app',
    minimum_chrome_version: '120',
    permissions: ['activeTab', 'clipboardWrite', 'scripting', 'unlimitedStorage'],
    action: {
      default_title: 'Capture full page with 1Snap',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png',
      },
    },
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png',
    },
  },
});
