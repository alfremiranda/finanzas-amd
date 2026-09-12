# Q-2026-09-12 — La app se muda a `/app` para que `/` sea el landing

De: **Web** (rol nuevo). Va como `Q-` y no como `TASK-` a propósito: `TASK-` es del orquestador
(`docs/inbox/README.md`). Le pedí que lo formalice si prefiere —
`docs/inbox/orchestrator/Q-2026-09-12-el-landing-necesita-tres-decisiones.md`.

DECIDIDO POR ALFREDO (hoy): el landing vive en `/`, la app pasa a `/app`. El landing es mío; **esta
migración es tuya** — toca auth, service worker, manifest y el panel de Supabase.

VA PRIMERO Y VA SOLA. Por `NORTH_STAR §0.3`, se despliega con un `/` placeholder y se verifica antes
de que haya una línea de contenido encima. Siete piezas:

| Pieza | Cambio |
|---|---|
| Entrada SPA | `index.html` → `app/index.html`, vía `rollupOptions.input`. `base` se queda en `/` para que `/assets/*` resuelva desde ambas rutas |
| Landing | `public/index.html` (mío). Vite copia `publicDir` a la raíz de `dist/`; no colisiona porque la SPA emite en `dist/app/` |
| SW | `navigateFallback: '/app/index.html'`; `/^\/$/` y `/^\/landing\//` al denylist; `landing/**` e `index.html` a `globIgnores` |
| PWA | `manifest.json`: `start_url` y `scope` → `/app/` |
| OAuth | `authStore.ts` `redirectTo` → `/app/`. Las Redirect URLs de Supabase dev y prod **las cambia Alfredo**, no están en el repo |
| Continuidad | Yo pongo el redirect en el landing: `standalone` o `localStorage['amd-finance']` → `location.replace('/app/')`. Cubre las PWA ya instaladas, que apuntan a `/` |
| SEO | `sitemap.xml`: `/` pasa a ser el landing; `/app/` con `noindex` |

DONE WHEN: **login OAuth fresco en prod, en móvil, Safari y Chrome, pestaña y PWA instalada, GitHub
y Google.** No es celo: la regresión de W4 fue exactamente esto —una recarga que pisó el callback— y
sólo apareció en móvil, porque en escritorio el SW ya estaba asentado (`NORTH_STAR §2`).

DIME el orden que prefieras; si quieres que el placeholder de `/` lo ponga yo antes, lo tengo listo.

---

**YA APLICADO POR MÍ, no lo dupliques:** `vite.config.ts` lleva `landing/**` en `globIgnores` y
`/^\/landing\//` en `navigateFallbackDenylist`. Toqué tu territorio en dos líneas a propósito: el
landing se está construyendo en `public/landing/` y `globPatterns` lo habría metido al precache de
**cada instalación** (~110 kB de fuentes y tokens que un usuario instalado nunca abre). Meter el
defecto y anotarlo me pareció peor que pedir permiso. El resto de la tabla sigue siendo tuyo.
