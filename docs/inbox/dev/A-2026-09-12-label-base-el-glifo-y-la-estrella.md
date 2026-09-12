# A-2026-09-12 — tus tres preguntas: una era un bug mío, una la decidió Alfredo, una es 20

Buen trabajo con la medición. Las tres preguntas eran justas y ninguna se contesta con una opinión.

## 1 · `Label/Base` mide 14. La clase estaba mal, no la nota

Figma dice **14/16 Medium, +0.5**. El volcado también. `_build/tokens.json` decía **12** y la clase
generada seguía al archivo, no a Figma. Así que `.ts-label-base` venía un punto corta **a los 16
sitios que la usan**, no solo a `Deuda` / `Cupo`.

Corregido: `.ts-label-base` ya sale 14/16. **No cambies nada en tu código** — la clase que usaste
era la correcta, lo que estaba mal era lo que la clase valía.

**Por qué pudo pasar, y lo que lo cierra.** `emit-tokens.mjs` regenera todo tokens.json *menos* el
array `text`, que se mantiene a mano. Era el único bloque del pipeline sin nada que lo comparara
contra Figma: el color tiene el ledger, el tipo no tenía nada. Ahora hay **`R6`** en
`validate-repo.mjs` — los 27 estilos contra el volcado, peso, tamaño, interlínea y tracking.
Verificado que falla: le puse el 12 de vuelta y lo reportó.

## 2 · El glifo lleva el matiz de la cuenta. Decisión de Alfredo, hoy

Tenías razón en el fondo: un morado fijo para una marca de **identidad** es color sin significado,
en un sistema donde el color siempre significa algo.

En Figma el glifo ya pinta con **`account/<hue>/accent`** —el mismo mecanismo que `AccountAvatar`
en la grilla, donde el matiz vive en la variante `Color`— en las ocho variantes.
**`account-summary-card/icon/foreground` está retirado.**

Lo que te toca: **tinta `AccountGlyph` con el matiz de la cuenta**, no con
`--account-summary-card-icon-foreground`. La cuenta ya trae el color; es el mismo dato que usa el
avatar en la ficha de la grilla.

El token **sigue emitiéndose**, congelado en `#a855f7` / `#c084fc`, porque
`AccountSummaryCard.tsx:111` lo consume y no voy a romperte el archivo con un borrado. Está en
`token-ledger.json` → `pending`, que es cuarentena, no amnistía: muere cuando hagas el cambio.

## 3 · La estrella de la grilla va a **20**, y no es el mismo componente

Medido: son dos cosas distintas a propósito.

| | Figma | qué es |
|---|---|---|
| encabezado | `Favorite`, **24×24** | un control con estados |
| ficha de la grilla | `Icon` con glifo `star_filled`, **20×20** | una marca |

Así que **20 en `AccountCardView.tsx:106`**, no 24. Tenías razón en no estirarla: 24 en una ficha de
180 no es lo mismo que 24 en un encabezado de 680.

Queda una cosa **abierta de mi lado, no tuya**: en tu código la estrella de la grilla *es* un botón
que alterna favorito, y Figma la dibuja como marca estática. La misma acción dibujada de dos formas
es un defecto mío; si la ficha pasa a llevar `Favorite`, te lo digo antes de que toques nada.

POINTER: `design-system/tokens/tokens.css` (`.ts-label-base`), `design-system/_build/validate-repo.mjs`
(`R6`), `design-system/_build/token-ledger.json` → `pending`; Figma `379:12631` (glifo),
`212:8761` (la marca de la grilla).
