# TASK — el flujo de cuentas está dibujado completo: 4 secciones, 36 frames

`Flow - Accounts` ahora tiene la misma forma que `Flow - Onboarding`: **Desktop y Mobile, claro y
oscuro**, cada uno con el camino feliz y siete casos límite.

## Los casos, y qué condición los dispara en tu código

| Frame | Condición |
|---|---|
| `· sin cuentas` | `accounts.length === 0` |
| `· siete cuentas` | el caso que mediste: a 412 la grilla ocupa dos filas |
| `· nombre largo` | `account.label` sin límite; trunca a 220px |
| `· sin movimientos` | sin asientos: ni ledger ni gráfica |
| `· un solo día` | **hay filas y NO hay gráfica** |
| `· tarjeta de crédito` | `balance ≤ 0`, chip de corte/pago |
| `· sin configurar` | `startingBalance` ausente |

## El que te va a importar: `un solo día`

Tu propio `AccountChart` exige **dos días distintos** para dibujar. Así que existe un estado real
donde el ledger tiene filas y la gráfica no puede existir. Está dibujado ahora porque, sin verlo,
"hay movimientos" y "hay gráfica" se implementan como la misma condición — y no lo son.

Cuando no hay datos suficientes se ocultan **tres** cosas juntas: `chart`, `chart-range` y el
`divider`. Un divisor que separa de nada es decorativo, y un rango sobre una gráfica ausente ofrece
filtrar la nada.

## Dos cambios de diseño que salieron de dibujarlo

**1 · La grilla del índice ENVUELVE.** Estaba en `NO_WRAP` con recorte: la séptima cuenta no se
veía. En CSS es el comportamiento por defecto de un `flex-wrap`, así que probablemente ya lo tienes
bien; el que estaba mal era el archivo.

**2 · En el índice no hay tarjeta seleccionada.** Con el flujo partido el índice es un selector del
que te vas: presionas y sales, y no queda panel al que una selección pueda referirse. Las doce
grillas están en `State=Default`.

`State=Selected` no se retira del componente —sirve el día que haya un picker donde eliges y te
quedas— pero **no lo implementes en el índice**. Un estado sin consumidor se implementa porque
existe, no porque haga falta.

## Copy de los vacíos

    sin cuentas       Aún no tienes cuentas
                      Agrega la primera para empezar a registrar movimientos.
    sin movimientos   Sin movimientos todavía
                      Los ingresos, gastos y transferencias de esta cuenta aparecerán aquí.

Los dos llevan acción, como manda `empty.html`: un vacío sin salida es un callejón.

POINTER: Figma `396:16108` (`Flow - Accounts`, 4 secciones);
design-system/docs/10-account-page.md §12.
