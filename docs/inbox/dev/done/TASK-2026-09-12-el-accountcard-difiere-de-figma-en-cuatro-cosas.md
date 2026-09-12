# TASK-2026-09-12 — el AccountCard difiere de Figma en cuatro cosas, no en una

Alfredo notó que el hueco entre la fila `COP | 1234` y el monto existe en Figma y no en código.
Al medirlo aparecieron cuatro diferencias. **Figma manda en las cuatro** — decisión suya, hoy.

Componente: `AccountCard` `212:8761` (12 variantes) · código `src/components/cards/AccountCardView.tsx`.

## Las cuatro, medidas

| # | Figma | Código hoy |
|---|---|---|
| 1 | `info` con `gap = 4` (`spacing/4`), en las 12 variantes | `<div className="flex flex-col">` — sin gap |
| 2 | monto en **`Amount/Large`** 22/26 | `ts-amount-hero` 28/28 |
| 3 | fondo Default/Hover en **`bg/surface/subtle`** (`#fdfefe` / `#1e293b`) | `bg-card` → `--surface-wrap-card` → `bg/surface/default` (`#f1f5f9` / `#162032`) |
| 4 | borde Hover en **`border/strong`** (`#64748b`, 1px, neutro) | `hover:border-[var(--primary)]/40` — marca al 40% |

Las dos primeras empujan al mismo lado: el monto es 6px más grande **y** se pega a la fila de
arriba. Y como `ts-amount-hero` tiene interlineado igual al tamaño (28/28) no queda ni el respiro
del half-leading: el hueco real es 0, no «casi 0».

## Por qué estaba en 0, para que no se repita

El `gap 0` se escribió el 14-jul en `1e4f4fb9`, un commit titulado *«card spacing to match Figma»*.
Se puso creyendo que igualaba a Figma, y el comentario de la línea todavía lo afirma:
`{/* Info block — meta · amount · primary sub-lines, tight (gap 0) */}`.

Mi lectura de por qué quedó así: ese contenedor aguanta **tres** cosas en código —`meta`, el monto y
las sub-líneas de rendimiento/deuda/utilización— mientras que el frame `info` de Figma sólo tiene
dos. Un `gap-1` uniforme habría separado también las sub-líneas, que sí van pegadas al monto. Se
resolvió quitándole el gap a todo.

**Por eso el arreglo no es añadir `gap-1` al bloque actual.** Es agrupar:

```
info               flex flex-col gap-1     ← 4px, el de Figma
  ├─ meta          (badge | tipo | número)
  └─ amount-block  flex flex-col           ← sin gap: el monto y sus sub-líneas van juntos
       ├─ monto    ts-amount-large
       └─ sub-líneas (rendimiento · deuda · % usado)
```

Así el 4px cae donde Figma lo puso —entre la fila meta y el monto— y las sub-líneas siguen
colgando del monto como hoy.

## Lo demás no se toca

Medido y coincide: padding `p-4` = 16, gap de la card `gap-2` = 8, radio `rounded-xl` →
`--radius-12`, fondo Selected (`--color-income-bg` = `bg/income-subtle`), borde Selected 2px de
marca. El header ya está en 6px en los dos lados.

## Una advertencia sobre el estado Selected, que NO es parte de este ticket

`Selected` pinta `bg/income-subtle` en los dos lados, así que no hay divergencia que arreglar. Pero
medí lo que hace ese color y vale la pena que lo sepas:

- Contra `bg/surface/default`, `bg/income-subtle` mide **1.01** en claro. Es decir: **el relleno de
  «seleccionado» es invisible**. Lo que marca la selección es el borde de 2px, sólo él.
- Y es un token prestado: `bg/income-subtle` significa *dinero que entra*, no *seleccionado*. En una
  card cuyo tema es dinero, un tinte «income» puede leerse como «esta cuenta recibió algo».
- El sistema ya tiene el token propio —`bg/selected`, cian al 10/20%, que además concuerda con el
  borde `border/brand-strong` que la card ya usa— y mide 1.04 contra el mismo fondo.

Lo dejo apuntado, no lo cambio: el color es de Alfredo. Si él lo aprueba, es un cambio de una línea
en Figma y una en `AccountCardView.tsx`.

— Design
