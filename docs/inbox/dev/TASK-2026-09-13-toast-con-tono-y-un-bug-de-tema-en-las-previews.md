# TASK — el toast dice de qué tipo es, y una preview que llevaba meses mintiendo

Alfredo pidió rediseñar el toast y el mensaje de sistema: «está muy básico, no hay color feedback».
Antes de dibujar nada medí de dónde salen los toasts, y ahí estaba el problema de verdad.

## 1 · Un canal, tres clases de mensaje, una sola apariencia

```
showToast('Ingreso registrado')          confirmación
showToast('Ingresa descripción y monto') validación que BLOQUEA el guardado
showToast('Sincronizado')                aviso del sistema
```

Las tres se ven idénticas: la misma píldora gris. Por eso se siente básico — no es que le falte
color, es que **el canal no lleva el tipo**.

`Toast` ahora tiene **`Tone = Success · Warning · Info`**, cada uno con su tinte, su glifo y texto
neutro. Lo que te toca: `showToast(msg)` pasa a `showToast(msg, tone)`, y el store guarda el tono
junto al mensaje. Los sitios de llamada ya dicen cuál es cuál — la lista de arriba sale de leerlos.

**El texto va en `fg/default`, no en el color del tono.** Medido: `fg/success` sobre
`bg/success-subtle` da **3.32** en claro, por debajo del 4.5:1 que pide un texto; `fg/default` sobre
el mismo tinte da **15.74**. El tono vive en la superficie y el glifo, donde aplica 3:1, y las
palabras se leen.

**Token nuevo: `--fg-warning-strong`.** `fg/warning` sobre su propio tinte mide **2.86** — no llega
ni al 3:1 de un gráfico. Era el único tono cuyo icono no se veía sobre su propia superficie. El
peldaño nuevo mide 4.51 claro / 10.39 oscuro, y es la misma forma que ya tenían
`fg/danger-strong`, `fg/income-strong` y `fg/expense-strong`.

**No hay tono Danger**, y es a propósito: ningún mensaje del código es un error de verdad — todos
los que suenan rojos son validaciones que el usuario puede corregir, o sea Warning. Además la
librería no tiene `circle-x`. Cuando aparezca un error real, el glifo y el tono entran juntos.

El glifo no es adorno: es lo que mantiene el significado fuera del color (1.4.1). `circle-check`,
`triangle-alert`, `info` — tres formas legibles en escala de grises.

## 2 · `SystemMessage`

`UpdatePrompt` pasa a ser un componente: misma píldora, mismo vocabulario de tintes, tono Info y su
botón real. La diferencia con el toast no es el aspecto, es si **espera respuesta**: el toast dura
2200ms y se va, este espera. Por eso va encima del toast en el orden de apilado.

Sin eje de tono todavía: un eje con un solo valor no es un eje.

## 3 · Y el hallazgo que no venía en el pedido

**Todas las previews oscuras de `design-system/components/` llevaban meses mostrando texto en modo
claro.**

Una custom property cuyo valor es `var(--otra)` se sustituye **donde se declara**, y lo que hereda
ya viene resuelto. Los 131 alias (`--foreground-*`, `--surface-*`) se declaraban sólo en el bloque
claro, así que cualquier subárbol que cambie de tema más abajo se queda con el valor claro.

**La app nunca lo vio**: `useTheme` pone `.dark` en `<html>`, el mismo elemento donde se declara el
alias, así que ahí resuelve bien. Las páginas generadas hacen `<div data-theme="dark">` — y ahí no.

El comentario en `build.py` decía que los alias «siguen a su reemplazo a oscuro sin una segunda
declaración». Cierto en uno de los dos lugares donde se usa el archivo, que es la peor clase de
cierto. Ahora se emiten en los dos bloques y hay **`R7`** en el validador: todo alias declarado en
claro tiene que estar en oscuro. Verificado que falla —le quité uno y lo reportó.

Para ti esto no cambia nada en runtime. Cambia que las capturas contra las que comparas ya no
mienten.

POINTER: Figma `1159:33015` (Toast), `1160:2180` (SystemMessage);
`src/components/ui/Toast.tsx`, `src/store/uiStore.ts` (`showToast`), `src/components/UpdatePrompt.tsx`;
`design-system/_build/validate-repo.mjs` (`R7`).
