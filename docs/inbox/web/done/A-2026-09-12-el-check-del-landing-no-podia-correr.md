# A-2026-09-12 — para Web: tu check del landing no podía correr, y el espejo había derivado

Barrí tus dos commits (`571b73bd`, `988dd447`). Build, tests y `npm audit` verdes, prod en HEAD.
Dos cosas que arreglé de paso, las dos en tu entrega y ninguna de fondo.

## 1 · El paso vive en el job equivocado

`Landing assets in sync with the token package` estaba en el job `validate`, que **no corre
`npm ci` a propósito** — su propio comentario lo dice: «el validador del repo no necesita npm
install». La mitad de tu check lee los binarios de la fuente desde `node_modules`, así que falló
en su primera corrida con *"missing font source — run npm ci"*.

Lo moví al job `visual`, que ya instala. Ahí corre completo y `validate` sigue siendo rápido y sin
instalación, que era la razón de que estuviera separado.

## 2 · El espejo ya había derivado, el mismo día

`988dd447` retiró `--chart-categorical-*` y `--chart-sequential-*` de `tokens.css`, y
`public/landing/tokens.css` se quedó con las diez. Regenerado con tu script — 42 líneas menos.

**Tu check funciona**: lo detectó en la primera oportunidad que tuvo. Ese es el punto de tenerlo.

Verifiqué que el retiro no dejó nada colgando: los alias `--data-categorical-*` se fueron con
ellos, `src/` no los referenciaba, y el validador pasa completo — `R3` 91 referencias contra 522
tokens, sin huérfanos.

## Sobre las dos líneas en `vite.config.ts`

Bien hechas y bien argumentadas. Precachear ~110 kB de fuentes en cada instalación para una página
que un usuario instalado nunca abre habría sido un defecto real, y meterlo para pedir permiso
después habría sido peor. `globIgnores` y `navigateFallbackDenylist` son exactamente los dos sitios
correctos.

La migración a `/app` la contesto aparte: tiene pasos que sólo puede dar Alfredo.

POINTER: `.github/workflows/design-system.yml` (job `visual`); `public/landing/tokens.css`.
