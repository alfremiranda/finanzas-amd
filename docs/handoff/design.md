# Handoff · Diseño

Última actualización: **2026-09-12**. Trabajo en vuelo al cierre de sesión.

## Lo primero, antes de cualquier commit

**Firma explícita en cada commit.** La VM puente comparte el clon con Dev y `.git/config` trae
`Dev <dev@neto.local>`. No lo cambies —es de Dev— y no confíes en heredarlo:

```
git -c user.name=Design -c user.email=design@neto.local commit ...
```

Sin esos dos flags el commit sale firmado como Dev. Ya pasó en los dos sentidos: 62 commits de Dev
firmados como el orquestador (06-sep) y dos míos firmados como Dev (07-sep, `18e0784e` y
`76fcc73e`). El orquestador decidió que se corrige hacia adelante, no se reescribe hacia atrás.

**Diseño no puede pushear.** `credential-osxkeychain` es un binario de macOS que no existe en la VM
de Linux donde corro; `git fetch` funciona (lectura anónima), `git push` no puede autenticar. Dev
barre. Cada cierre lista sus hashes con `unpushed:`, y **esa lista caduca en cuanto Dev barre** —
verifícala con `git log origin/main..HEAD` antes de salir a buscar nada.

## Lo que pasó esta semana (06 → 12 sep)

- **La tab bar móvil.** Cuatro pasadas. Primero la rediseñé sin que nadie me lo pidiera, Alfredo la
  revirtió, y después sí la rediseñó él con la HIG de Apple mandando: cápsula flotante de 370×58 con
  21 de margen a los lados y abajo, icono de 24, la tab activa en `fg/brand`, y `State=Minimized`
  (58×58, solo la tab actual) para el scroll. Componente `1122:8`.
- **`fg/brand` y `Detail/Large-Strong`.** Dos huecos reales: el sistema tenía `bg/brand` y
  `fg/on-brand` pero no la marca como color de texto, y los chips de meta de la cuenta llevaban
  Bold sobre un estilo Regular sin nada que lo respaldara.
- **El encabezado de la cuenta.** Seis diferencias medidas entre código y Figma, la peor el título a
  16 Medium donde Figma dice 20 SemiBold. Ticket abierto en `dev/`, lado de diseño cerrado.
- **`design.md` v6.** Once afirmaciones stale, cada una re-medida. Ver su changelog.
- **`R6` en el validador.** `emit-tokens.mjs` regenera todo tokens.json menos el array `text`, que
  se mantiene a mano — el único bloque del pipeline sin nada que lo comparara contra Figma. Había
  divergido: `Label/Base` valía 12 contra los 14 del volcado, así que `.ts-label-base` salía un
  punto corta a 16 sitios. Corregido, y `R6` compara los 27 estilos (peso, tamaño, interlínea,
  tracking). Verificado que falla antes de darlo por bueno.
- **El glifo de identidad lleva el matiz de la cuenta.** Era `purple/500` fijo, o sea dos cuentas
  distintas con el mismo encabezado. Lo preguntó Dev, lo decidió Alfredo.

## Cómo le respondo a Alfredo (2026-08-21)

Pocas palabras, frases concretas, sin explicación técnica. **Alfredo no es developer.**
Qué cambió y qué significa para la app — no cómo funciona por dentro. El detalle técnico va
a los docs, a los mensajes de commit y a la bandeja de Dev, no a la conversación.

## Dónde quedó el roadmap

`design-system/docs/20-roadmap.md`, seis fases. **Ahí está el estado, no aquí.** La tabla que este
handoff copiaba se quedó atrás dos veces; dos copias del mismo párrafo divergen y ninguna se ve mal
(`00-principles §A6e`).

Lo único que el roadmap no dice y hay que saber al abrir: su tabla *Where we actually are* trae las
cifras del 12-sep, pero **la familia `T*` no se ha re-medido desde el 20-ago** y sus valores viejos
se quitaron a propósito. Correr `audit-figma.js` es una sesión propia y es lo siguiente en la cola
de instrumentación.

## Fase 2: resuelto el 21-ago. Cómo quedó

**El bloqueo no era el volcado: `rename-map.json` apuntaba a nombres que la 1.2 retiró.**
Alfredo decidió que el CSS publicado sigue a Figma, así que la tabla de prefijos ya no existe.
**El nombre publicado es ahora función pura del nombre de Figma** (`--` + nombre, `/`→`-`) y
`token-ledger.json` guarda sólo lo que una función no puede saber. Contrato completo en
`design-system/docs/24-token-sync.md`; el auditor es `node design-system/_build/token-drift.mjs`
y **corre al abrir cada sesión, antes de tocar nada** (`00-principles §B6`).

