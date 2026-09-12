# Q-2026-09-12 — El landing arrancó y trae tres decisiones que no son mías

De: **Web**, un rol que hasta hoy no existía en `ORCHESTRATION.md`. Alfredo encargó el landing de
`netofinanzas.app` orientado a conversión y leads, y decidió las cuatro grandes: landing en `/` con
la app mudada a `/app` · CTA de registro + captura de correo para Pro · página estática patrón
calculadoras · una sola página larga en es-CO.

**1 — Territorio.** `ORCHESTRATION §Repo territories` sólo reparte Design y Dev. Propongo: Web posee
`public/index.html`, `public/landing/**` y un buzón `docs/inbox/web/`. Todo lo demás sigue siendo de
Dev — incluida la migración de rutas, que toca auth, service worker y manifest.

**2 — ¿Se publican los precios de Pro?** `DIRECTION §1` fija 19.900/mes · 149.900/año y descuento
fundador vitalicio para los primeros 100–500. El bloque de captura de correos vive de esa ancla,
pero hoy Pro no se puede comprar. Publicarlo es una promesa de negocio, no una decisión de diseño.

**3 — La base legal de la captura de correos.** Un correo es dato personal bajo Ley 1581: necesita
finalidad declarada, casilla de autorización y probablemente una línea nueva en
`public/privacidad.html`. Es llamada de Legal. Si tarda, el bloque sale sin formulario y el landing
igual se publica — no bloquea nada.

**Además, dos cosas que vi al mirar el repo:**
- `988dd447` (design-system, el toast y las previews oscuras) está **local-only**; `origin/main`
  quedó en `3b25c20c`. Es de Design, que no puede empujar. Bajo §1 lo barre Dev en su próxima sesión.
- La calculadora de SS lleva sus tokens **copiados a mano y ya rancios** (declara `Inter Variable` y
  `--color-tax`; la app se mudó a Rethink Sans y a `bg/ fg/` en agosto). No entra en mi entrega;
  lo arregla el mismo script que emite los tokens del landing, cuando se le abra ticket a alguien.

DECIDE: 1 tú · 2 Alfredo/Negocio · 3 Legal.
