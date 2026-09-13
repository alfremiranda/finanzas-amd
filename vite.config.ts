import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  // The SPA's entry moved to panel/index.html so `/` can be the landing page. `base` stays '/'
  // on purpose: assets keep emitting to /assets/* and resolve from either path, so nothing
  // about the bundle has to know which route served the shell.
  build: {
    rollupOptions: {
      input: 'panel/index.html',
    },
  },
  // Sentry release: the commit SHA in CI (GitHub Actions sets GITHUB_SHA), else
  // 'dev' locally. Ties every captured error to a build so minified stacks stay
  // legible until source-map upload lands (W4 D2, deferred).
  define: {
    __SENTRY_RELEASE__: JSON.stringify(process.env.GITHUB_SHA ?? 'dev'),
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' (not 'autoUpdate'): a new SW must NOT force-reload the page. The
      // autoUpdate reload was racing the OAuth callback on mobile — the reload
      // re-hit the callback, the single-use provider code got exchanged twice, and
      // login failed with "Unable to exchange external code". New versions now apply
      // on the next natural app launch instead of a surprise mid-flow reload.
      registerType: 'prompt',
      // Workbox takes over — delete manual public/sw.js
      filename: 'sw.js',
      strategies: 'generateSW',
      workbox: {
        // Cache all build assets + shell
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // The public SEO pages under /calculadoras/ are standalone static pages with
        // their own fonts — they must not enter the app's precache (they'd add weight
        // to every install and the SW has no business owning them).
        // 'landing/**' joins them: the marketing page is a standalone static page with its
        // own fonts and token mirror. Precaching it would add ~110 kB to every install for a
        // page an installed user never opens.
        // 'index.html' is the LANDING, not the app shell — the app's is panel/index.html and
        // enters the precache on its own. Without this the marketing page would be precached
        // into every install and then served by the SW to a user who asked for the app.
        globIgnores: ['calculadoras/**', 'storybook/**', 'landing/**', 'index.html'],
        // Network-first for navigation (SPA shell)
        navigateFallback: '/panel/index.html',
        // Keep the static pages out of the SPA navigation fallback — a direct
        // navigation to /privacidad.html or /calculadoras/... must serve that page,
        // not the app shell. (They must also load pre-login and without the SW.)
        // The root joins them: it is the landing page now, and the SPA fallback must not
        // shadow it. Exact on the PATH on purpose — /panel/ and everything under it still falls
        // back to the shell.
        // Workbox tests these against pathname + SEARCH, not the pathname alone, so an anchored
        // `$` must allow a query string. As `/^\/$/` it matched only a bare `/`: with the app's
        // SW installed, `/?home` (the landing's own escape hatch), `/?utm_source=…` or any shared
        // link with a query opened the app shell instead of the landing.
        navigateFallbackDenylist: [/^\/api/, /^\/(\?.*)?$/, /privacidad\.html(\?.*)?$/, /^\/calculadoras\//, /^\/storybook\//, /^\/landing\//],
        // Network-only for external APIs
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\//,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/datos\.gov\.co\//,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/open\.er-api\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'trm-cache',
              expiration: { maxAgeSeconds: 60 * 60 * 8 }, // 8h — same as useLiveTRM TTL
            },
          },
        ],
      },
      // Manifest is in public/manifest.json — don't inject a second one
      manifest: false,
      // null: we register the SW manually in main.tsx (via virtual:pwa-register) so
      // we can catch registration errors — the auto-injected registerSW.js let the
      // register() promise reject UNHANDLED during OAuth navigation (noisy Sentry).
      injectRegister: null,
      devOptions: {
        enabled: false, // only active in production build
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