Lo que queda medido, no estimado: **1 consumidor en `src/`** y **53 en `build.py`**. 120 alias,
75 de ellos ya retirables. Historia de por qué pasó:

El mapa se escribió el 19-ago contra `color/surface/*`, `color/foreground/*`, `color/income/*`.
La 1.2 renombró Semantic a property-first (`bg/*`, `fg/*`, `chart/*`). Resultado medido hoy con
`apply-rename-map.mjs --check`: **9 de 162 semánticos mapeados, 153 UNMAPPED** (el 17-ago eran 128
y **0**). `motion/` es el único prefijo que sobrevivió, y sobrevivió porque se añadió después.

La decisión está en `docs/reports/2026-08-21-exporter-etapa-1-fase-1.4-y-el-barrido.md §NEEDS 1`:
**(a)** el CSS publicado sigue a Figma (`--bg-*`, `--fg-*`; ~230 claves, migración en `src/`), o
**(b)** el mapa sigue traduciendo (cero trabajo en Dev, pero el paquete conserva
`--surface-wrap-*` y `--surface-popover`, los sustantivos de componente que Alfredo retiró).
Recomendación: **(a)**. No es mía la llamada.

Cuando esté decidida: reescribo los prefijos del mapa, Dev corre
`apply-rename-map.mjs --accept-changes` y `build.py` con los **20 CHANGED** a la vista. Los dos
diffs conocidos del 17 ya están resueltos — la estrella no aparece (Figma y repo coinciden en
`#b45309`) y `--sidebar-surface` va a `#ffffff`.

## Cómo se corre la etapa 1 (no es obvio, y por eso llevaba sin correrse)

Es una operación a dos manos: `figma-dump.js` corre **dentro del sandbox de Figma** (sin sistema de
archivos), `apply-rename-map.mjs` corre **local**. El relevo entre ambas no tenía dueño; ahora es de
Diseño y está escrito:

1. `use_figma` con el cuerpo de `figma-dump.js`, **por trozos**. El tope de 20 kB de la respuesta
   **no lanza error: corta**. Por eso el volcado del 17 tenía 220 filas y parecía completo.
2. Cada trozo se escribe verbatim a `_build/dump-parts/*.tsv`.
3. `python3 design-system/_build/assemble-dump.py` — aborta si una colección no trae exactamente
   162 / 41 / 177 / 351 filas. Es el único punto donde un trozo perdido falla ruidosamente.
4. El volcado publica **dos esquemas a propósito**: `variables` (registro verbatim, cuatro
   colecciones, tipos, alias, valor por modo) y `chunks` (la forma que la etapa 2 ya parsea).
   `chunks` lleva **sólo Semantic y Component**: la etapa 2 trata todo lo que no es Semantic como
   Component, y darle Typography o Primitives crearía 392 claves `--cmp-*` que nadie pidió.
5. **Los alias se siguen por NOMBRE de modo, nunca por índice.** Seguirlos por el modo por defecto
   del destino dejó 19 de 92 tokens de Component mal, y los otros 73 bien — un volcado a medias se
   lee como un desacuerdo de valor, no como un bug.

## Lo que un relevo tiene que saber antes de tocar Figma

- **`00-principles §B4` no es ceremonia.** Una pasada fría sub-reporta ~60% sin lanzar error.
  Ningún número se escribe si dos pasadas no coinciden.
- **`§A6` tampoco.** Cinco fallos de instrumento este mes, todos la misma forma: **muestrear un
  miembro y hablar por el conjunto.** `TEXT` por foreground · una coincidencia de cadena por un
  nombre de componente · un componente por los consumidores de un token · **una variante por una
  propiedad** (casi borra `SavingsCard :: Show Maturity`, vivo en `Type=CDT`) · una pasada por un
  conteo de archivo. Antes de un paso irreversible, la comprobación corre contra **todos** los
  miembros.
- **Los guards de borrado abortan, no avisan.** Tres veces evitaron daño real.
- **Un chequeo de tokens no reemplaza una captura.** `showShadowBehindNode` viene en `true`.
  Dos bugs de render de `doc: Field` los cazó una captura, no las propiedades.
- **`§A4` tiene cuatro cláusulas.** Un componente nuevo no está hecho hasta que pasa la auditoría,
  **vive dentro de su contenedor**, tiene marco `doc:` y el header está recomputado. Regla de
  Alfredo, y ya se rompió una vez (`Field` suelto al fondo de su página).
- **El ancho de borde se enlaza como cuatro claves por lado**, no como `strokeWeight`.
- **`_docs-kit` no es parte del sistema de diseño.** Es andamiaje de una skill de Alfredo.
- **El contenido de muestra con marcas es deliberado y correcto.** `§A3.8`. Sólo los placeholders
  son genéricos. Los ~390 nodos con marca fuera de onboarding no son un defecto que arreglar.

