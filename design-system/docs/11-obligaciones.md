# 11 — La página de obligaciones

Dibujada 2026-09-02 sobre lo que Dev construyó en `TributariasView.tsx`. **El contenido no cambia;
cambia qué cifra ocupa el lugar prominente.**

## La pregunta que la página contesta

`a5891717` lo dice bien: la vista del mes contesta *qué debo ahora*; esta contesta **¿estoy al
día?**, y eso no se lee un mes a la vez — la seguridad social se paga vencida y la retención se
acumula todo el año contra un solo pago.

Ese es el criterio con el que se juzga cada decisión de abajo.

## Lo que encontré, medido sobre el código

**1 · Las dos tarjetas contestaban al revés una de la otra.** Seguridad social encabezaba con
`totalPaid` (*"$X de $Y"*) y retención con `gap`. Misma pregunta, mismo sitio en la tarjeta,
cantidades opuestas. Quien escanea no aprende nada de la posición, que es justo lo que la posición
debería estar enseñando.

**2 · La página no tenía respuesta.** Eran dos tarjetas; el usuario tenía que combinarlas de
cabeza para saber si está al día.

**3 · La fila invertía la jerarquía justo donde importa.** El número grande era lo **pagado** y lo
que falta iba en la línea pequeña. En un mes pendiente eso pone la cifra accionable en el susurro:
julio mostraba **$ 0** grande y *faltan $ 1.284.000* pequeño.

**4 · El estado vivía solo en un badge.** Doce meses, doce badges que hay que leer uno por uno.

**5 · Retención decía lo mismo tres veces**: cabecera, barra y la línea `Faltante $X · Y% reservado`.

## Lo que se diseñó

### La franja de estado — y por qué son DOS cifras y no una

Arriba, una franja con lo que falta de cada obligación, lado a lado.

**No se suman, y esa es la decisión.** La seguridad social es dinero que se le debe a un operador
cada mes; la retención es dinero que **debería estar reservado**, no pagado. Un total único diría
que debes algo que todavía no debes — sería la clase de cifra que parece más útil y es menos
verdadera.

Cada una lleva su nota: `2 meses vencidos · mayo y julio` y `62% reservado de $ 9.080.000`.

### `ss-month-row` — una cifra por fila, y su tratamiento es el estado

    Pendiente · Parcial   lo que falta, en fg/tax
    Pagado                lo pagado, en fg/provision
    Aún no vence          lo causado, callado

La leyenda debajo la nombra — *faltan · pagado · causado* — así que el color nunca trabaja solo.

**El rail** es el estado visto antes de leerlo, y está presente en los cuatro estados, incluido el
neutro, para que la columna de etiquetas empiece en la misma x en toda la lista. Un rail que
desaparece se lleva la alineación.

Tres portadores para un hecho — rail, badge y el color de la cifra — que es lo que pide 1.4.1 y
también lo que hace escaneable una lista de doce meses.

**El IBC aparece solo cuando un pago declaró una base distinta.** Es la regla que Dev ya había
escrito y se conserva: imprimir *IBC sugerido* en cada fila implicaría que hubo una elección donde
simplemente se aceptó la sugerencia.

## Lo que la construcción destapó

**`SectionCard` no tenía por dónde recibir contenido.** `content` era un frame dentro del
componente, y una instancia no admite agregar ni quitar hijos — así que cualquier pantalla con una
lista real tenía que desprender la tarjeta. Ahora `Content` es un slot, la misma forma que `Sheet`
y `LedgerContainer`. Lo destapó esta página, pero el defecto era del sistema.

**El sidebar del mock apuntaba a una navegación que ya no existe** (`Mes actual · Resumen anual ·
Cuentas · Configuración`). Con Ahorros retirada y Obligaciones como página propia, quedó
`Resumen · Mes · Cuentas · Obligaciones`. **Eso es una propuesta, no un hecho** — la navegación
real la decide Alfredo con Dev.

## Los casos

| Caso | Qué lo produce |
|---|---|
| `sin obligaciones` | ningún ingreso por servicios en el año |
| `todo al día` | todo liquidado — la página tiene que poder decirlo, y hoy no podía |
| `mes vencido` | lo que la página existe para sacar a la superficie |
| `base corregida` | un pago declaró un IBC distinto del sugerido |

`todo al día` es el que faltaba de verdad: sin él, una página que solo sabe hablar de deudas nunca
felicita a nadie.
