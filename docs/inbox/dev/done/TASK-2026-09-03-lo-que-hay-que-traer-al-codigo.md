# TASK — lo que hay que traer al código: nav, flujos y tokens

Tres bloques, ordenados por lo que le cambia la cara a la app.

---

## 1 · El bottom nav: cápsula flotante, según la HIG

Hubo un intento anterior mío —barra plana pegada al borde, estilo iOS 18— que Alfredo revirtió.
**Si viste una versión de esta nota con esa tabla, ignórala entera.** La forma que él ya tenía
(píldora flotante) era la correcta; lo que faltaba era lo que la HIG sí especifica.

| | Antes | Ahora |
|---|---|---|
| ancho | 412, de borde a borde | **370, centrada** |
| margen | 10 a los lados, 10 abajo | **21 a los lados y abajo** |
| icono | 20 | **24** (`Icon size=L`) |
| tab activa | `sidebar/accent-foreground` → #0f172a, casi igual a las otras | **`fg/brand`**, cian 700 / 500 |
| sombra | dos sombras a ojo | **`elevation/floating`**, la del sistema |
| estados | uno | **`State=Expanded` / `State=Minimized`** |

**Cinco reglas de la HIG que se implementan mal si no se dicen:**

- **De 2 a 5 tabs, y un tab es un destino, nunca una acción.** Son cuatro. El `+` sigue en el FAB,
  encima de la barra, no dentro.
- **El color ES la selección.** No hay píldora, ni subrayado, ni fondo detrás de la tab activa.
  Por eso importaba que el color se distinguiera: antes activa e inactiva eran casi el mismo gris.
- **La banda de 21 de abajo es de la barra.** Ningún otro elemento fijo vive ahí. El contenido pasa
  por debajo de la cápsula, no se corta contra ella.
- **Se minimiza al hacer scroll.** Ya está dibujado: `bottom-nav` ahora tiene
  `State=Expanded|Minimized`. Al bajar, la barra se encoge a **58×58**, un botón redondo con el
  icono de la tab actual — se van la etiqueta y las otras tres. Vuelve a expandirse al llegar arriba
  o al tocarla; con pulsación larga y arrastre se cambia de tab sin expandir. Mismo fondo, misma
  elevación, mismos 21 de margen: es el mismo objeto encogiéndose, no otro control. En iOS es
  `tabBarMinimizeBehavior(.onScrollDown)`; en la PWA hay que hacerlo a mano con el scroll.
  Frame de referencia: `Flow - Accounts` → `Mobile · 1 · Cuentas · scrolled (nav minimizado)`.
- **Etiqueta de 10, no de 11.** Apple pide 11pt; el sistema tiene `Control/XS` a 10. Se queda en 10 y
  queda anotado — es el único punto donde la barra se aparta de la HIG a propósito.

**Token nuevo: `--fg-brand`** (cian 700 en claro, 500 en oscuro; sigue a `bg/brand`). El sistema tenía
`bg/brand` y `fg/on-brand`, pero no tenía la marca como color de texto, así que la tab activa estaba
pintando con un token del sidebar.

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
`border/on-inverse`, `progress/track`, `account-summary-card/meta-chip/border` y **`fg/brand`**.

POINTER: design-system/components/bottom-nav.html, design-system/tokens/tokens.css,
design-system/_build/token-ledger.json; Figma `76:3520`, `Flow - Accounts`, `Flow - Obligaciones`.
