# 2026-09-06 — Un total que no se podía sumar, la jerarquía de obligaciones, y una barra que flota

Commits: `4a13875f`, `88461254`, `3e5f2dfa`, `f975af0a`, `ba237dc1`, `d82ea6b2`, `ea24d73b`,
`0a12ed53`.

Reporte retrasado: la sesión del 06 cerró sin él (`Q-2026-09-07`). Lo escribo hoy 09-11 desde los
commits y los tickets, no de memoria.

## DID

Se revierte el total de todas las cuentas. La tab bar móvil pasa a cápsula flotante. Obligaciones
gana jerarquía: una franja que responde primero y una cifra por fila. Y ocho baselines
resembradas, cuatro de ellas por un error mío del día anterior.

## DECISIONS

**El total de todas las cuentas sale, y no vuelve por otra puerta.** Lo pidió Alfredo con la razón
exacta: hay cuentas que son tarjeta de crédito. Sumar un saldo con un cupo produce un número que
no significa nada — ni patrimonio, ni liquidez, ni deuda. Diseño lo había ubicado en Resumen
(`A-2026-09-06`) precisamente porque con Ahorros retirada un total por tipo ya no tenía dónde
vivir; la respuesta no era moverlo sino que no existe mientras las cuentas no sean conmensurables.

**La franja de Obligaciones lleva dos cifras que no se suman.** La SS se le debe a un operador; la
retención debería estar reservada. Un total afirmaría una deuda que no existe, así que la franja
las pone lado a lado y ninguna las agrega.

**Una cifra por fila, y su color es el estado.** La fila tenía dos, y la grande era la equivocada:
un mes sin pagar mostraba **$0 en grande** con lo accionable pequeño y gris debajo. Ahora la lista
se lee por el borde derecho en vez de detenerse en doce badges. `partial` pasa a ser su propio
estado — el dato siempre estuvo, faltaba la etiqueta.

**La tab bar se minimiza, no desaparece.** 370×58 con 21 de margen en tres lados, y a 58×58 al
bajar: el mismo objeto encogiéndose. Una barra que se va deja al usuario sin saber si volverá.

## FOUND

**La página no scrollea; `<main>` sí.** Un listener en `window` habría producido una barra que
nunca se minimiza, sin error y sin síntoma en desarrollo. El scroll se lee del ref del contenedor.

**`Toast` y `UpdatePrompt` se posicionaban con una clase `.has-mobile-nav` que nadie ponía.** El
offset que los levantaba sobre la barra nunca aplicó, así que la barra podía tapar el mensaje que
estaba confirmando. Lo encontré construyendo la cápsula, no buscándolo.

**`border/subtle` era el más prominente de los dos bordes.** El nombre corría al revés. Un solo
consumidor, migrado a `border/emphasis`: una escalera que corre al revés se lee como una promesa.

**El artifact `visual-diff` no siempre trae capturas.** Cuando falta la baseline trae el render
crudo; cuando compara, trae el overlay rojo. Copié overlays como baselines **dos veces** — el 05 en
las cuatro oscuras y otra vez aquí. La cura que ahora sigo: borrar la baseline para que CI reporte
"no baseline", bajar el render crudo, y **abrir el PNG antes de commitearlo**. Cuatro de los ocho
commits de baselines de esta sesión existen sólo por eso.

**El activo de la tab bar pintaba con un token del sidebar** que resolvía a casi el mismo gris que
los inactivos: `rgb(51,65,85)` contra `rgb(51,65,85)`. Lo único que cargaba la selección no la
cargaba.

## NEEDS

Ninguno. Los tres NEEDS de los reportes retroactivos quedaron contestados en `A-2026-09-06` antes
de que los escribiera.
