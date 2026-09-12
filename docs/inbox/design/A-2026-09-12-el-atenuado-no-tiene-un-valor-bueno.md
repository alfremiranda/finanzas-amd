# A-2026-09-12 — el atenuado: la pregunta no tiene respuesta buena como está planteada

Me preguntaste cuál de los dos valores acuñar, 30 o 40. **Ninguno**, y el motivo es medible.

## Los dos atenúan también el texto

En los dos componentes la opacidad no cae sobre el color, cae sobre **la fila de leyenda entera**:
el punto, la etiqueta en `Body/Small` y la cifra en `Amount/Small`. `EgresosCard.tsx:83` y
`DistribucionCard.tsx:94` — es un solo `opacity-*` en el contenedor.

Así que el valor que acuñes no gobierna un color de gráfica: gobierna la legibilidad de un texto
que el usuario está leyendo **justo en ese momento**, porque atenuar es lo que pasa mientras el
puntero está encima.

`fg/subtle` sobre `bg/surface-default`, compuesto:

| | 30% | 40% | 70% | 75% | 100% |
|---|---|---|---|---|---|
| Claro | 1.69 | 2.07 | 4.15 | **4.73** | 9.45 |
| Oscuro | 2.21 | 2.91 | 6.07 | **6.76** | 10.99 |

4.5:1 es el mínimo para texto de ese tamaño. **30 y 40 fallan los dos, y por mucho** — 40 no es
"el menos malo", es 2.07 contra 4.5. Elegir entre ellos habría acuñado el defecto en un token, que
es peor que tenerlo suelto en dos sitios: deja de verse.

## Lo que propongo

**Separar el gesto en dos, porque son dos objetos distintos.**

- **El punto y el segmento de la barra: 30%.** Ahí el color *es* la codificación, y mientras está
  atenuado no es el que lleva el mensaje —lo lleva el resaltado—. 30 se ve bien y no tiene que
  pasar 4.5:1 porque no es texto.
- **La etiqueta y la cifra: 75%.** Pasa en los dos modos (4.73 / 6.76) y todavía se lee como
  "esto no es lo que estás mirando". El retroceso lo hace el conjunto: el punto apagado a 30 ya
  quita casi todo el peso visual de la fila.

Son dos tokens, no uno: algo como `chart/dim/swatch` y `chart/dim/label`. Si prefieres uno solo,
entonces tiene que ser 75 y aplicarse a la fila completa — pero el punto a 75 casi no se ve
atenuado, que es justo lo que el gesto quiere comunicar.

Dime cuál y lo cambio en los dos componentes de una vez; `DistribucionCard` incluido, que es el que
no toqué en su momento.

## Lo demás del TASK, cerrado

**`category-bar` coincide, confirmado.** No cambié nada; tu medición nodo por nodo es correcta.

**Los cuatro tokens de cromo ya están consumidos.** `--chart-grid`, `--chart-highlight`,
`--chart-empty` y `--chart-average` entraron por `ceb87080` y ya los leen `TrendChart` y
`EgresosCategoryChart`; los seis literales `oklch()` desaparecieron. **`R1` se puede extender a
`oklch()`/`rgb()`/`hsl()` cuando quieras: ya no abre en rojo.**

Un detalle al adoptarlos: cuatro de los ocho valores no son los que yo tenía. Claro —
`highlight` 3%→5%, `empty` 4%→5%, `average` 25%→30%; oscuro — `empty` 6%→5%. Tomé el token, que
es lo correcto, pero dijiste "con los valores medidos de tus seis literales" y estos cuatro no lo
son. Si fue deliberado, perfecto; si no, el token manda igual y solo quería que constara.

POINTER: `src/components/cards/EgresosCard.tsx:71,83`; `src/components/cards/DistribucionCard.tsx:73,94`;
`src/components/annual/EgresosCategoryChart.tsx:98-101`; `src/components/annual/TrendChart.tsx:148-149`.
