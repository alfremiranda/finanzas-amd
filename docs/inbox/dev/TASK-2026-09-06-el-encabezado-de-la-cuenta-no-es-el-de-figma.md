# TASK-2026-09-06 — el encabezado del `AccountSummaryCard` no es el de Figma

Alfredo lo vio en la app: el encabezado de la card en la página interna de cuenta tiene otro
estilo. Medí los dos lados, nodo por nodo. **Seis diferencias, todas en el encabezado**, y la
primera es la que se nota.

`src/components/cards/AccountSummaryCard.tsx` · Figma `379:12631`

| | Figma | Código hoy | Clase que toca |
|---|---|---|---|
| **título de la cuenta** | `Heading/Subsection` **20/24 SemiBold** | `ts-body-base-emphasis` 16/24 Medium | `ts-heading-subsection` |
| marca de identidad | `Icon Account` suelto, **16×16** | `AccountAvatar size="sm"` → ficha de 24×24 con fondo | ver abajo |
| estrella de favorito | componente `Favorite`, **24×24** | `<Star size={14} />` | 24, o el componente |
| chips de meta | `Detail/Large-Strong` **12/18 Bold** | `ts-detail-large` 12/18 Regular | `ts-detail-large-strong` |
| etiquetas `Deuda` / `Cupo` | `Label/Base` **14/16 Medium** | `ts-detail-base` 11/16 Regular | `ts-label-base` |
| cifras | `Amount/Large` 22/26 · `Amount/Base` 16/20 | iguales | — nada que hacer |

## Lo que cambia de verdad

**El título es el punto.** 16 Medium contra 20 SemiBold son cuatro puntos y un peso: en la página
interna el nombre de la cuenta **es el título de la página**, no una línea más de la card. Con 16
Medium queda al mismo nivel que la descripción de una fila del ledger, y por eso la pantalla se
lee plana.

**La marca de identidad no es del mismo tipo de elemento.** Figma pone el glifo de la cuenta
suelto a 16; el código pone un `AccountAvatar` de 24 con fondo de color. El avatar con ficha es
lo correcto en la **grilla** —ahí el color es lo que distingue una tarjeta de otra a un vistazo—
pero adentro ya sabes en qué cuenta estás, y la ficha compite con el título. Va el glifo suelto.

**Las etiquetas de las cifras suben de 11 a 14.** `Deuda` y `Cupo` no son pie de foto: nombran la
cifra que tienen debajo, y a 11 Regular no alcanzan a hacerlo.

## Los chips de meta suben de peso — hay clase nueva

Los chips (`0% usado`, `Corte 4`, `3,5% E.A.`, `Vence 14 mar 2027`) van en **Bold**, no en Regular.
Estaban así en Figma desde hace rato pero como override suelto, sin estilo que lo respaldara.
Alfredo confirmó que el peso es intencional, así que ahora existe el estilo y los 18 nodos están
atados a él.

**Clase nueva: `.ts-detail-large-strong`** — 12/18 Bold. Ya está en `tokens.css`.
En el código el bloque de `facts` usa `ts-detail-large`: cámbialo a `ts-detail-large-strong`.
Aplica a los dos grupos, el corrido y el chip de fechas.

Se llama `-Strong` y no `-Emphasis` a propósito: en este sistema **Emphasis significa Medium**
(`Body/Small-Emphasis`, `Detail/Emphasis`). Un peldaño más arriba necesitaba otra palabra, o
`Emphasis` habría pasado a significar dos pesos distintos según el estilo.

POINTER: `src/components/cards/AccountSummaryCard.tsx` (bloque `title-row` y bloque de métricas);
`design-system/tokens/tokens.css` (`.ts-heading-subsection`, `.ts-label-base`, `.ts-detail-large-strong`); Figma `379:12631`,
`Flow - Accounts` → `Desktop · 2 · Cuenta (detalle)`.
