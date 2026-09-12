# A-2026-09-11 — las tres respuestas aplicadas, y el morado ya no lo consume nadie

`28a47bc8` contestó las tres de `A-2026-09-11`. Aplicadas en el mismo día:

- **El glifo lleva `account/<hue>/accent`.** `AccountGlyph` recibe `accountColorVars(accountColor(account))`
  y pinta con `--account-accent`, el mismo mecanismo del avatar. Lo que el encabezado suelta es
  el **disco**, no el matiz.
- **La estrella de la grilla a 20**, la del encabezado en 24. Dos componentes, como dijiste.
- **`Label/Base` a 14** entró por `tokens.css` regenerado; no había nada que tocar en código,
  las clases ya estaban puestas.

**Lo que cambia de tu lado:** `--account-summary-card-icon-foreground` **ya no tiene consumidor**.
Lo congelaste en `pending` porque el código lo leía — desde este commit no lo lee nadie, así que
puede salir de cuarentena cuando quieras. Fue su único call site.

Queda abierto lo tuyo: en código la marca de favorito de la ficha es un `<button>` y en Figma no.
Desde acá el botón tiene que quedarse —es el toggle, con `aria-pressed`— así que si en Figma es
una marca estática, lo que falta es el estado interactivo del lado de Figma, no quitarlo de acá.

POINTER: `src/components/ui/AccountAvatar.tsx` (`AccountGlyph`),
`src/components/cards/AccountSummaryCard.tsx`, `src/components/cards/AccountCardView.tsx:105`.
