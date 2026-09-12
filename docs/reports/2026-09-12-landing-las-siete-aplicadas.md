# 2026-09-12 (3) — Inbox: las siete brechas llegaron acuñadas y están aplicadas

Tercera corrida de Web. Entrada: `docs/inbox/web/A-2026-09-12-las-siete-brechas-*` (a `done/` en
este commit). Diseño acuñó las siete el mismo día que las pedí.

## HECHO

**La cuarentena del landing desapareció.** El bloque `§0` que llevaba once valores inventados
—escala display, ritmo, reveal, stagger— ya no existe. Lo que queda en su sitio es lo que la página
sí posee y Diseño confirmó que es suyo: el ancho de columna, el gutter, y **la interpolación entre
peldaños acuñados**. Cada `clamp` tiene sus dos extremos en tokens reales.

- `ts-display-{md,lg,xl}` (48/60/72, −1px): el `h1` mide 72 en escritorio y 48 en móvil.
- `spacing-64 → spacing-128` como ritmo de sección.
- `--motion-duration-reveal` (450) y `--motion-stagger-base` (50) en uso; el desfase pasó de un `70`
  que yo había elegido a `calc(var(--motion-stagger-base) * n)`.
- **El panel de marketing devuelve el peso a la sección de privacidad** sin el flash blanco en
  oscuro. Las tres cifras de Diseño replican exactas en mi markup y **en los dos temas**: 17.06 /
  6.96 / 9.88, fondo `rgb(15,23,42)` idéntico.
- `--marketing-accent-glow` + `--blur-xl`: una mancha cian detrás del hero, que es la pareja para la
  que se acuñaron. Cian decorativo, permitido en marketing y sólo ahí.

## FOUND

1. **Pedí tokens de espaciado y luego escribí los píxeles a mano.** El ritmo de sección salió como
   `clamp(64px, 9vw, 128px)` — los valores correctos, retecleados. Un token retecleado es el valor,
   no el token, y es exactamente la deriva contra la que monté el script del espejo. Sólo apareció
   al auditar **qué tokens de los que pedí estaban realmente consumidos**, que no es lo mismo que
   comprobar que existen. Corregido a `var(--spacing-64)` / `var(--spacing-128)`.
2. **El glow metía scroll horizontal al documento.** `blur(96px)` sangra ~96px fuera de su caja; el
   `overflow-x: hidden` del `body` lo tapaba, que es apoyarse en un parche. Se clipa en la propia
   sección con `overflow: clip` — no `hidden`, que la convertiría en contenedor de scroll.
   `scrollWidth` vuelve a 1185 sobre 1200 en ambos temas.
3. **`--marketing-accent-wash` tiene cero consumidores y lo dejé así.** Es `cyan/100` y vale igual en
   los dos temas: sobre el lienzo oscuro deja de ser un tinte y es un bloque claro — **el mismo modo
   de falla que acabamos de sacar de la sección de privacidad**. Diseño lo midió contra el canvas
   claro (1.07); contra el oscuro va en la dirección contraria. Devuelto como FYI, porque para la
   regla 11 el dato útil es ése y no mi opinión.

## VERIFICADO

`npm run build` ✓ · 145/145 ✓ · `validate-repo.mjs` sin fallos, **R9 incluida** (la regla nueva de
Diseño: 7 tokens con origen en `duration/*`, 0 emitidos sin `ms`) ✓ · espejo in sync tras regenerar
✓ · 0 entradas del landing en el precache ✓ · contraste del panel medido en claro y oscuro con la
página asentada ✓ · sin desbordamiento horizontal en ninguno de los dos temas ✓ · claro/oscuro ×
móvil/escritorio revisados ✓.

## NEEDS

1. **La migración a `/app` sigue siendo de Dev.** Es lo único que bloquea que el landing deje
   `/landing/` y su `noindex`.
2. **Las capturas de UI** de los seis bloques de funciones, vía `scripts/visual-regression.mjs`.
3. **Legal**, para el formulario de correo: sigue sin moverse (44 días, según el orquestador).
4. `2ec75c78` y `3b4afecc` son de **Diseño y están sin empujar** — no puede. Bajo ORCHESTRATION §1
   los barre Dev. Este commit tampoco está empujado: un push dispara el deploy y no me lo pidieron.
