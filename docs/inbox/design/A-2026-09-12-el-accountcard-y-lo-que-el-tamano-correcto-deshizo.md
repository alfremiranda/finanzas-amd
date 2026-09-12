# A-2026-09-12 — las cuatro del `AccountCard`, y lo que el tamaño correcto deshizo solo

Las cuatro aplicadas. Tu diagnóstico del `gap 0` era exacto y por eso el arreglo no fue añadir un
gap: el contenedor aguanta tres hijos y Figma dos, así que agrupé el monto con sus sub-líneas en un
`amount-block` sin gap propio, y el `gap-1` cae donde tú lo mediste. Las sub-líneas siguen colgando
del monto.

| # | quedó |
|---|---|
| 1 | `info` con `gap-1`, y el `amount-block` nuevo |
| 2 | `ts-amount-large` |
| 3 | `bg-[var(--bg-surface-subtle)]` |
| 4 | `hover:border-[var(--border-strong)]` |

## Lo que el #2 deshizo, y que tienes que saber

Hace unas horas la ficha **abreviaba** el monto —`$3,71 m`— porque a `ts-amount-hero` la cifra no
cabía: medí 27px de desborde en un teléfono, y 97px fuera de la pantalla en Resumen. Alfredo
escogió abreviar antes que soltar la cuadrícula.

**Con el tamaño correcto esa restricción desaparece.** Medido de nuevo, no supuesto: a 22px
`$3.708.000` necesita **113px** y hay **139** disponibles en un 390. Cabe con 26 de sobra, y los
siete montos de la grilla dan desborde 0.

Así que la ficha vuelve a la cifra completa. No es que revierta la decisión de Alfredo: la decisión
resolvía un problema que la causaba `ts-amount-hero`, y `ts-amount-hero` era el bug que acabas de
reportar. **La tira de KPIs sigue abreviando** — ahí el tamaño sí es 28 y ahí sí no cabe.

Vale la pena anotar la forma: pasé una hora resolviendo un síntoma cuya causa estaba en un ticket
que llegó después. Lo que lo habría evitado no es más medición de mi lado —medí bien— sino haber
preguntado por qué la cifra era 28 antes de aceptar que lo fuera.

## Sobre el `Selected`, que dejaste apuntado

De acuerdo y sin tocarlo, pero apoyo la observación con lo que ya sabemos: es el mismo patrón que
`border/subtle` (un nombre que corría al revés) y que `bg/disabled` (cinco tokens que valían lo
mismo que la card). Un relleno a 1.01 **no es un relleno tenue, es ninguno** — lo único que marca
la selección es el borde de 2px, y eso es un solo canal.

Si Alfredo aprueba `bg/selected`, en código es una línea: `--color-income-bg` → `--bg-selected`.

POINTER: `src/components/cards/AccountCardView.tsx`.
