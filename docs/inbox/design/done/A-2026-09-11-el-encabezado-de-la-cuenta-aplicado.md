# A-2026-09-11 — el encabezado de la cuenta, aplicado (y tres cosas que la medición dejó abiertas)

Las seis diferencias de `TASK-2026-09-06` están en `AccountSummaryCard.tsx`. Figma Desktop no
tenía el archivo abierto —`379:12631` y `302:10368` responden *no node found*— así que apliqué tu
medición nodo por nodo, que es el canal, no la foto. Las tres preguntas de abajo salen de eso: son
justo los puntos donde la nota y lo generado no dicen lo mismo.

## Lo aplicado

| | quedó |
|---|---|
| título | `ts-heading-subsection` (20/24 SemiBold) |
| marca de identidad | `AccountGlyph` suelto a 16 — `Icon Account`, no el avatar |
| estrella | 24, en caja de 24×24 |
| chips de meta | `ts-detail-large-strong`, los dos grupos |
| `Deuda` / `Cupo` | `ts-label-base` |
| cifras | sin tocar, ya estaban |

`AccountGlyph` es nuevo y sale de `AccountAvatar.tsx`: el avatar ahora lo compone en vez de
dibujar el glifo, que es la relación que tienen en Figma —`Icon Account` es su propio componente—
y no la que tenía el código.

## 1 · `Label/Base` no mide 14

La nota dice **14/16 Medium**. `tokens.css` genera `.ts-label-base` en **12/16 Medium**, +0.5 de
tracking. Usé la clase, que es lo que la nota manda en la columna que importa.

Pero el argumento de la nota era de tamaño: *«`Deuda` y `Cupo` no son pie de foto… a 11 Regular no
alcanzan a nombrar la cifra»*. De 11 Regular a 12 Medium hay un punto y un peso, y en pantalla casi
no se nota — lo verifiqué renderizando los dos lados. Si el argumento se sostiene, lo que falta no
es el cambio de clase sino que `Label/Base` valga 14 en Figma. **¿Cuál de los dos es el correcto,
la clase o la medida?** Si es la medida, el token cambia y se arrastra a los 35 sitios que ya la
usan, así que no lo toqué.

## 2 · `account-summary-card/icon/foreground` es un morado fijo

Lo consumí —estaba generado y sin leer desde el 09-01, que es deuda por definición— así que el
glifo suelto sale en `purple/500` / `purple/400`.

Lo que eso implica: **el color de identidad de la cuenta desaparece de su propia página.** Los doce
matices de `account/<hue>/*` existen para que una cuenta se distinga de otra, y hasta ahora el
avatar los traía al encabezado. Con el glifo suelto en morado fijo, Bancolombia y CMR Falabella
tienen el mismo encabezado salvo por el texto.

Puede ser exactamente lo que quieres —adentro ya sabes en qué cuenta estás, que es el argumento
con el que quitaste la ficha— pero entonces el morado es un color decorativo sin significado en un
sistema donde el color siempre lo tiene. **¿`account-summary-card/icon/foreground` debería ser un
alias de `account/<hue>/accent`?** Es un cambio de una línea en cualquiera de los dos sentidos.

## 3 · La estrella de la grilla sigue en 14

`AccountCardView.tsx` dibuja `<Star size={14} />`, igual que dibujaba el encabezado. Si `Favorite`
es un componente con un tamaño, la grilla también está desalineada y no estaba en tu medición.
**¿La cambio a 24 o la grilla usa otra instancia?** No la toqué: no la mediste, y 24 en una ficha
de 230px no es lo mismo que 24 en un encabezado de 680.

POINTER: `src/components/cards/AccountSummaryCard.tsx`, `src/components/ui/AccountAvatar.tsx`
(`AccountGlyph`), `src/components/cards/AccountCardView.tsx:106`;
`design-system/tokens/tokens.css` (`.ts-label-base`, `--account-summary-card-icon-foreground`).
