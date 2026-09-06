# 2026-09-05 — Obligaciones tiene página y flujo propio, y un build que se instalaba sin servirse

Commits: `a5891717`, `9d6bdd35`, `418c2a1c`, `89726ae5`, `feff5bd9`, `5fddc4e2`.

## DID

El IBC pasa a ser un sugerido confirmable. Página de Obligaciones con la relación anual. El pago
de SS con su fila y su hoja dedicada. Y el service worker que nunca entregaba builds nuevos.

## DECISIONS

**El IBC se presenta como sugerencia, no como hecho.** La base facturada puede diferir —TRM del
día, costos transaccionales, corrección en la planilla— y un número que el usuario no puede
contradecir es uno que deja de creerse. El pago pregunta sobre qué base se hizo y lo guarda; la
SS se recalcula sobre esa base, **FSS incluido**, porque el fondo es un tramo del IBC.

**El pago de SS tiene hoja propia, no el sheet de gastos.** Pagar SS no es gastar: liquida un
período y lo que importa es la relación entre tres cifras —sugerida, sobre qué base, y lo que
realmente salió—. Un formulario de categoría y monto no puede mostrar eso.

**El pago congela la obligación.** Un pago es un hecho con fecha; lo que liquidó tiene que quedar
fijo ahí, o "pagado" es una afirmación que la app puede retirar sola.

## FOUND

**Un período pagado reabría cuando la TRM se movía.** Reportado por Alfredo. Corrijo su
diagnóstico en un punto: `useLiveTRM` nunca escribe en el store, así que no era la TRM "de hoy".
Era la obligación recalculándose en vivo — y como la TRM se escribe a mano y se corrige cuando
aterriza la transferencia, la cifra se movía debajo de un pago ya hecho.

**`registerType: 'prompt'` no significa "se aplica en el siguiente arranque"**, que es lo que el
comentario del registro afirmaba. El worker nuevo entra en `waiting` y se queda ahí hasta que
algo se lo pida. No había `onNeedRefresh` ni llamada a `updateSW`. **Cada build después del
primero se descargaba y jamás se servía**, y no había aviso porque no había ninguno conectado.
Los dos síntomas que Alfredo reportó, una sola causa.

**La PWA y el navegador no comparten worker**: una app instalada tiene su propio registro. Cada
una cruza el hueco una vez.

**Un pago parcial congelaba el saldo restante** en vez de la obligación completa, así que el mes
leía "pagado 4.899.605 de 2.899.605". Lo cazó el screenshot del desglose, no un test.

**Otro aviso transitivo (`fast-uri`, `qs`) congeló prod.** Tercera vez.

## NEEDS

- **`Progress` se quedó con un consumidor.** Su descripción justifica la primitiva con dos y cita
  la barra de cupo del `AccountSummaryCard`, que Figma no dibuja en ninguna de sus ocho variantes.
  Diseño y Alfredo. `Q-2026-09-02`.

## Sobre los cinco días sin reporte

El orquestador tiene razón y el costo fue real: tres decisiones que no eran mías llegaron a
Alfredo por el sync, cinco días tarde. Estos cuatro reportes son retroactivos.

Su `FOUND` también: **62 de los últimos 70 commits iban firmados `Neto Orchestrator (bridge)`
sobre `src/**`**. Verificado y corregido — `user.name`/`user.email` del repo ahora son
`Dev <dev@neto.local>`, por simetría con `Design <design@neto.local>`. Los 62 ya escritos quedan
mal atribuidos; reescribirlos cambiaría 62 hashes de una rama compartida, lo cual cuesta más de lo
que arregla.
