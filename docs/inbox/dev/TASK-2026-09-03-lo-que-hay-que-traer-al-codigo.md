# TASK — lo que hay que traer al código: flujos y tokens

Dos bloques: lo que quedó dibujado en Figma y todavía no está implementado, y los tokens que se
movieron.

**El bottom nav no cambia.** Hubo un rediseño tipo iOS en esta rama; Alfredo lo revirtió, así que
la barra sigue siendo la píldora flotante de siempre —`radius 9999`, dos sombras, márgenes
laterales, 412×58, icono de 20— y no hay nada que hacer ahí. Si viste una versión anterior de esta
nota con una tabla de "antes / ahora", ignórala.

---

## 1 · Los flujos redibujados que faltan en código

### Cuentas — dos pantallas (`Flow - Accounts`)

Ya te lo confirmé en `TASK-2026-09-02-el-flujo-de-cuentas-confirmado`. Sigue pendiente:
el índice **pierde** resumen y ledger; el detalle abre con `breadcrumb`. Los siete casos límite
están dibujados, incluido **`un solo día`** — hay filas y no hay gráfica, porque la gráfica exige
dos días distintos. Sin ese frame, "hay movimientos" y "hay gráfica" se implementan como la misma
condición.

Dos cambios menores que salieron de dibujarlo: **la grilla envuelve** (estaba recortando la
séptima cuenta) y **en el índice no hay tarjeta seleccionada** — es un selector del que te vas.

### Obligaciones — la jerarquía (`Flow - Obligaciones`)

Detalle completo en `TASK-2026-09-03-obligaciones-la-jerarquia`. En corto: una franja de estado
arriba con **dos** cifras que no se suman, `ss-month-row` con **una** cifra por fila cuyo color es
el estado, y retención sin la línea duplicada.

`SectionCard` ya tiene `Content` como slot — antes no había por dónde componer una lista dentro.

---

## 2 · Los tokens que cambiaron

Todos están en `tokens.css` y firmados en `token-ledger.json`. **Nada exige refactor**: los
valores se mueven solos. Lo que sí conviene revisar es dónde tu código pinta a mano lo que ahora
tiene token.

**El peldaño de los neutros** — cinco tokens valían `#f1f5f9`, igual que la card, así que eran
invisibles: `bg/hover`, `bg/disabled`, `bg/neutral-subtle`, `bg/account`, `category/other/surface`.
Ahora slate/200. **Devuelve el skeleton a `bg/disabled`** y quita el filete interino del `Progress`.

**Cinco rampas semánticas** (`c25a821a`):
`bg/active` a slate/300 para que hover y active se distingan · `fg/placeholder` y `fg/disabled`
intercambian escalón — el placeholder ahora se lee (4.71:1) · `bg/selected` pasa a tinte de marca ·
la escalera de peligro corre en la misma dirección en los dos temas · **`border/subtle` se llamó
`border/emphasis`** (alias en el ledger; migra el único consumidor cuando pases).

**Tokens nuevos por componente:** `readout/swatch/*` (7), `fg/on-inverse-subtle`,
`border/on-inverse`, `progress/track` y `account-summary-card/meta-chip/border`.

POINTER: design-system/tokens/tokens.css,
design-system/_build/token-ledger.json; Figma `Flow - Accounts`, `Flow - Obligaciones`.
