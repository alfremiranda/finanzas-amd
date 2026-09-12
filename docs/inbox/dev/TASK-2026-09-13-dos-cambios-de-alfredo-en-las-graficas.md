# TASK — dos cambios de Alfredo en las gráficas, y una regla de formato que sale de uno

Los hizo él directo en Figma. Los medí, los propagué a lo que faltaba y los dejé escritos.

## 1 · Sólo el bloque de arriba se redondea

En `TrendChart` y `EgresosCategoryChart`: **el segmento superior de cada barra apilada lleva
`radius/4` en sus dos esquinas de arriba; todo lo de abajo va cuadrado.** Antes yo había redondeado
el primero y el último, que es lo que hace el código hoy (`rx: isFirst || isLast ? 3 : 0`).

La razón, y es buena: redondear cada segmento convierte una barra en **una pila de pastillas
sueltas** y el ojo deja de sumarlas. Redondeando sólo arriba, la barra dice «esto es una sola
cantidad, y termina aquí».

En código:

```
EgresosCategoryChart.tsx   .attr('rx', isFirst || isLast ? 3 : 0)
                           → sólo el último segmento del stack, y sólo las esquinas de arriba
TrendChart.tsx             .attr('rx', 2) en todos los rects → lo mismo
```

`rx` de SVG redondea las cuatro esquinas, así que esto no se resuelve con un atributo: o el
segmento de arriba se dibuja como `path` con dos esquinas, o el rect se recorta. **El valor es 4,
no 2 ni 3**, y sale de `--radius-4`.

De paso: el muñón del mes vacío quedó en `radius/4` en las cuatro esquinas —a 4px de alto eso lo
convierte en una raya de puntas redondas, que es una marca deliberada y no una barra cortada—. Antes
tenía un 3 suelto que no estaba en ninguna escala. Ese sí lo cambié yo.

## 2 · La cifra del centro del donut se abrevia

`AnnualDonut` pasa de `Amount/Large` a **`Amount/Hero` (28)** y la cifra va **abreviada**:

```
hasta 2 decimales · unidad en minúscula · separador decimal COMA
$54,57 m     millones
$1,20 k      miles
```

El bruto de un año escrito completo son once dígitos dentro de un círculo de 160: o se encoge hasta
dejar de ser el titular, o se parte en dos líneas.

Hoy el código hace `COP(totBruto)`, que escribe la cifra completa. **Falta un formateador** — el
mismo que usará cualquier otra cifra que no quepa. La coma decimal es `es-CO`, igual que el resto de
la app; Alfredo lo confirmó hoy.

**La abreviación NO se extiende a los ejes.** Se quedan `$12M`, mayúscula y sin decimales, y eso es
decisión suya también: un eje es una escala contra la que lees, la del centro es la cifra que lees.
Lo dejo escrito para que nadie lo «arregle» después.

POINTER: Figma `1143:172`, `1146:2`, `1146:3`; `src/components/annual/*.tsx`;
`design-system/tokens/tokens.css` (`--radius-4`).
