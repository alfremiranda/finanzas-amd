# A-2026-09-12 — las tres anuales: §1 y §3 aplicados, §2 no, porque el argumento va al revés

## Lo aplicado

**§1 · Los seis literales.** Ya estaban hechos antes de que llegara el ticket —`92c7723c`— porque
los cuatro tokens habían entrado en `ceb87080`. `--chart-grid`, `--chart-highlight`,
`--chart-empty` y `--chart-average` se leen con `cssVar()` en las dos, y el ternario claro/oscuro
desapareció: el token ya trae el par. **`R1` se puede extender a `oklch()`/`rgb()`/`hsl()` ya.**

**§3a · Los meses vacíos se dibujan.** Tenías razón en las dos mitades: la rama del muñón era
inalcanzable porque `visibleData` filtraba antes. Ahora las escalas, las barras y los objetivos de
hover corren sobre los doce meses.

Con una separación que el arreglo obligó a hacer explícita: **el promedio conserva otra base.**
Sigue siendo el promedio de los meses *con datos*, no de doce. Dividir entre doce haría que un año
a medio usar reportara un gasto que nunca tuvo — y el dato ya se calculaba así, solo que la misma
variable servía para dos preguntas. Ahora se llama `monthsWithData` y sólo alimenta el promedio.

**§3b · La línea de promedio va encima.** Movida después del bucle de barras.

**§3c · El eje pierde el año cuando no cabe.** Lo implementé como medida y no como dispositivo: se
muestra el año mientras `xScale.step() >= 44`, que a 640 da 72 y a 346 da 36 — o sea exactamente
`feb … sep` en móvil, que es lo que mediste, pero se corrige solo si el layout cambia. El `label`
del dato conserva el año en los dos casos: es su identidad y el título del tooltip, y ahí sí cabe.

## §2 · No lo apliqué, y quiero que lo mires antes

Dices que apuntar las series a `chart/categorical/*` **«impide que una serie se separe de la card
que le corresponde»**. Hace lo contrario. Hoy la serie y la card leen **el mismo token**
(`--color-tax`), y eso es precisamente lo que las mantiene juntas: mover uno mueve los dos.
Apuntar la serie a otra familia es lo que permite que diverjan — si alguien recalibra `kpi/tax`
por contraste sobre la card, la serie «Obligaciones» y la card «Obligaciones» quedan de distinto
color **en la misma página**.

Verificado que hoy coinciden exactamente, los ocho valores: tax `#fbbf24`/`#fcd34d` = categorical-1,
provision `#059669`/`#34d399` = 2, expense `#ef4444`/`#f87171` = 3, net `#0e7490`/`#06b6d4` = 4.
Así que el cambio no mueve un pixel hoy; lo que cambia es a qué queda atado mañana.

Puede que la intención sea justo el desacople —una gráfica bebe de la rampa de gráficas, una card
de la de KPIs, y que hoy coincidan es coincidencia— y es un argumento defendible. Pero es el
argumento contrario al que escribiste, así que prefiero que lo confirmes a acuñarlo y revertirlo.

**Y una corrección de dato:** «el donut y `DistribucionCard` ya hablan ese vocabulario» no es así.
Ninguno de los dos usa `--chart-categorical-*`; `AnnualTable.tsx:125-128` y
`DistribucionCard.tsx:42-45` usan `--color-tax` / `--color-expense` / `--color-net`, igual que las
series. **Nada en `src/` referencia `chart/categorical/*` todavía.** O sea que no es alinear una
gráfica con dos componentes que ya migraron: es migrar los tres a la vez, y por eso importa más
cuál de los dos argumentos es el bueno.

Un detalle aparte: la serie de provisiones **no es un token fijo** — sale del color que el usuario
le puso a su deducción (`TrendChart.tsx:76`), con `--color-provision` sólo como respaldo. Si el
cambio entra, lo que cambia es el respaldo, no la serie.

## §4 y §5, recibidos

Los dos tooltips de la misma página: de acuerdo, y de acuerdo en que es de librería. Queda tuyo.

De `--bg-surface-*` migro los cinco sitios cuando pase por ahí, como dices.

POINTER: `src/components/annual/EgresosCategoryChart.tsx`, `src/components/annual/TrendChart.tsx`;
`src/components/annual/AnnualTable.tsx:125-128`; `src/components/cards/DistribucionCard.tsx:42-45`.
