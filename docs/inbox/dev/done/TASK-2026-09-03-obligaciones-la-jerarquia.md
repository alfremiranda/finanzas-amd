# TASK — obligaciones: la jerarquía, no el contenido

Alfredo pidió revisar el flujo que construiste. **Lo que hiciste está bien de contenido y de
comportamiento**; lo que cambia es qué cifra ocupa el lugar prominente. Dibujado en
`Flow - Obligaciones`: 4 secciones, escritorio y móvil, claro y oscuro, 5 frames cada una.

## Los cinco problemas, medidos sobre tu código

1. **Las dos tarjetas contestan al revés una de la otra.** SS encabeza con `totalPaid`
   (`"$X de $Y"`), retención con `gap`. Misma pregunta, mismo sitio, cantidades opuestas.
2. **La página no tiene respuesta propia**: son dos tarjetas y el usuario las combina de cabeza.
3. **La fila invierte la jerarquía donde importa.** `ts-amount-base` es `r.paid` y `faltan X` va en
   `ts-amount-micro`. En un mes pendiente la cifra accionable es la pequeña — julio muestra **$ 0**
   grande.
4. **El estado vive solo en el badge.** Doce meses, doce badges que leer.
5. **Retención dice lo mismo tres veces**: cabecera, `Progress` y `Faltante X · Y% reservado`.

## Lo que hay que construir

### 1 · Una franja de estado arriba, con DOS cifras

    SEGURIDAD SOCIAL          │  RETENCIÓN 2026
    $ 2.148.000               │  $ 3.450.000
    2 meses vencidos · …      │  62% reservado de $ 9.080.000

**No las sumes.** SS es dinero que se debe a un operador; retención es dinero que debería estar
*reservado*. Un total único afirmaría una deuda que no existe. En móvil se apilan.

La nota de SS cuenta meses vencidos (`r.due && isOutstanding(...)`), no pesos.

### 2 · `ss-month-row`: una cifra por fila

| Estado | Cifra | Color | Leyenda |
|---|---|---|---|
| `Upcoming` | causado | `fg/subtle` | causado |
| `Pending` | **lo que falta** | `fg/tax` | faltan |
| `Partial` | **lo que falta** | `fg/tax` | faltan |
| `Settled` | pagado | `fg/provision` | pagado |

Más un **rail** de 3px a la izquierda: `bg/tax` abierto, `bg/provision` liquidado,
`border/default` no vencido. **Presente en los cuatro** — si desaparece en uno, la columna de
etiquetas se desalinea en toda la lista.

`Partial` es un estado nuevo y ya lo tienes en datos: hoy `isOutstanding` lo mete en `Pendiente`.

El IBC sigue tu regla: solo cuando un pago declaró una base distinta.

### 3 · Retención pierde la línea duplicada

Quedan `Causado en el año`, `Reservado`, la barra, y `Faltante por reservar` como par
etiqueta/valor. Fuera el `Faltante X · Y% reservado`, que repetía cabecera y barra.

La lista de acumulado por mes **no está en el dibujo**: contesta "de dónde salió", que es otra
pregunta. Si la quieres, va detrás de un disclosure.

## Dos cosas que destapó y que no son de esta página

**`SectionCard` no tenía slot.** `content` era un frame interno y una instancia no admite
agregar ni quitar hijos, así que ninguna pantalla podía componer una lista real dentro. Ya tiene
`Content` como slot, igual que `Sheet`.

**El sidebar del mock apuntaba a una navegación que ya no existe.** Lo dejé como
`Resumen · Mes · Cuentas · Obligaciones`. **Es una propuesta, no una decisión** — dime si la
navegación real es otra y lo corrijo.

POINTER: Figma `Flow - Obligaciones`; `1091:842` (`ss-month-row`), `324:1300` (SectionCard con slot);
design-system/docs/11-obligaciones.md; src/components/views/TributariasView.tsx.
