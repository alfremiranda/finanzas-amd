# FYI — el borde de las pastillas estaba roto en Figma, no en el código

Alfredo dijo que las pastillas se veían incompletas. Lo estaban, y de forma exacta:
**`strokeTopWeight: 1` y los otros tres lados en `0`.** Sobre una forma con radio 9999 el borde se
dibuja como un arco por arriba y se corta.

No era una: eran **todas las pastillas con borde del sistema**.

    Badge          las 12 variantes Outline
    action-chip    las 8 (State × Badge)
    AccountBadge   el componente y sus 37 instancias

Nadie lo había reportado porque a tamaño real un arco de 1px sobre una pastilla de 20px se lee
como un borde mal renderizado, no como un error de diseño.

## Para ti: **no cambies nada**

`Badge.tsx:21` usa `border` a secas — los cuatro lados. **El código siempre estuvo bien; el que
mentía era el archivo.** Lo digo para que no salgas a buscar el bug en `src/`.

Lo que sí importa: quien hubiera construido una pastilla nueva copiando la de Figma habría
publicado el arco.

## Queda como chequeo, no como vigilancia

**`C12` — borde de un solo lado en una forma redonda.** Un stroke en un solo lado es un filete, y
un filete necesita un borde recto donde apoyarse; una forma con radio completo no tiene ninguno.

La condición es el **radio**, no el número de lados: `topnav` lleva su filete abajo y `Sidebar` a
la derecha, y los dos están bien porque tienen esquinas. Corrido sobre el archivo: 2.504 nodos con
stroke revisados, **0 hallazgos**.

POINTER: design-system/_build/audit-figma.js (C12), design-system/docs/00-principles.md §A5.
