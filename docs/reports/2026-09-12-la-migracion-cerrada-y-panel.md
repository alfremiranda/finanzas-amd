# 2026-09-12 (4) — La migración cerrada, y la app vive en `/panel/`

Cuarta corrida de Web. Entrada: tres mensajes en `docs/inbox/web/` (todos a `done/` en el commit
`bb1a81e4`).

## HECHO

- **`app-migration` mergeada con mi mitad encima.** Dev la había dejado sin mergear a propósito y
  tenía razón: `/` daba 404 y toda PWA instalada apunta ahí. Las dos mitades viajan en un deploy.
- **`public/index.html` es el landing**, `noindex` fuera, y el **redirect de continuidad activo**:
  `standalone` o `localStorage['amd-finance']` → `/panel/`. Lee datos locales y no el estado de
  sesión a propósito — consultar la sesión exigiría cargar el cliente de Supabase, y esta página no
  carga bundle.
- **La ruta cambió de `/app/` a `/panel/`** (Alfredo, hoy). Toqué `vite.config.ts`,
  `manifest.json`, `src/lib/supabase.ts`, `app/index.html` → `panel/index.html` y `PRODUCT.md §3`.

## FOUND

1. **`netofinanzas.app/app/` se lee «app punto app barra app».** Lo vio Alfredo, no yo: yo había
   heredado `/app/` de mi propio ticket y Dev lo construyó tal cual, sin que ninguno de los dos
   leyera la URL completa en voz alta. El dominio es `.app`.
2. **Y esa URL es prácticamente permanente.** Una PWA graba `start_url` en el dispositivo al
   instalar, así que cambiarla después deja colgado a quien ya instaló. Hoy son dos testers: es lo
   más barato que va a estar esa decisión. Por eso se cambió ahora y no «cuando molestara».
3. **Dos mensajes que me tocaban estaban en el buzón de Diseño** (el orquestador lo reportó y los
   movió). Mismo modo de falla que nos costó una semana en septiembre: **escribir no es entregar.**
   Un archivo puede estar committeado, pusheado y en verde y aun así no llegar, si está en la
   carpeta que su destinatario no lee.

## VERIFICADO — sobre `dist` servido, no sobre el código

`/` → 200 sirve el landing · `/panel/` → 200 sirve la app con `noindex` · `/calculadoras/…` → 200 ·
`/landing/*` → 200 · `/app/` → 404 · manifest `start_url`/`scope` en `/panel/` · los seis CTAs del
landing en `/panel/` · precache: `index.html` **0**, `panel/index.html` **1**, `landing/*` **0** ·
`navigateFallback` `/panel/index.html` y `/^\/$/` en el denylist.
**El redirect ejercitado, no leído:** con `amd-finance` en localStorage, `/` aterriza en `/panel/`.
`npm run build` ✓ · 145/145 ✓ · validador sin fallos ✓ · espejo in sync ✓.

## NEEDS

1. **El `DONE WHEN` sigue abierto y no lo puedo cerrar yo: login OAuth fresco en prod, en móvil,
   Safari y Chrome, pestaña y PWA instalada, GitHub y Google.** Sólo existe después del deploy y con
   un teléfono en la mano. Es *la* prueba: la regresión de W4 fue exactamente una recarga pisando el
   callback y sólo apareció en móvil.
2. **`neto-dev` está PAUSADO** — el login de desarrollo no funciona hoy, con migración o sin ella.
   Es de Alfredo reanudarlo.
3. El allowlist de Supabase en prod es comodín sobre el dominio (medido por el orquestador, no por
   mí), así que `/panel/` queda cubierto sin tocar nada. **Conviene confirmarlo antes del deploy**,
   porque un desfase ahí rompe el callback sin producir ningún error en este código.
4. Sin empujar: seis commits. Un push dispara el deploy y no me lo han pedido.
5. Pendientes de contenido: la foto del cierre (prompt en `docs/landing-images.md`) y las capturas
   reales de los seis bloques de funciones, vía `scripts/visual-regression.mjs`.
