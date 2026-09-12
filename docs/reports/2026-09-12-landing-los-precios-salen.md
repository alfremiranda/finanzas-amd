# 2026-09-12 (2) — Inbox procesado: los precios salen del landing

Segunda corrida de Web el mismo día. Entrada: `docs/inbox/web/A-2026-09-12-las-tres-decisiones.md`
(movido a `done/` en este commit). Rol formalizado en ORCHESTRATION **v3.8**.

## LAS TRES RESPUESTAS, Y QUÉ HICE CON CADA UNA

1. **Territorio aprobado como lo propuse** — `public/index.html`, `public/landing/**`,
   `docs/inbox/web/`. La migración a `/app` se queda con Dev. Sin acción.
2. **Los precios NO se publican** *(Alfredo)*. Aplicado: fuera las tres cifras y el descuento
   fundador. Tocó cuatro sitios, no uno — la barra de anuncio («los primeros 500 conservan el precio
   de fundador»), el titular de §10, la tarjeta de precio entera, y un enlace **«Precios»** en el
   footer que ahora dice «Qué viene en Pro», porque un enlace llamado Precios hacia una sección sin
   precios es una promesa rota en dos clics. La regla `.price` quedó muerta y se borró.
   `DIRECTION §1` sigue siendo la referencia **interna**; no volvió a la página.
3. **El bloque sale visible y sin campo de correo** hasta que Legal entregue las tres piezas de
   Ley 1581. Aplicado, y **subí la frase de la lista de espera desde la letra chica hasta debajo del
   CTA**: el orquestador pidió que fuera visible, y donde la había dejado no lo era. La letra chica
   se quedó sólo con el hecho ("Pro todavía no se puede comprar y no tiene precio anunciado").

**Corrige al reporte anterior** (`2026-09-12-landing-w0-w2.md`), que decía que §10 salía con el ancla
de precio. Ya no: §10 no lleva ninguna cifra.

## FOUND

- **«Sin precio» no es borrar un número, es revisar el argumento.** El titular viejo —«precio de
  fundador para siempre»— vendía escasez. El nuevo vende lo único que hoy es verificable: que la app
  está abierta y que lo gratis se queda gratis. Un bloque de Pro sin cifra se sostiene si el
  argumento cambia con él; si sólo se le quita el número, queda una tarjeta con un hueco.
- La advertencia del orquestador está anotada: **el encargo legal lleva 44 días sin moverse.** El
  landing no depende de él — ésa era justamente la salida.

- **El cambio de precios no lo firmé yo.** A media corrida, la sesión del bridge del orquestador
  commiteó `033ab883` con `git add` sobre todo el árbol compartido y se llevó mi trabajo sin
  commitear: los precios fuera, el titular de §10, la tarjeta de precio y la regla `.price`. Quedó
  firmado por **Neto Orchestrator (bridge)** bajo *"ci(design-system): the landing check needed an
  install"*. Mi commit acabó con 6 de ~60 líneas. **Nada se perdió y el árbol está correcto** — lo
  que quedó mal es la historia: la decisión de Alfredo de no publicar precios vive en el repo dentro
  de un commit sobre instalar dependencias en CI, y `git log`/`blame`/`bisect` no la encuentran. Ya
  está en `origin`; no se reescribe. Propuesta en
  `docs/inbox/orchestrator/FYI-2026-09-12-una-decision-de-alfredo-quedo-firmada-como-un-fix-de-ci.md`:
  **un commit añade sólo las rutas de su territorio; nunca `git add -A` sobre un árbol compartido.**
  `§2` cubre el cierre y delega la concurrencia en una compuerta humana; lo que falló fue media
  sesión con dos agentes escribiendo a la vez.
- **Y dos cosas de ese mismo commit estaban bien, sin discusión:** mi step de CI estaba en el job
  `validate`, que corre sin `npm ci` a propósito, y la mitad del check lee los woff2 de
  `node_modules` — falló en su primera corrida, como debía. Y **el espejo ya se había desfasado ese
  mismo día** (`988dd447` retiró `chart-categorical/*` y `chart-sequential/*`): el check lo cazó a la
  primera oportunidad que tuvo, que es justo para lo que existe.

## VERIFICADO

`npm run build` ✓ · 145/145 tests ✓ · `validate-repo.mjs` sin fallos ✓ ·
`landing-assets --check` in sync ✓ · 0 entradas del landing en el precache ✓ ·
`grep` de las cifras: ninguna queda en la página (las de `$19.500.000` y `$5.000.000` del cuadro del
hero son el mes de ejemplo, no un precio) ✓ · §10 revisado en claro y oscuro ✓.

## NEEDS

Sin cambios respecto al reporte anterior, menos la 1, que quedó cerrada:

1. ~~Las tres decisiones del orquestador~~ — **cerradas hoy.**
2. **La migración a `/app` sigue siendo de Dev** y bloquea que el landing deje `/landing/` y su
   `noindex`. Nada más depende de ella.
3. **Las capturas de UI** de los seis bloques de funciones, vía `scripts/visual-regression.mjs`.
4. **Legal**, cuando llegue: formulario + casilla de autorización + línea en `privacidad.html`.
5. `9188d863` (del orquestador) y este commit quedan **sin empujar**: un push a `main` dispara el
   deploy y no me lo pidieron. La ruta sigue siendo Alfredo.
