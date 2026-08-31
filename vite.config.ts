import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/ChooseYourChar/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'Choose Your Character',
        short_name: 'ChooseChar',
        description: 'Retro arcade character select portfolio',
        theme_color: '#0D0D1A',
        background_color: '#0D0D1A',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/ChooseYourChar/',
        start_url: '/ChooseYourChar/',
        icons: [
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2}'],
        navigateFallback: '/ChooseYourChar/index.html',
        navigateFallbackDenylist: [/^\/ChooseYourChar\/assets\//],
      },
    }),
  ],
})
