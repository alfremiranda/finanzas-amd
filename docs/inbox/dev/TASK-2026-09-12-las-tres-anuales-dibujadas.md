# TASK-2026-09-12 — las tres gráficas anuales, dibujadas. Fase 4 cerrada

`TrendChart`, `EgresosCategoryChart` y `AnnualDonut` existen en Figma con sus estados, y con eso
los cuatro componentes de la fase 4 están. Páginas generadas en `design-system/components/`.

| componente | variantes | de dónde salió |
|---|---|---|
| `TrendChart` | `Device=Desktop\|Mobile` | `src/components/annual/TrendChart.tsx` |
| `EgresosCategoryChart` | `Device=Desktop\|Mobile` | `src/components/annual/EgresosCategoryChart.tsx` |
| `AnnualDonut` | `State=Default\|Selected` | `AnnualTable.tsx` → `AnnualDonut` |

## 1 · Los seis literales ya tienen token

Esto es lo único que hay que cambiar en las dos de barras, y es mecánico:

```
TrendChart.tsx:148          gridColor   → var(--chart-grid)
TrendChart.tsx:149          hlColor     → var(--chart-highlight)
EgresosCategoryChart:98     gridColor   → var(--chart-grid)
EgresosCategoryChart:99     hlColor     → var(--chart-highlight)
EgresosCategoryChart:100    emptyColor  → var(--chart-empty)
EgresosCategoryChart:101    avgColor    → var(--chart-average)
```

Los valores salieron **de tus literales**, no de mi criterio: `chart/grid` es 5% negro / 8% blanco,
igual que escribiste. Los otros tres se movieron como mucho dos puntos para caer en múltiplos de 5,
que es como está el resto de la rampa.

**Cuando esos seis estén, extiendo `R1` a `oklch()`, `rgb()` y `hsl()`** y el hueco queda cerrado.
No antes: abrir un chequeo en rojo es cómo se apaga un chequeo.

## 2 · Las series apuntan a `chart/categorical/*`, no al KPI

En código las cuatro series usan `--color-tax`, el color de provisión, `--color-expense` y
`--color-net`. **Hoy valen exactamente lo mismo** que `--chart-categorical-1..4`, así que no cambia
un pixel. La indirección es el punto: es lo que impide que una serie se separe de la card que le
corresponde cuando alguien mueva una de las dos. El donut y `DistribucionCard` ya hablan ese
vocabulario; las tres dicen lo mismo con los mismos colores.

## 3 · Tres cosas que el dibujo decidió, y que sí cambian comportamiento

**a · Los meses vacíos se dibujan.** Un muñón de 4px sobre `chart/empty`, no nada. Un año que
esconde sus meses vacíos comprime el tiempo y pone marzo al lado de junio como si fueran seguidos;
además el hueco **es** información: dice que la app todavía no se usaba.

Y aquí hay un bug: `visibleData` filtra los meses sin datos **antes** del `if (!d.hasData)` que
dibuja el muñón, así que esa rama es inalcanzable. Escribiste el comportamiento correcto y luego lo
filtraste. Quita el filtro y la rama empieza a servir.

**b · La línea de promedio va encima de las barras.** Hoy se dibuja antes, así que una pila alta se
la traga. Es una cifra contra la que se lee, no cromo — por eso `chart/average` está seis peldaños
por encima de `chart/grid`.

**c · En móvil las etiquetas del eje pierden el año.** Ocho «sep '26» no caben en 346 y d3 no
envuelve: se encabalgan. Medido en el ancho real. En `TrendChart` móvil van `feb` … `sep`.

## 4 · Y una que no arreglé porque no es de una gráfica sola

`TrendChart` usa `TooltipReadout`; `EgresosCategoryChart` tiene un panel propio a mano con lista por
categoría y pie de «Promedio». Dos tooltips distintos para dos gráficas de la misma página es un
defecto, y la solución es de librería, no de ninguna de las dos. Lo tengo en mi cola.

## 5 · Del volcado, que se sincronizó de paso

- **Quince `--size-*` nuevos** — existían en Figma y nunca habían llegado al CSS.
- **Las seis superficies ahora son `--bg-surface-*`** (canvas, chrome, default, inverse, subtle,
  sunken). Los nombres viejos siguen vivos como alias, así que `--bg-chrome` y `--bg-surface` no se
  rompen; migra los cinco sitios cuando pases por ahí.
- **Cuatro `--chart-*`** nuevos, los de arriba.

POINTER: `design-system/components/{trendchart,egresoscategorychart,annualdonut,category-bar}.html`;
Figma `1143:172`, `1146:2`, `1146:3`, `1138:141`; `design-system/tokens/tokens.css`.
