# A-2026-09-12 — `Amount/Hero` no cabía en su caja, en tres de los cuatro flujos

Alfredo me pidió iterar los cuatro flujos. En vez de revisarlos a ojo levanté la app con
`?preview` y medí, en cuatro anchos, **todo nodo de texto cuyo `scrollWidth` excede su caja**.
Descontando el ruido —`sr-only`, texto SVG, `truncate` intencional— quedó un solo hallazgo, y es
sistemático.

## La medición

`Amount/Hero` son 28px tabulares. Una cifra COP de once dígitos —que un bruto anual alcanza sin
esfuerzo— necesita ~162px de texto más los 34px de padding de la tarjeta: **~196px**.

| dónde | ancho de contenido | desbordaba |
|---|---|---|
| KPI, 2 columnas a 390 | 139px | **23px** |
| Tarjeta de cuenta, 2 columnas a 390 | 139px | **27px**, y 97px fuera de la pantalla en Resumen |
| KPI, 5 columnas a 1280 | 186px | **10px** |
| KPI, 5 columnas a 1600 | 186px | **10px** |

Lo último es lo que decide el asunto: **cinco columnas de `Amount/Hero` no caben a ningún ancho
realista.** No era un problema de móvil.

## Lo decidido

Le llevé a Alfredo las dos salidas renderizadas —abreviar la cifra, o soltar la cuadrícula— y
escogió **abreviar**, que es lo mismo que ya había decidido para el centro del donut y por la
misma razón.

- **KPI y tarjeta de cuenta en COP** → `COPShort`. `$41,12 m`, `$3,71 m`.
- **Tarjeta de cuenta en USD** → pierde los centavos, no la escala: `$13.000`. `$13,00 k` dice
  menos que `$13.000` sobre un saldo de trece mil dólares.
- La cuadrícula se queda como estaba: dos columnas en móvil, cinco en escritorio. La barra de
  distribución y las tabs vuelven a quedar sobre el pliegue en móvil, que con una sola columna se
  perdían.

Tu frontera de `TASK-2026-09-13` se respeta y de hecho la confirma: dijiste que la abreviación no
va a los ejes porque **«un eje es una escala contra la que lees, la del centro es la cifra que
lees»**. Un KPI y el saldo de una cuenta están del lado de *la cifra que lees*. Los ejes siguen en
`$12M`, mayúscula y sin decimales.

## Dos cosas que vi y no toqué

**Se mezclan unidades en la misma cuadrícula.** `$437,76 k` al lado de `$3,71 m`. `$437.760`
entero medía 144px contra 139 disponibles — se pasaba por 5px, así que el `k` no es evitable ahí.
Si prefieres una sola unidad por cuadrícula (`$0,44 m`), es una línea, pero es tuya.

**La estrella de favorito a 20 domina la ficha.** Es lo más fuerte de cada tarjeta, por encima del
nombre de la cuenta — se ve en la captura de Cuentas móvil. La pusiste en 20 a propósito y contra
un título de 16 Medium tenía sentido; en la cuadrícula, con siete fichas, pesa distinto.

POINTER: `src/components/cards/KPIStrip.tsx` (`GRID_BY_COUNT` y los cinco `value`);
`src/components/cards/AccountCardView.tsx` (`fmtHeadline`); `src/lib/format.ts` (`COPShort`).
