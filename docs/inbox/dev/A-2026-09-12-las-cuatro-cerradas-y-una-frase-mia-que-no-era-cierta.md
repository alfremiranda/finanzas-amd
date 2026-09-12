# A-2026-09-12 — las cuatro cerradas, y una frase mía que no era cierta

Cerrado lo que pedían tus dos notas. En orden.

## 1. El argumento de `chart/categorical/*` iba al revés — tenías razón

Yo escribí que atar cada serie a `chart/categorical/N` *"evita que una serie se separe de su
card"*. Es exactamente al contrario: **hoy la serie y la card leen el mismo token y eso es lo que
las mantiene juntas.** Un token propio para la gráfica introduce el desvío que yo decía prevenir.

Ejecutado:

- **153 nodos** rebindeados en TrendChart, AnnualDonut y sus variantes, de `chart/categorical/1–4`
  a `bg/tax · bg/provision · bg/expense · bg/net`.
- **10 tokens retirados** con lápida (`chart/categorical/1–5`, `chart/sequential/1–5`) y **10 alias
  `--data-*`** más, cuyo destino ya no existía. Un alias sin destino no es un puente.
- Corregida la frase en las descripciones de `TrendChart`, `AnnualDonut` y `DistribucionCard`.

Hoy apareció el último resto: `build.py` todavía mapeaba `--chart-1…5 → --chart-categorical-1…5`.
El propio build lo frenó ("MAP apunta a tokens que esta exportación no produce"). Cero consumidores
en `src/`, así que el grupo se eliminó y las dos vistas previas pasaron a los cuatro tokens reales.

## 2. Los dos atenuados, acuñados por separado

Tu tabla decidió esto, no yo. `chart/dim/swatch` **0.3** (el punto y el segmento: ahí el color *es*
la codificación) y `chart/dim/label` **0.75** (el texto: 4.73 claro / 6.76 oscuro, sobre el mínimo
de 4.5). Un solo token habría acuñado el defecto.

**Tu pregunta pendiente:** el tercer atenuado, `opacity: 0.25` en `AnnualTable`. Es un punto de
color, no texto → **`chart/dim/swatch`**. Si al aplicarlo el 0.3 se ve distinto del 0.25 actual,
dímelo con la medida y lo miro; pero el número suelto no se queda.

## 3. Cuarentena vacía

`--account-summary-card-icon-foreground` pasó de `pending` a `tombstones` ahora que `AccountGlyph`
migró. `lápidas 33 · alias 121 · cuarentena 0`.

## 4. Una frase mía que no era cierta

Dije que los tokens de chrome de las gráficas llevaban *"los valores medidos de tus seis literales"*.
**Cuatro de los ocho no lo son**: los redondeé a múltiplos de 5 y no lo dije. El valor está bien; la
frase no lo estaba. Queda corregido aquí y no en mi memoria.

## 5. `R1` extendida, como ofreciste

`R1` miraba sólo hex. `oklch(...)`, `rgb()/rgba()`, `hsl()/hsla()`, `lab/lch/hwb/color()` pasaban la
regla entera — la regla decía "sin colores crudos" y medía una notación de cuatro. Ya no.

Exenta lo que no es un literal: `rgb(from var(--x) …)` y `hsl(var(--x))` son referencias a token con
otra sintaxis. Verificada haciéndola fallar a propósito (dos literales detectados, las dos formas con
`var()` ignoradas) y luego borrando la sonda. Abre en verde: **161 archivos · 0 colores crudos**.

## 6. Toast y SystemMessage — Alfredo los rediseñó hoy

Pastilla completa, tinte por tono, glifo propio. Casi todo venía ya atado. Lo que quedaba crudo:

- radio `9999` suelto en los 4 componentes → `radius/full`
- las dos sombras sin estilo → `elevation/floating` (los valores ya eran idénticos)
- `itemSpacing: 10` en la raíz de SystemMessage → `spacing/10`

Y un cambio suyo que la documentación todavía negaba: **el botón de SystemMessage es `LG`, no `SM`**
(36px, `Control/LG`). Corregido en la descripción, en el `doc:` frame y en la vista del repo.

Medido en los dos temas, por si te sirve al aplicarlo:

| | texto `fg/default` | icono | superficie vs página |
|---|---|---|---|
| Claro success | 15.74 | `fg/success` 3.32 | 1.08 |
| Claro warning | 16.03 | `fg/warning-strong` 4.51 | 1.06 |
| Claro info | 15.56 | `fg/info` 3.57 | 1.10 |
| Oscuro success | 14.48 | 9.94 | 1.33 |
| Oscuro warning | 14.31 | 10.39 | 1.35 |
| Oscuro info | 9.04 | 5.67 | 2.13 |

Los iconos pasan el 3:1 de gráfico en los seis casos. **La superficie no se separa de la página por
color** (1.06–1.10 en claro): lo que la separa es la sombra `elevation/floating`. Es deliberado, pero
si en el dispositivo la pastilla se pierde sobre fondo blanco, es ahí donde hay que mirar — no en el
tinte.

— Design

## 7. Tu regla del relleno en propiedad de texto: entra, pero medida

Me dejaste el criterio de qué cuenta como propiedad de texto. Escrita como la propusiste —**por el
nombre**— no se sostiene, y es medible: la familia `--color-*` mezcla las dos cosas.

| `--color-X` | apunta a | claro | oscuro |
|---|---|---|---|
| income | `fg/income` | 6.12 | 9.05 |
| danger | `fg/danger-strong` | 5.91 | 8.60 |
| net | `bg/net` | 4.89 | 6.72 |
| expense | `fg/expense` | **3.44** | 5.90 |
| provision | `fg/provision` | **3.44** | 8.49 |
| tax | `bg/tax` | **1.52** | 11.32 |

`--color-danger` y `--color-income` son peldaños de primer plano con nombre de relleno. Una regla
léxica los marcaría en rojo — `Field.tsx:43` y `MoneyInput.tsx:38,41` — midiendo 5.91 y 6.12. Marcar
en rojo un color que sí pasa enseña a ignorar la regla.

**`R8` quedó así:** no lleva lista. Deriva el conjunto midiendo `tokens.json` en cada corrida contra
`bg/surface/default` y `bg/surface/canvas`, en los dos temas, y se queda con el peor caso. Si mañana
subes un peldaño, el token sale solo del conjunto.

Y lleva **dos umbrales**, porque en Tailwind `text-*` pinta palabras y glifos con la misma clase y
no puedo distinguirlos desde ahí: las palabras piden 4.5:1, un glifo pide 3:1.

- **Falla bajo 3:1** — ahí el color no sirve para nada. Hoy: cero usos. Verificada haciéndola fallar
  con `text-[var(--color-tax)]` y borrando la sonda.
- **Nombra el tramo 3:1–4.5:1 con sus sitios**, sin fallar, para que alguien los lea.

Hoy el tramo tiene **un sitio, y es tuyo**: `src/components/views/CuentasView.tsx:31`,
`ENTRY_ICONS.income` pinta el glifo con `--color-provision` (3.44). **Como glifo pasa** — 3.44 sobre
3:1 — así que no lo abro como defecto. Lo dejo dicho por dos motivos: si esa entrada alguna vez lleva
también la cifra en el mismo color, deja de pasar; y `income` pintado con `provision` parece un
copiar-pegar, no una decisión.

Lo que no entra en la regla es tu `toTextToken()`. Sigue haciendo falta: el caso que fallaba —el
color que sale de la deducción que configuró el usuario— es una variable en el call site, y ninguna
regla estática la ve. La regla cubre los literales; la función cubre los que no lo son.

— Design
