# A — el peldaño se movió, y `Progress` tenía un consumidor porque yo inventé el otro

Tres notas tuyas, tres respuestas. Empiezo por la que te desbloquea.

## 1. `bg/disabled` = `bg/surface`: era una CLASE, no tres sitios

Lo medí antes de tocar nada y era más grande de lo que reportaste. **Cinco tokens semánticos valían
exactamente `#f1f5f9`**, que es `bg/surface/default` — toda card de la app:

    bg/hover                bg/disabled            bg/neutral-subtle
    bg/account              category/other/surface

Cualquier cosa pintada con ellos sobre una card era invisible. Eso incluye un **hover de fila en
claro**, que nadie había reportado todavía.

**Los cinco son NEUTROS, y eso es lo que lo vuelve un peldaño.** Las once superficies de categoría
con color miden 1.01–1.06 contra la misma card y se quedan: se distinguen por **tono**. Un neutro
no tiene tono al que recurrir, así que o difiere en luminosidad o no está.

**Alfredo movió la familia: slate/100 → slate/200 en claro.** Firmado en `token-ledger.json` con
esa razón. `--bg-disabled` es ahora `#e2e8f0`.

**Devuelve el skeleton a `bg/disabled`.** Tu argumento de la spec era correcto — "está aquí pero
todavía no se puede usar" — y ahora el valor lo acompaña. Quita el `bg-muted`.

Nada nuevo que acuñar: `--progress-track` se queda como nombre del trabajo pero ahora **aliasa a
`bg/neutral-subtle`** en vez de apuntar al peldaño directo. Es lo que debe hacer un token de
componente.

**Lo que NO cambié, y te lo digo con el número:** en oscuro la colisión es más suave y sigue ahí —
`bg/neutral-subtle` es `#1e293b` contra una card de `#162032`, o sea **1.12:1**. Se ve, apenas.
Moverlo a slate/700 daría 1.58 y el relleno seguiría pasando 3:1. No lo toqué porque el defecto que
reportaste es de claro y mover oscuro es otra decisión. Está sobre la mesa de Alfredo.

## 2. `Progress` — tenías razón en preguntar, y el error era mío

El segundo consumidor **nunca existió**. La descripción decía que el `16% usado` de la tarjeta
estaba esperando una barra; el archivo no dibuja ninguna, en las ocho variantes, y lo muestra como
texto en la meta. **Esa barra la inventé yo.** Hiciste bien en quitarla y en no reinventarla.

Así que la salida es tu opción 2: **la barra no va, y la descripción era la que estaba mal.**
Corregida en Figma y en el paquete.

Queda con un consumidor. No la retiro por eso — la regla 11 es sobre si un nombre se gana su
existencia, y la barra de la reserva se lo gana — pero la afirmación falsa se fue. Si nunca llega
un segundo, eso lo decide el censo de uso, no una descripción.

## 3. `ui/sheet` — la descripción apunta al archivo equivocado

Tienes razón y es un hallazgo bueno. `sheet.html` describe "el panel en el que se abre todo
formulario" y ese panel es `SheetBase`, no el primitivo de shadcn que solo consume `ui/sidebar`.

**No lo arreglo con un renombre a ciegas.** Lo que documenta el sistema es el `Sheet` de Figma
—handle, header, close, `Content`, `Footer content`— y hay que decidir si ese contrato lo cumple
`SheetBase` o `ui/sheet`. Si es `SheetBase`, la descripción y el Code Connect apuntan ahí y
`ui/sheet` queda como infraestructura de `sidebar`. Lo dejo anotado para Alfredo; no toco el
archivo hasta que esté claro cuál de los dos es el componente del sistema.

## Lo demás de tu auditoría

- **`switch` 25% → 30% en oscuro:** correcto, gracias.
- **`Toast` sobre `--foreground` donde la spec dice `bg/inverse`:** mismo valor hoy, dos fuentes.
  Cámbialo a `bg/inverse` cuando pases por ahí; es exactamente el riesgo que citas.
- **`MetricCard` por `--muted`:** correcto por casualidad de alias, como dices. Déjalo y anótalo.
- **Las stories:** perfecto, y en particular las que documentan el caso que rompe. `Progress` a 0%
  ahora se ve, así que esa story cambia de significado: pasa de documentar un defecto a documentar
  el estado.

POINTER: design-system/tokens/tokens.css, design-system/_build/token-ledger.json
(acceptedValueChanges), design-system/components/progress.html, skeleton.html, sheet.html.
