# A-2026-09-12 — los tres puntos del FYI del 07, y qué quedó medido

## 1 · La firma: explícita en cada commit, no en la config

No se puede arreglar en `.git/config`: la VM puente comparte el clon con Dev y esa config es de él.
Cualquier cosa que ponga ahí le firma a Dev como Design. Así que la regla es por commit y quedó
escrita como lo primero del handoff:

```
git -c user.name=Design -c user.email=design@neto.local commit ...
```

Este commit ya va firmado así. `18e0784e` y `76fcc73e` se quedan como están, según tu criterio de
corregir hacia adelante.

## 2 · El handoff: reescrito

`docs/handoff/design.md` estaba fechado 01-sep. Ahora trae la semana del 06 al 12, la regla de
firma arriba, la cola real y la lección que más caro salió (dos veces reemplacé un dibujo de
Alfredo por uno mío; los dos se revirtieron — `00-principles §A6g`).

**Le quité la tabla del roadmap.** Era una segunda copia de `20-roadmap.md` y se quedó atrás dos
veces; ahora apunta. Es la misma razón por la que existe `§A6e`.

## 3 · `design.md`: v6, once afirmaciones re-medidas

42 días y el doc de ámbito describía un sistema que ya no era. No lo actualicé de memoria: cada
cifra salió de Figma o del repo. Las once:

| decía | mide |
|---|---|
| los imports de tokens «no están cableados» | **sí lo están**, `index.css` 8–9, y `R4` falla si vuelve a declarar color |
| `Badge` con variantes `arq` · `toptal` · `bancol` · `otro` | **no existen**; es `tone` × `variant`, y el color va en la cuenta |
| «las cifras usan `font-heading`» | **retirado**; 0 consumidores, y este doc era el último |
| `--n-txt3`, `--color-account-{type}-bg` | no existen |
| tabla de nodos = layouts y sidebars | eran **frames de exploración** e instancias dentro; `2:34` es *Neto - Desktop (Light)* |
| `Detail/` Large 11 · Base 10 · Emphasis 10 · Nano 9 | **12 · 11 · 11 · 10** — los cuatro un peldaño abajo |
| 26 estilos de texto | **27** |
| 15 categorías de egreso | **14**; `category/savings/*` es una rampa que no es categoría |
| KPI padding `p-[17px]` | **16** (`p-4`) |
| `Amount/Hero` 20px | **28** |
| `Heading/Group` 14px · radio del item del sidebar 12px | **16** y **16** |

Añadido: la tab bar móvil (no estaba), movimiento como tokens en vez de ms literales —`R5` ya falla
sobre un literal—, y `-Strong` como el peldaño sobre `-Emphasis`.

**Y dije qué no verifiqué**, en el changelog: la regla de categorías en oscuro (`-950` / `-300` con
`connectivity` y `other` como excepciones) y las medidas de ancho tabular siguen tal cual desde v5.

## De paso, `20-roadmap.md`

Su tabla *Where we actually are* estaba fechada 20-ago y decía cosas que ya no: «el exporter nunca
ha corrido», «nada corre el validador». Actualizada con lo del 12-sep (795 variables, 27 estilos,
90 componentes, validador verde). **Las filas de la familia `T*` las quité en vez de arrastrarlas**:
necesitan `audit-figma.js` y eso es una sesión propia. Un número de hace tres semanas presentado
como actual es peor que ningún número.

POINTER: `design.md` §changelog v6; `docs/handoff/design.md`; `design-system/docs/20-roadmap.md`
§Where we actually are; `design-system/docs/00-principles.md` §A6g.
