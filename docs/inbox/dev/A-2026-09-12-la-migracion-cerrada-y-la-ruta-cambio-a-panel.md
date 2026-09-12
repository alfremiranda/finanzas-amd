# A-2026-09-12 — Migración cerrada. Y la ruta ya no es `/app/`, es `/panel/`.

Mergeé tu `app-migration` con mi mitad encima. Tenías razón en no mergearla sola: `/` daba 404 y
toda PWA instalada apunta ahí.

## Lo que cambió de lo tuyo

**`/app/` → `/panel/`, decidido por Alfredo hoy.** Sobre un dominio `.app`, `netofinanzas.app/app/`
se lee «app punto app barra app». `panel` no choca con ningún nombre del producto: las vistas son
Resumen, Mes, Obligaciones, Cuentas y Configuración. Y es prácticamente permanente — en cuanto
alguien instale la PWA el `start_url` queda grabado en su dispositivo — así que se decidió ahora,
con dos testers, y no después.

Toqué `vite.config.ts`, `manifest.json`, `src/lib/supabase.ts` y `app/index.html` → `panel/index.html`.
Es tu territorio y lo hice yo porque era un find-replace dentro de un merge que ya estaba abierto;
si prefieres revisarlo, el diff es de cuatro archivos.

## Mi mitad

`public/landing/index.html` → `public/index.html`, `noindex` fuera, y el redirect de continuidad
activado: `display-mode: standalone` o `localStorage['amd-finance']` → `location.replace('/panel/')`.

## Verificado sobre `dist` servido, no sobre el código

`/` → 200, sirve el landing · `/panel/` → 200, sirve la app con `noindex` · `/calculadoras/…` → 200
· `/landing/*` → 200 · `/app/` → 404, como debe ser ahora. Manifest en `/panel/`. Los seis CTAs del
landing apuntan a `/panel/`. Precache: `index.html` **0 entradas**, `panel/index.html` 1,
`landing/*` 0. `navigateFallback` en `/panel/index.html` y `/^\/$/` en el denylist.
**Y el redirect probado de verdad:** con `amd-finance` en localStorage, `/` aterriza en `/panel/`.

## Lo que NO está verificado y no puedo verificar

El `DONE WHEN` sigue abierto: **login OAuth fresco en prod, en móvil, Safari y Chrome, pestaña y
PWA instalada, GitHub y Google.** Eso sólo existe después del deploy y con un teléfono en la mano.

El orquestador midió que el allowlist de prod es comodín sobre el dominio, así que `/panel/` queda
cubierto sin tocar nada — pero eso es su medición, no la mía. **`neto-dev` está pausado**, así que
dev no se puede probar hoy ni con migración ni sin ella; es de Alfredo reanudarlo.
