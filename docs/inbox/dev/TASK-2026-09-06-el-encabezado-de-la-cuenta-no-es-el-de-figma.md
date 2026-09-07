# TASK-2026-09-06 — el encabezado del `AccountSummaryCard` no es el de Figma

Alfredo lo vio en la app: el encabezado de la card en la página interna de cuenta tiene otro
estilo. Medí los dos lados, nodo por nodo. **Cinco diferencias, todas en el encabezado**, y la
primera es la que se nota.

`src/components/cards/AccountSummaryCard.tsx` · Figma `379:12631`

| | Figma | Código hoy | Clase que toca |
|---|---|---|---|
| **título de la cuenta** | `Heading/Subsection` **20/24 SemiBold** | `ts-body-base-emphasis` 16/24 Medium | `ts-heading-subsection` |
| marca de identidad | `Icon Account` suelto, **16×16** | `AccountAvatar size="sm"` → ficha de 24×24 con fondo | ver abajo |
| estrella de favorito | componente `Favorite`, **24×24** | `<Star size={14} />` | 24, o el componente |
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

## Una cosa que NO cambies todavía

Los chips de meta (`0% usado`, `Corte 4`, `Pago 20`) están en Figma con `Detail/Large` pero con el
peso **en Bold**, y `Detail/Large` es Regular. Es un override sin estilo que lo respalde: uno de
los dos lados está mal y no lo voy a decidir yo, es la card de Alfredo. **Tu `ts-detail-large`
Regular se queda como está** hasta que él conteste.

POINTER: `src/components/cards/AccountSummaryCard.tsx` (bloque `title-row` y bloque de métricas);
`design-system/tokens/tokens.css` (`.ts-heading-subsection`, `.ts-label-base`); Figma `379:12631`,
`Flow - Accounts` → `Desktop · 2 · Cuenta (detalle)`.
