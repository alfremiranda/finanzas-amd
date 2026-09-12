# A-2026-09-12 — el token de relleno se usaba como color de texto, en diez sitios

Segunda pasada sobre los cuatro flujos. Mismo método que la del desborde: la app bajo `?preview`,
cuatro combinaciones de ancho y modo, midiendo el contraste real de **cada nodo de texto contra su
fondo pintado** — no contra el que uno supone.

## El hallazgo

Diez sitios pintaban texto con el token de **relleno** en vez del de **texto**. En claro, sobre la
card:

| | relleno | texto (`-txt`) | falta |
|---|---|---|---|
| expense | `#ef4444` → **3.44** | `#b91c1c` → 5.91 | 4.5 |
| provision | `#059669` → **3.44** | `#047857` → 5.01 | 4.5 |

En oscuro los dos rellenos pasan (5.90 y 8.49), así que **el defecto era sólo de modo claro** — y
por eso nadie lo veía mirando la app de noche.

Migrados: la cifra de rendimiento del `AccountSummaryCard` y de la ficha, `ReservaCard`, las dos
cifras anuales de `AnnualTable`, `EgresosBreakdown`, el estado `settled` de `TributariasView`, el
saldo de crédito del ledger, y las tres partes de la fila «SS pagada».

**Los iconos NO se tocaron.** Un glifo es objeto gráfico y pide 3:1: el del ledger sobre su tinte
mide 3.58 y pasa. La única excepción es el check de «SS pagada», que sí cambió — pasa igual, pero
comparte fila con dos textos que ahora son de otro peldaño y se vería descosido.

## La causa de fondo, que es lo que pido que mires

El mapeo relleno→texto **existía, pero dentro de `KPIStrip`**, como un objeto local. Por eso la tira
de KPIs mensual estaba bien y la anual no: nadie más podía llamarlo.

Y hay un caso en que el componente **no puede** escribir la clase correcta aunque quiera: el color
de una provisión sale de lo que el usuario configuró en su deducción, así que el call site tiene una
variable, no un literal. Ese era justo el que fallaba.

Ahora vive en `src/lib/toneToken.ts` como `toTextToken()`. **Sugerencia para el DS:** esto
probablemente debería ser una regla del validador —«un token de relleno no aparece en una propiedad
de texto»— más que una función que hay que acordarse de llamar. Tú decides si entra como `R7`; yo no
lo abro porque el criterio de qué cuenta como «propiedad de texto» es tuyo.

## Dos falsos positivos míos, para que no queden en el acta

Mi medidor reportó `text-muted-foreground/70` a 1.28 y el título del mes a 1.17. **Los dos eran
error del instrumento**, no de la app: los colores computados salen como `oklch(… / 0.7)` y
`oklab(…)`, y mi parser los leyó como si fueran RGB. Verificados uno por uno contra el color
computado real antes de reportar nada — el título mide ~16:1.

POINTER: `src/lib/toneToken.ts`; `src/components/annual/AnnualTable.tsx:128`;
`src/components/cards/{KPIStrip,ReservaCard,AccountCardView,AccountSummaryCard,ObligacionesCard}.tsx`;
`src/components/views/{TributariasView,CuentasView}.tsx`; `src/components/annual/EgresosBreakdown.tsx`.
