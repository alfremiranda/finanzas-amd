# TASK — cinco arreglos a las rampas semánticas

Alfredo pidió revisar las variables semánticas y arreglar jerarquía y propósito. Los cinco son
cambios de **valor o de nombre**, ninguno de estructura. Acoplamiento medido antes de tocar:
`--border-default` tiene 215 consumidores, todo lo demás de esta lista tiene 0 o 1 en código y
0 o 1 en la colección Component. Por eso se pudo mover.

## 1 · La escalera de interacción no tenía tres escalones

`bg/hover` y `bg/active` valían **ambos slate/200** en claro. Presionar una fila se veía igual que
apuntarla; la diferencia solo existía en oscuro.

    surface → hover → active     slate/100 · 200 · 300      (claro)
                                 slate/850 · 700 · 600      (oscuro)

`--bg-active` cambió a `#cbd5e1`.

## 2 · El placeholder no era legible y el disabled sí — al revés de la regla

`fg/disabled` **aliaseaba** a `fg/placeholder`, o sea un solo valor para dos trabajos que la norma
trata en direcciones opuestas:

- **placeholder** es contenido: el usuario tiene que leerlo para saber qué pide el campo. 1.4.3
  aplica. Medía **2.54:1** sobre un input. Ahora **4.71:1** (slate/500 claro, slate/400 oscuro).
- **disabled** es un componente inactivo y **está exento** de 1.4.3. Se quedó en el escalón
  apagado (slate/400 claro, slate/500 oscuro), que es el que tenía placeholder.

Intercambiaron escalón. `--fg-disabled` no cambia de valor; ahora tiene el suyo en vez de heredarlo.

**Efecto para ti:** un campo deshabilitado con un valor real ya no se ve igual que uno vacío.

## 3 · Seleccionado e información eran el mismo color

`bg/selected` y `bg/info-subtle` eran los dos sky/100. Una fila seleccionada y un aviso informativo
eran indistinguibles, y no había forma de mostrar una fila seleccionada dentro de un aviso.

`bg/selected` pasa a **tinte de marca** (`bg/brand-alpha-10` claro / `-20` oscuro). La selección es
la marca respondiendo; la información es sky.

## 4 · La escalera de peligro corría al revés en oscuro

`fg/danger` y `fg/danger-strong` eran el mismo valor en claro, y en oscuro **strong era más apagado
que danger**. Ahora la escalera va en la misma dirección en los dos temas:

    claro    red/600 · 700 · 800
    oscuro   red/400 · 300 · 200

## 5 · `border/subtle` → `border/emphasis`

Medido contra la card: `default` **1.13:1**, `subtle` **1.36:1**. Lo llamado *subtle* era el **más**
prominente de los dos. Una escalera de prominencia que corre al revés es peor que no tenerla,
porque se lee como una promesa.

**No moví el valor, moví el nombre** — `default` tiene 215 consumidores y `subtle` tenía uno.

    default → emphasis → strong     1.13 · 1.36 · 4.34

**No hay escalón más callado que `default` y es a propósito:** un borde más tenue que slate/200
sobre una card slate/100 no es un borde sutil, es un borde ausente — lo mismo que dejó invisibles a
cinco rellenos neutros esta semana.

`--border-subtle` queda como alias de `--border-emphasis` en el ledger, así que no se rompe nada;
migra el único consumidor cuando pases por ahí.

## Lo que encontré y NO toqué

- **`bg/subtle` = `bg/floating`** (los dos slate/20 en claro). Distinto trabajo, mismo valor.
- **`bg/expense-subtle` = `bg/danger-subtlest`** (red/50). Puede ser deliberado — gasto y peligro
  comparten familia — pero son dos nombres para un valor.
- **`bg/sunken` = el valor de `border/emphasis`** (slate/300).
- **`fg/subtle` y `fg/neutral` colapsan en oscuro** (los dos slate/300); en claro sí se separan.
- **En oscuro los neutros siguen colisionando** con la card a 1.12:1, más suave que el 1.00 de
  claro pero ahí.

Ninguno tiene consecuencia funcional demostrada todavía, así que los dejo medidos y no los muevo.

POINTER: design-system/tokens/tokens.css, design-system/_build/token-ledger.json
(5 firmas + 1 alias), design-system/foundations/colors.html.
