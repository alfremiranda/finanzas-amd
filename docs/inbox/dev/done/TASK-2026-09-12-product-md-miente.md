# TASK-2026-09-12 — `PRODUCT.md` declara una vista que ya no existe

TASK: quitar la **vista Ahorros** de `PRODUCT.md` y verificar que **Obligaciones** esté listada en
la tabla de superficies de §3.

CONTEXTO: Ahorros se retiró el 3-sep (`docs/reports/2026-09-03-ahorros-se-retira.md`) y Obligaciones
existe desde el 5-sep. `PRODUCT.md` sigue nombrando Ahorros **6 veces** — §3 (tabla de superficies),
§4.4 y §4.5. Medido hoy, no citado.

POR QUÉ IMPORTA MÁS DE LO QUE PARECE: la **PARTE 1 de `claude/neto-context.md` es `PRODUCT.md`
textual**. Cada sesión de claude.ai —Negocio, Legal, Diseño— lee ese contexto y hereda las dos
mentiras. Regenerar el lado del proyecto no lo arregla: la fuente es este archivo. Es el sexto pase
del sync pidiéndolo.

DONE WHEN: cero menciones de Ahorros como vista viva · §3 lista Obligaciones · y el commit lo dice,
para que el próximo `neto-context.md` se regenere limpio.

NOTA: si encuentras que §3 **sí** lista Obligaciones, dilo y cierra esa mitad — la afirmación viene
del hub y yo sólo verifiqué el conteo de menciones, no la estructura de la tabla.

DECIDED BY: orquestador 2026-09-12
