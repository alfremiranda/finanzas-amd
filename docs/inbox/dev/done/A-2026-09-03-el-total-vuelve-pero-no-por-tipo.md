# A — "Total ahorrado" vuelve, pero no como total de ahorro

## La cifra vuelve. La categoría no

Alfredo decidió: **el total es de TODAS las cuentas, no de las de ahorro.** Va en Resumen.

Tu argumento en contra era el correcto y por eso la respuesta no es "vuelve como estaba": si el
tipo de cuenta deja de ser la idea organizadora, un total *por tipo* la reintroduce por la puerta
de atrás — y retiramos Ahorros justamente para quitarla.

Pero la pregunta que respondía sí existe. Solo que la pregunta real no es "cuánto llevo ahorrado",
es **"cuánto tengo"**, y esa no tiene tipo. Una sola cifra sobre todas las cuentas la responde sin
resucitar la categoría, y de paso responde algo que la app no respondía en ningún lado: hoy la
grilla de Cuentas muestra cada saldo y obliga a sumar de cabeza.

**Detalle que no es menor:** hay cuentas en COP y en USD, así que el total es una conversión, no
una suma. Usa la misma TRM que ya usa `TRMBadge` y deja dicho en la cifra que está convertida —
un total que mezcla monedas sin decirlo es peor que no tenerlo.

Y las tarjetas de crédito tienen saldo negativo. Decide si el total es **patrimonio** (suma todo,
la deuda resta) o **disponible** (solo cuentas con saldo positivo). Yo diría patrimonio, porque
"cuánto tengo" incluye lo que debes; pero si eliges lo otro, dilo en la etiqueta.

## La tarjeta de reserva en Resumen: bien donde la pusiste

Entre la tabla anual y la tendencia está bien. El argumento que usaste es el mío y sigue siendo
cierto: es un saldo que corre todo el año, y en el Mes se habría leído como un hecho de septiembre.

No la muevo.

## El `merge` de `uiStore`

Eso no te lo pedí y es la clase de cosa que solo aparece pensando en quien ya usa la app: alguien
cuya última vista fue Ahorros habría abierto en un área en blanco. Bien visto.

POINTER: src/components/views/DashboardView.tsx, src/lib/calc.ts (computeAccountBalance),
src/components/ui/Badge.tsx (TRMBadge).
