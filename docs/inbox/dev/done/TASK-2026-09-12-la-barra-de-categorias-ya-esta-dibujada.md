# TASK-2026-09-12 — la barra de distribución por categoría, dibujada (y no hay que cambiarla)

Fase 4, primer componente de los cuatro. `EgresosBar` (`EgresosCard.tsx:48`) existía solo en
código: no había con qué compararla ni dónde verla sin levantar la app con datos.

**Ya existe en Figma: `category-bar`**, cuatro variantes sobre `State=Default|Hovered` ×
`Device=Desktop|Mobile`. Página generada: `design-system/components/category-bar.html`.

## Lo primero: no hay nada que cambiar

La medí contra tu código nodo por nodo y **coincide entera**: 8 de alto, radio completo, 1px de
separación, atenuado al 30%, punto de 6, `gap-x-3` / `gap-y-1`, etiqueta en `Body/Small` sobre
`--muted-foreground` (que es `fg/subtle`) y cifra en `Amount/Small`, filete superior en `--border`
(que es `border/default`) con 12 de padding. Esto es documentación, no un rediseño.

Lo único que el mock no puede llevar: los anchos son porcentajes reales y la leyenda envuelve —dos
filas a 640, tres a 346— y en móvil el monto del hover se va a su propia línea a la derecha, porque
al lado del último ítem no cabe.

## Dos cosas que salieron de dibujarla, y ninguna es tuya sola

**1 · El mismo gesto atenúa distinto en dos componentes.** `EgresosBar` baja los demás al **30%**;
`DistribucionCard` los baja al **40%**. Es la misma idea —apagar el resto para destacar uno— con dos
valores, y ninguno de los dos tiene token detrás: en tu lado es `opacity-30` literal, en Figma es
opacidad de nodo. No lo unifiqué porque no sé cuál de los dos es el bueno y porque tocar
`DistribucionCard` sin preguntar ya me costó una reversión este mes. **Dime cuál prefieres** y lo
acuño como token de una vez.

**2 · Seis colores literales que `R1` no ve.** En las gráficas anuales:

```
EgresosCategoryChart.tsx:98-101   grid · highlight · empty · average
TrendChart.tsx:148-149            grid · highlight
```

Son `oklch(1 0 0 / 8%)` y familia. `R1` busca `#hex`, así que **un color escrito como
`oklch()`/`rgb()`/`hsl()` pasa el validador sin que nadie se entere**. No voy a extender `R1`
todavía: abriría en rojo el día uno y eso es cómo muere un chequeo — el mismo criterio con el que
tú retuviste `R5` hasta arreglar sus 22.

El orden es: **primero los tokens, después el chequeo.** Estoy dibujando las tres anuales ahora y
salen de ahí cuatro tokens de cromo de gráfica —`chart/grid`, `chart/highlight`, `chart/empty`,
`chart/average`— con los valores medidos de tus seis literales. Cuando los tengas en código, extiendo
`R1` a `oklch()`, `rgb()` y `hsl()` y queda cerrado para siempre.

POINTER: `design-system/components/category-bar.html`; Figma `1138:141` y `doc: category-bar` en
`Components · Cards`; `src/components/cards/EgresosCard.tsx:48`.
