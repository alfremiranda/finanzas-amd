# 2026-09-11 — El encabezado de la cuenta, las tres anuales, y un atenuado que nadie podía leer

Commits: `89c02feb`, `aa952a75`, `6a39e5ca`, `df6d4fbc`, `69a698c6`, `d92f4c02`, `c56d45ef`,
`92c7723c`, `c0e73011`, `b291afd4`, `733554b9`.

## DID

Cinco TASK de Diseño cerrados y la bandeja en cero. El encabezado de la cuenta contra Figma. Las
tres gráficas anuales: tokens de cromo, meses vacíos, promedio, eje, y el redondeo que Alfredo
cambió. `PRODUCT.md` deja de declarar una vista retirada. Y el atenuado de las barras de
distribución, que fallaba contraste en los dos modos.

## DECISIONS

**El nombre de la cuenta es el título de su página**, no una línea más de la card: sube a
`Heading/Subsection`. Y lo que el encabezado suelta de la grilla es **el disco, no el matiz** — el
glifo conserva `account/<hue>/accent`, porque un encabezado de color fijo hace que dos cuentas
distintas se vean iguales.

**El atenuado son dos valores, no uno.** Diseño preguntó si acuñar 30 o 40; la respuesta es
ninguno. En los dos componentes la opacidad caía sobre la fila entera, texto incluido: `fg/subtle`
sobre `bg/surface-default` mide **1.69:1 a 30% y 2.07:1 a 40%**, contra 4.5. El punto y el segmento
se quedan en 30 —ahí el color *es* la codificación—; la etiqueta y la cifra van a 75, que mide 4.73
y 6.76. En `src/lib/dim.ts` como literales hasta que Diseño acuñe el par.

**El promedio conserva otra base que las barras.** Al hacer que los meses vacíos se dibujen, la
misma variable servía para dos preguntas distintas. El promedio sigue siendo el de los meses **con
datos**: dividir entre doce haría que un año a medio usar reportara un gasto que nunca tuvo.

**La unidad abreviada se elige contra la cifra ya redondeada.** 999.999 imprime `$1,00 m` y no
`$1.000,00 k`. Y la abreviación **no** se extiende a los ejes: un eje es una escala contra la que
lees, la del centro es la cifra que lees.

**Dos cosas de Diseño las devolví en vez de aplicarlas.** El cambio de las series a
`chart/categorical/*` venía justificado como que «impide que una serie se separe de su card», y
hace lo contrario: hoy leen el mismo token, que es lo que las mantiene juntas. Verifiqué los ocho
valores, coinciden exactos, así que no mueve un pixel hoy — lo que cambia es a qué queda atado
mañana.

## FOUND

**`Label/Base` medía 14 en Figma y 12 en el CSS generado.** Lo encontré aplicando el encabezado y
pregunté cuál era el bueno. Era un bug del pipeline: el bloque `text` de `tokens.json` es lo único
que nada comparaba contra el volcado. Diseño creó `R6` a partir de eso. Movió 24 baselines.

**Un `high` nuevo en `js-yaml`** habría congelado prod con el historial en verde detrás. Lo cacé
corriendo `npm audit` **antes** de empujar; el run de `aa952a75` alcanzó a fallar por eso. Es la
tercera vez este mes que un aviso transitivo aparece sin que nadie toque el repo.

**La rama del muñón de mes vacío era inalcanzable** — `visibleData` filtraba esos meses antes de
llegar a ella. El comportamiento estaba escrito correcto y después descartado. Lo encontró Diseño
dibujando, no un test.

**`rx` de SVG no sirve para redondear sólo arriba.** Redondea las cuatro esquinas o ninguna, así
que el segmento superior tiene que ser un `path` — y en `TrendChart` eso convierte la animación de
crecimiento en un tween de la forma.

**Sobreescribí `format.test.ts` con `cat >` sin mirar si existía.** Existía. Perdí tres tests y
sólo lo noté porque el conteo subió 138 → 142 en vez de 145. Recuperado del índice y fusionado
antes de commitear. La regla que me faltaba: `cat >` sobre una ruta que no acabo de crear es un
`rm` silencioso.

**El `.git/HEAD.lock` del bridge me bloqueó cuatro veces** en la sesión. Está documentado en
ORCHESTRATION §v3.5.1 y la rutina funciona, pero ahora que Diseño y yo commiteamos en paralelo
sobre el mismo árbol pasa varias veces por sesión, no una.

**Tres valores para un mismo gesto, no dos.** El donut atenúa a 0.25. No lo toqué —no lleva texto—
pero si el par de tokens existe, es su tercer consumidor.

## NEEDS

Ninguno bloqueante. Dos decisiones están con Diseño y ninguna detiene trabajo: el nombre del par de
tokens del atenuado (el valor ya lo fija la medición) y si las series cambian de familia.

**Para Alfredo, cuando quiera:** la Fase 1.5 se acerca a su cierre y la Fase 1 está completa —
corregí la casilla de `_settings` en `NORTH_STAR.md`, que llevaba sin marcar desde julio pese a
estar en prod y verificada. Lo siguiente se bifurca entre **Fase 2 (Capacitor + recordatorios
locales)** y el checklist de pre-monetización, cuyo punto 1 —el recordatorio de PILA— es el mismo
trabajo. Esa convergencia hace que Fase 2 se vea como el paso natural, pero es decisión suya.
