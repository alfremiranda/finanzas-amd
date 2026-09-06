# 2026-09-02 — La librería auditada contra Figma, el README, y d3 sin el paraguas

Retroactivo. Commits: `e267c0b3`, `1f6a06ce`, `ddd60304`, `3f9b285e`, `4fe9cc8c`, `08d1d89b`,
`777afa72`, `8f2df9ab`, `e803acf4`, `4cc6398c`, `ca7feb05`, `5bded3d8`.

## DID

Auditoría de los 37 componentes de `components/ui` contra Figma y stories con criterios de
aceptación para los 19 que no tenían. El README del repo. Y las gráficas a submódulos de d3 con
una capa compartida.

## DECISIONS

**No cambiar a Highcharts / Nivo / ECharts.** Alfredo preguntó; la respuesta no es "d3 está bien"
sino que estas gráficas cargan requisitos contra los que una librería pelea: cada color sale de
los tokens del sistema y el tooltip tiene que ser la burbuja invertida de la app —un objeto, un
sitio— y las tres librerías traen el suyo. El comportamiento que más costó (arrastre táctil que
mantiene la selección, el punto alimentando los metrics, un punto por día) viviría igual encima.
Highcharts además no es libre para uso comercial. Lo que sí hice fue quitar el paquete paraguas y
extraer las 3 cosas duplicadas.

**El README va en inglés** aunque el producto sea para Colombia: la audiencia del repo no es la
del producto. Y la sección "Not yet" se queda — nombrar los propios huecos con precisión se lee
como madurez.

## FOUND

**`bg/disabled` vale lo mismo que `bg/surface`** (`#f1f5f9`), o sea toda card. La spec del
skeleton pide ese token; lo implementé, lo medí, y el placeholder desaparecía. Revertido a lo que
se ve. **Tercera aparición del mismo peldaño** — `--progress-track` se acuñó el día anterior por
esta colisión exacta.

**`ui/sheet` no lo importa nadie.** Está documentado como "el panel en el que se abre todo
formulario"; el panel real es `SheetBase`.

**Dos cosas del borrador del README no sobrevivieron a la verificación**: describía CI como una
cosa cuando son tres, y le atribuía al chequeo de movimiento el rechazo de duraciones literales,
que es del validador. Y "kept in sync with Figma" se quedaba corto: `design-system/` está
*generado*.

**`npm run visual -- --update` reescribió 298 de 320 baselines** porque esta máquina renderiza el
texto distinto que el runner. Commitear eso habría roto la comparación para siempre. Las
baselines tienen que venir del mismo sitio que las verifica.

**Un aviso transitivo (`browserslist`) congeló prod** sin que nadie tocara el repo. Segunda vez
en la semana.

## NEEDS

- **`bg/disabled` sube un peldaño, o el skeleton acuña el suyo.** Diseño y Alfredo. `Q-2026-09-02`.