## Lo que espera decisión

| qué | de quién | dónde |
|---|---|---|
| tintar `AccountGlyph` con el matiz de la cuenta, y matar el token en cuarentena | Dev | `A-2026-09-12-label-base-el-glifo-y-la-estrella` §2 |
| la estrella de la grilla a 20 | Dev | misma nota §3 |
| **Fase 4: los tres gráficos anuales y la barra de distribución** | mío, ticket del 12-sep | `TASK-2026-09-12-fase-4-los-graficos` |
| los dos flujos redibujados (Cuentas, Obligaciones) y los tokens que se movieron | Dev | `TASK-2026-09-03-lo-que-hay-que-traer-al-codigo` |
| `Frame 1` en `Components · Forms` (30 instancias de `Input` suyas) | Alfredo | pendiente desde el 20-ago |
| migrar los nombres viejos a su ritmo | Dev | `token-drift.mjs` → RETIRABLE |
| Storybook | sigue bloqueado | `6afa685e` |

**Decidido y cerrado desde el handoff anterior:** el espacio de nombres del CSS publicado (sigue a
Figma), los ocho `--account-{1..4}-*` (mueren; el color es elección del usuario), la fila
`destructive` del mapa, el peldaño de `bg/disabled` (sube la familia entera), «Total ahorrado» (se
queda fuera: hay cuentas que son tarjeta de crédito y un cupo no es dinero que se tiene), y
`Progress` (un solo consumidor; el segundo lo había inventado yo).

## Mi propia cola (no bloquea a Dev)

Medido y ofrecido, sin aplicar — cada uno espera una decisión que no es mía o una sesión propia:

- **Los neutros colisionan en oscuro a 1.12:1.** Medido, ofrecido, no aplicado.
- **`bg/subtle` = `bg/floating`**, `bg/expense-subtle` = `bg/danger-subtlest`, `bg/sunken` con el
  valor de `border/emphasis`, y `fg/subtle` / `fg/neutral` colapsan en oscuro. Cuatro pares que
  valen lo mismo a propósito o por descuido; no lo sé todavía.
- **El registro diverge de Figma en 39 de 89 descripciones, en los dos sentidos.** `20-roadmap
  §5.1b`: fusionar primero, generar después. Generar ahora borra trabajo bueno.
- **`sheet.html` documenta `ui/sheet` y el panel real de la app es `SheetBase`.** Abierto para
  Alfredo.
- **La familia `T*` sin re-medir desde el 20-ago.** `audit-figma.js`, sesión propia.
- **La estrella de la grilla es un botón en código y una marca estática en Figma.** La misma acción
  dibujada de dos formas. Defecto mío; si la ficha pasa a llevar `Favorite`, se le avisa a Dev
  antes.
- **`--account-summary-card-icon-foreground` en cuarentena.** Retirado de Figma, congelado en
  `pending` porque `AccountSummaryCard.tsx:111` lo consume. Muere con el cambio de Dev.
- **`audit-figma.js` llegó a `C12`.** Los cuatro últimos salieron de esta semana: heading a ancho
  fijo (`C9`), spec del doc contra su componente (`C10`), entidad HTML en una descripción (`C11`),
  borde de un solo lado en una forma redonda (`C12`).

Tres respuestas del orquestador de agosto siguen en la bandeja **a propósito**: archivarlas habría
sido falso.

- `A-2026-08-19-elevacion-ejecutada` — falta `C7` (el equivalente de `C1` para efectos) y el peldaño
  de elevación en Login / Bienvenida / Listo.
- `A-2026-08-19-tone-action-chip-c5-c6` — `action-chip` acuñó 3 de sus 6 vinculaciones prestadas;
  `C5` y `C6` no están en `audit-figma.js`.
- `A-2026-08-20-count-16-y-currency` — `currency/*` sigue en Component, aprobado su ascenso a Semantic.

## La lección que más caro salió esta semana

**Un componente que dibujó otro es suyo.** Dos veces reemplacé un dibujo de Alfredo por uno mío y
lo reporté como hecho: el `AccountSummaryCard` y la tab bar. Los dos eran defendibles y los dos se
revirtieron. Mantener el sistema honesto es mío —tokens que resuelven, rampas que suben, docs que
coinciden con su componente, chequeos que cazan la clase y no el sitio—; **decidir qué dibuja la
cosa es de él.** Cuando el pedido toca lo segundo, el entregable es una propuesta que pueda ver, no
un componente ya cambiado. Escrito en `00-principles §A6g`, con sus dos corolarios: anotar una
propiedad sin su valor no es anotarla, y una cita no es una orden.
