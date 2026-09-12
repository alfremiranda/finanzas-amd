# FYI-2026-09-12 — las gráficas tienen página propia, y el hover es un estado

Dos cosas de organización y una medición que sí te toca.

## 1 · `Components · Charts`

Las siete viven juntas ahora: `AccountChart`, `AnnualDonut`, `category-bar`, `chart-legend`,
`chart-range`, `EgresosCategoryChart` y `TrendChart`. Antes había que saber tres páginas para armar
una gráfica — la leyenda estaba en Rows y el selector de rango en Forms.

En el paquete generado cambia sólo el grupo: `@dsCard group="Components · Charts"`. Ningún nodo
cambió de id, así que ninguna instancia se rompe.

## 2 · El hover dejó de ser mobiliario

`AccountChart` **siempre** dibujaba su tooltip y su marcador. Un readout transitorio dibujado
permanentemente se lee como parte del componente, y quien lo implemente no tiene dónde ver el
estado sin él.

Las tres gráficas de datos llevan ahora el mismo eje:

| | variantes |
|---|---|
| `AccountChart` | `State=Default\|Hover` × `Device` |
| `TrendChart` | `State=Default\|Hover` × `Device` |
| `EgresosCategoryChart` | `State=Default\|Hover\|Empty` × `Device` |

Y el hover de las dos anuales usa el mismo `Tooltip · Side=Top` + `TooltipReadout` + `ReadoutRow`.
Eso resuelve lo que te dije ayer: las dos gráficas de la página anual tenían dos tooltips
distintos, uno de librería y otro a mano. **El de librería gana**; el panel a mano de
`EgresosCategoryChart` se retira, con su fila de «Promedio» convertida en un `ReadoutRow`
`Divider=True`.

## 3 · Lo que sí hay que medir en código: los puntos de categoría en oscuro

El tooltip vive sobre `bg/surface/inverse`, que es **oscuro en claro y blanco en oscuro**. Medí los
puntos de categoría contra esa superficie:

| | claro | oscuro |
|---|---|---|
| `category/home/accent` | 4.77 | **1.48** |
| `category/food/accent` | 5.02 | **1.69** |
| `category/bank/accent` | 3.45 | **1.80** |
| `category/transit/accent` | 3.63 | **1.32** |
| `readout/swatch/tax` | 3.56 | 5.02 |

**En modo oscuro esos puntos son invisibles.** No es opinión: 1.32 contra el 3:1 que pide 1.4.11.
Es exactamente el motivo por el que existe `readout/swatch/*` — ahí `tax` medía 1.44 y por eso se
acuñó una familia aparte.

La solución es una familia `readout/swatch/category/*` congelada en el acento claro, que sirve en
los dos modos (4.77 en claro, ~3.5 en oscuro). **Son 14 tokens y no los acuñé**: es una familia
entera y prefiero que Alfredo diga que sí antes de meterla. Mientras tanto la vista Dark del marco
`doc: EgresosCategoryChart` **muestra el defecto a propósito**, que es mejor que dibujarlo bien y
que el código salga mal.

POINTER: Figma página `Components · Charts`; `design-system/components/*.html`;
`src/components/annual/EgresosCategoryChart.tsx` (el tooltip a mano).
