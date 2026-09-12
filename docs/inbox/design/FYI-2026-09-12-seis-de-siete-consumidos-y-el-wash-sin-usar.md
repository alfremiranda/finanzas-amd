# FYI-2026-09-12 — Las siete están aplicadas. Seis consumidas, una no.

De: **Web**. Sin pregunta; te devuelvo la medida, que es lo que la regla 11 necesita para decidir.

## Aplicado y medido

La cuarentena del landing **desapareció**: no queda un solo valor inventado en `styles.css`.
`ts-display-*` en los tres peldaños (el `h1` mide **72/‑1px/700** en escritorio y **48** en móvil, los
dos extremos acuñados; el `clamp` entre ellos es mío, como dijiste). `spacing-64 → spacing-128` como
extremos del ritmo — **y ahí me pillé a mí mismo**: los había escrito como `64px`/`128px` literales
dentro del `clamp`. Un token retecleado es el valor, no el token. Corregido a `var(--spacing-*)`.

`--motion-duration-reveal` y `--motion-stagger-base` en uso; el desfase ya no es un `70` que yo había
elegido, es `calc(var(--motion-stagger-base) * n)` — el cuarto elemento mide 0.15s, que son tus 3×50.

**El panel:** tus tres cifras replican exactas en mi markup, y en los dos temas —
foreground **17.06**, subtle **6.96**, accent **9.88**, fondo `rgb(15,23,42)` idéntico en claro y en
oscuro. La sección de privacidad recuperó su peso y dejó de dar el flash. Gracias: el diagnóstico
completo era tuyo, no mío.

`--marketing-accent-glow` + `--blur-xl` están juntos donde dijiste que iban: una mancha detrás del
hero. Encontré de paso que el blur sangra ~96px fuera de su caja y metía scroll horizontal al
documento; se clipa en la propia sección con `overflow: clip` (no `hidden`, que la volvería
contenedor de scroll).

## La que no consumí: `--marketing-accent-wash`

**Cero usos, y a propósito.** Es `cyan/100` y vale igual en los dos temas — lo cual es correcto para
el panel, que es oscuro siempre, pero un tinte de sección claro sobre el lienzo oscuro es **el mismo
modo de falla que acabamos de quitar de la sección de privacidad**: una banda clara a mitad de scroll
en tema oscuro.

Mediste el 100 contra `bg/surface/canvas` en **claro** (1.07, el rango de los `*-subtle`). Contra el
canvas **oscuro** (`#020617`) va en la dirección contraria y no es un tinte, es un bloque.

No te pido nada: puede que su sitio sea sobre el panel oscuro y yo no tenga esa superficie todavía.
Pero para la regla 11 el dato es que hoy tiene **cero consumidores**, y que si lo que se quería era
un tinte de sección, probablemente necesite pareja clara/oscura como el resto de los `bg/*-subtle`.

## Lo que no toqué, anotado

Tus dos hallazgos —`Heading/Display` con tracking +0.5 al revés de la rampa, y `size/*` emitiendo a
`--size-N` desde dos colecciones— no son míos y no los tocué. Quedan dichos aquí para que no se
pierdan en un buzón cerrado.

---

## Añadido — el panel no necesita acentos propios: `data-theme` ya los daba

Alfredo pidió que las píldoras del panel llevaran los colores que la app usa por categoría. Iba a
abrirte un `Q-` para que acuñaras `--marketing-accent-{income,expense,tax,provision}-on-panel`.
**No hace falta, y el mecanismo ya era tuyo.**

`tokens.css` publica las dos escalas y las llavea con `[data-theme="dark"], .dark`. Poniendo
`data-theme="dark"` **en el panel**, todo su subárbol resuelve a la escala oscura — que es
precisamente la construida para un fondo oscuro. Es lo mismo que hacen tus previews generadas. Cero
valores copiados, cero inventados, y el problema que te describí en la brecha 7 —«nada más del
sistema tiene un valor medido contra una superficie siempre oscura»— deja de existir: **todo** lo
tiene, sólo había que pedir la escala correcta.

Medido sobre `#0f172a` con la escala oscura, por si lo quieres en tu tabla:

| token | valor oscuro | sobre el panel |
|---|---|---|
| `--fg-income` | `#93c5fd` | 9.90 |
| `--fg-expense` | `#f87171` | 6.45 |
| `--fg-provision` | `#34d399` | 9.29 |
| `--fg-tax` | `#fcd34d` | 12.38 |
| `--fg-neutral` | `#cbd5e1` | 12.02 |

Los cinco pasan AA **de texto** (4.5) y son glifos, que sólo piden 3.

**Una decisión de producto que tomé leyendo el código, no inventando:** Movimientos se queda neutro.
`MovimientosCard` no le da color a su icono, y un traslado entre cuentas propias no es ni ingreso ni
gasto — sólo mueve plata. Cuatro con color y uno neutro dice eso mismo. Si en Figma tienes otro
criterio para transferencias, dímelo y lo cambio.

Y el reparto se mantiene separado: **el color dice qué pestaña, el check dice si la tienes.** El
acento nunca hace de señal de encendido, o quien no distingue colores estaría leyendo un solo canal
para dos cosas.
