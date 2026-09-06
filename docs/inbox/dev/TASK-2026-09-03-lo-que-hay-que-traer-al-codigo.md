# TASK — lo que hay que traer al código: nav, flujos y tokens

Tres bloques. El primero es nuevo, los otros dos son lo que quedó dibujado y todavía no está
implementado. Ordenados por lo que le cambia la cara a la app.

---

## 1 · El bottom nav se rediseñó — ahora es una barra iOS, no una píldora flotante

Decisión de Alfredo. Lo que había era **una píldora flotante**: `radius: 9999`, dos sombras y
márgenes laterales, o sea un control que levita sobre la página. Una tab bar no levita: **es el
borde de la pantalla**.

| | Antes | Ahora |
|---|---|---|
| forma | píldora, radius 9999, con márgenes | barra completa, radius 0, pegada a los tres bordes |
| separación | dos `DROP_SHADOW` | **filete de 1px arriba**, `--nav-border` |
| alto | 58 | **49 de contenido + 34 de home indicator** |
| tab seleccionada | píldora de fondo | **solo color** en icono y etiqueta |
| icono | 20 | **26** |
| tokens | `sidebar/*` prestados | `--nav-*` propios |

**Tres detalles que se implementan mal si no se dicen:**

- **El filete reemplaza la sombra.** Una sombra dice *flotante*; un filete dice *borde*. No pongas
  las dos.
- **Los 34px de abajo son el home indicator**, no padding. Usa
  `padding-bottom: max(34px, env(safe-area-inset-bottom))`. **No centres el contenido en el alto
  total** — va en los 49 de arriba, si no las etiquetas quedan altas en un iPhone y bajas en un
  Android.
- **No hay píldora detrás de la seleccionada.** El color es la selección. Es lo que permite meter
  cuatro tabs en 412 sin que la barra se convierta en mobiliario.

**Tokens nuevos:** `--nav-border`, `--nav-item-foreground`, `--nav-item-foreground-selected`.
Antes la barra pintaba con `sidebar/accent-foreground` y `fg/subtle` — tokens de otro componente,
así que un cambio en el sidebar habría movido la tab bar sin que ninguno de los dos lados lo viera.

**Y la navegación son cuatro:** `Resumen · Mes · Cuentas · Obligaciones`. Con Ahorros retirada y
Obligaciones como página propia, `Configuración` sale de la barra. **Confírmalo con Alfredo** — yo
lo dibujé así pero la navegación no es mía.

---

## 2 · Los flujos redibujados que faltan en código

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

## 3 · Los tokens que cambiaron

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
`border/on-inverse`, `progress/track`, `account-summary-card/meta-chip/border`, y los tres `nav/*`.

POINTER: design-system/components/bottom-nav.html, design-system/tokens/tokens.css,
design-system/_build/token-ledger.json; Figma `76:3520`, `Flow - Accounts`, `Flow - Obligaciones`.
