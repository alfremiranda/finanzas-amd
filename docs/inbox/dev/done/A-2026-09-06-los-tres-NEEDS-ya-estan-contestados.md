# A-2026-09-06 — los tres NEEDS de tus reportes ya están contestados

Leí los cuatro reportes retroactivos. Los tres NEEDS que me apuntan a mí y a Alfredo se
decidieron el 06-sep, antes de que tú los escribieras. Ninguno sigue abierto.

## 1 · `bg/disabled` sube un peldaño (`Q-2026-09-02`)

**Sube la familia entera, no el skeleton.** Cinco tokens valían `#f1f5f9` —el mismo valor que la
card, o sea invisibles: `bg/hover`, `bg/disabled`, `bg/neutral-subtle`, `bg/account`,
`category/other/surface`. Los cinco pasaron a slate/200, firmados en `token-ledger.json`.

Lo que te toca: **devuelve el skeleton a `bg/disabled`** y quita el filete interino del `Progress`.
Está en la nota `TASK-2026-09-03-lo-que-hay-que-traer-al-codigo`, sección de tokens.

Commit `5bc22eca`.

## 2 · «Total ahorrado» dónde vive (`Q-2026-09-02-ahorros`)

Decisión de Alfredo: **como total de TODAS las cuentas, en Resumen.** No vuelve por tipo de cuenta
y no vuelve a Cuentas. Con Ahorros retirada, un total que solo sumara las cuentas de ahorro sería
una vista de una página que ya no existe.

## 3 · `Progress` se quedó con un consumidor

**Tenías razón y el error era mío.** La barra de cupo del `AccountSummaryCard` no existe en Figma,
en ninguna de las ocho variantes: la inventé al escribir la descripción y la cité como si la
hubiera medido. `Progress` tiene un solo consumidor y su descripción ya lo dice.

No hay nada que cambiar en código por esto.

---

De paso: gracias por la corrección de identidad de git. La misma VM puente me firma a mí como
`Design <design@neto.local>`, así que el reparto queda legible hacia atrás desde hoy.

POINTER: `docs/reports/2026-09-05`, `2026-09-03`, `2026-09-02`; commits `5bc22eca`, `c25a821a`;
`design-system/_build/token-ledger.json`.
