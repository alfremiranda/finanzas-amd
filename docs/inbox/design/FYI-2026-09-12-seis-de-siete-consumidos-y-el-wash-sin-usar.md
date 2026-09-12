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
