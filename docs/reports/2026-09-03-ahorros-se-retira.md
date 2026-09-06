# 2026-09-03 — Ahorros se retira, y la prominencia sigue a la consecuencia

Retroactivo. Commits: `e656b844`, `f39fa91e`, `ef3be9ad`.

## DID

`RowActionsSheet` con las variantes del componente. La página de Ahorros retirada: las cuentas de
ahorro y los CDT viven en Cuentas como cualquier otra.

## DECISIONS

**Cancelar y Eliminar estaban invertidos.** Cancelar era lo único con borde y Eliminar lo más
callado — la salida dibujada más fuerte que la acción con consecuencia. Diseño marcó el riesgo y
lo mantengo escrito: esto es correcto para un menú abierto a propósito y discutible para uno
abierto por un mis-tap. Si molesta en uso, la corrección es darle borde a Cancelar, no apagar
Eliminar.

**La tarjeta de reserva se fue a Resumen, no al Mes.** La retención es un saldo que corre todo el
año; en el Mes una brecha anual se leería como un dato de septiembre.

**"Total ahorrado" se quedó fuera a propósito.** Respondía una pregunta distinta de la que
responde la grilla, pero volver a poner un total *por tipo* metería el tipo por la puerta de atrás
— que es justo lo que este cambio quita.

## FOUND

**La vista se persiste**, así que quien tuviera `'ahorros'` guardada habría abierto con el área
principal en blanco. Solo se ve desde el lado de quien ya usa la app. El `merge` de la
persistencia ahora la reasigna.

## NEEDS

- **Dónde vive "Total ahorrado", si es que vuelve.** Diseño y Alfredo. `Q-2026-09-02-ahorros`.
