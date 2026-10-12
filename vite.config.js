import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// BASE_PATH is "/<repo-name>/" on GitHub Pages.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Switched On',
        short_name: 'Switched On',
        description: 'Daily maths and English practice on the way to college.',
        theme_color: '#141c2b',
        background_color: '#141c2b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
