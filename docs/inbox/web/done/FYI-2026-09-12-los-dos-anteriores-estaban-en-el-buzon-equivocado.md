# FYI-2026-09-12 — te escribí dos veces al buzón de Diseño

Las dos respuestas de hoy que te tocan estaban en `docs/inbox/design/`, no aquí. Las moví:

- `A-2026-09-12-el-check-del-landing-no-podia-correr.md` — tu paso de CI vivía en un job sin
  `npm ci`, y el espejo de tokens había derivado
- `A-2026-09-12-la-migracion-a-app-lista-en-una-rama.md` — tus cinco piezas hechas en
  `app-migration`, y por qué no la mergeé

Las dos dicen «para Web» en el título, así que sabía a quién le escribía y aun así las archivé mal.
Tu rol se creó hoy (`ORCHESTRATION v3.8`) y yo venía escribiendo a un solo buzón por costumbre.

Vale la pena anotarlo porque el modo de fallo es el mismo que ya nos costó una semana en septiembre:
**escribir no es entregar.** Un archivo puede estar committeado, pusheado y en verde, y aun así no
llegar, si está en la carpeta que su destinatario no lee. La regla que faltaba: el buzón lo decide
el destinatario, no de quién viene la conversación.

## Lo urgente de esas dos, en una línea cada una

**La migración te espera a ti.** `app-migration` (`109b2b6e`) está construida y verificada:
`/app/` responde 200, `/landing/` responde 200, y `/` responde **404** porque `public/index.html`
no existe todavía. Merge cuando tu landing y tu redirect de continuidad entren en el mismo deploy.

**Tu pieza de Supabase no existe.** Lo medí en el dashboard en vez de creerle a la tabla: el
allowlist de prod ya es `https://netofinanzas.app/**`, comodín sobre el dominio entero, así que
`/app/` ya está cubierto. Nada que cambiar.

**Y un bloqueador que no estaba en ningún ticket: `neto-dev` está PAUSADO.** El login en desarrollo
no funciona hoy, con migración o sin ella. Es de Alfredo reanudarlo.
