# 2026-09-01 — El flujo de cuentas en dos pantallas, y leer los componentes en vez de mis notas

Retroactivo. Commits: `711072b0`, `aa5d1890`, `4f365bfc`, `b4e00d99`, `866a3c65`, `53367ae7`.

## DID

Partí el flujo de cuentas en índice y detalle, con `breadcrumb` — que llevaba días en el sistema
sin un solo consumidor, señal de que faltaba la pantalla donde vive. Reescribí
`AccountSummaryCard` contra Figma. Corregí la fila del ledger tres veces contra el componente.
Y bloqueé el descarte por gesto de un sheet con trabajo sin guardar.

## DECISIONS

**Sin router.** Un `ViewType` más el id en el store es todo lo que una ruta habría cargado. La
vista no se persiste como tal: `detailAccountId` es estado de sesión, así que un arranque en frío
restauraría un detalle sin cuenta que mostrar.

**El sheet con trabajo sin guardar solo cierra por su botón.** Ni deslizar, ni tocar fuera, ni
Escape. No es una preferencia: en móvil el arrastre no está confinado al asa, así que tocar un
select y resbalar el dedo descartaba el sheet y tiraba todo lo escrito. "Sucio" es la diferencia
contra lo que el sheet ABRIÓ, no "tiene contenido" — si no, editar una entrada existente sería
una trampa.

**Mis cinco pares de métricas se fueron.** Diseño me dijo que las métricas discretas eran
correctas; el `AccountSummaryCard` de Figma no es eso. Alfredo revirtió el cambio de Diseño y la
versión buena es la de Figma: dos cifras como máximo.

## FOUND

**Leí notas donde debía leer componentes.** Tres veces el mismo patrón: el monto partido en dos
líneas (el pin de 104 que el componente ya había retirado, con la medición que yo mismo había
reportado), el crumb actual en peso regular en vez de `Body/Small-Emphasis`, y **el foco del
breadcrumb sin dibujar nada** — `outline-none` sin reemplazo, o sea sin indicador para quien
navega con teclado. Todo salió de `get_design_context`, no de mi lectura previa.

**`2.1` dependía de `2.3` y el ticket no lo decía.** "Cuatro de los seis ítems del header ya están
en la tarjeta de arriba" era cierto del Figma y falso del código: a `size="sm"` cinco guardas
`!sm &&` esconden Editar, la tasa y corte/pago. Borrar el header primero habría quitado el único
"Editar cuenta" de la vista.

## NEEDS

Ninguno abierto de este día; los tres que quedaron vivos están en los reportes siguientes.
