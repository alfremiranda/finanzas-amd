# Q-2026-09-12 — El landing necesita seis cosas que el DS no tiene

De: **Web** (rol nuevo; ver `docs/inbox/orchestrator/Q-2026-09-12-el-landing-necesita-tres-decisiones.md`).

CONTEXTO: arrancó el landing de `netofinanzas.app` — página estática en `public/`, patrón
calculadoras, decidido por Alfredo hoy. Por `00-principles §A1` no invento ningún valor: estas seis
nacen en Figma o el landing se queda sin ellas.

MEDIDO, no supuesto (`design-system/tokens/tokens.css`):

1. **No hay escala display.** El techo es `.ts-heading-display` = 28/36 Bold (línea 843). Un hero
   pide 48–72 fluido → `ts-display-{xl,lg,md}`.
2. **No hay ritmo de sección.** `--spacing-*` termina en `64`. Marketing respira en 96/128/160.
3. **No hay duración de reveal.** `--motion-duration-slow` (300ms) es el techo **y no tiene un solo
   consumidor**. Un scroll-reveal vive en 400–600, y hace falta un token de *stagger*.
4. **Blur/spread sigue sin existir** — es tu propia nota en `TASK-2026-09-12-fase-4-los-graficos`.
   Cualquier glow o gradiente del hero lo necesita.
5. **Seis piezas de marketing** (nav, footer, tarjeta de feature, strip de logos, captura de correo,
   acordeón de FAQ): ¿entran al DS o viven sólo en el landing? Regla 11 pide dos consumidores y
   casi ninguna los va a tener. Tu criterio manda.
6. **El cian está reservado** (`design.md §Principios #4`: reservado a selected y focus ring, hover
   neutro). El CTA primario ya es legítimo — `Button` `default` usa
   `--button-filled-background-default`. Lo que pregunto es el cian **decorativo**: washes,
   gradientes, acentos de sección. ¿Regla explícita para superficies de marketing, o se quedan fuera?

ORDEN QUE ME SIRVE: 1 y 3 desbloquean el hero (W3 de mi secuencia); 2 va con ellas; 4, 5 y 6 pueden
llegar después sin frenarme.

NO BLOQUEA: mientras tanto el shell (W2) usa sólo tokens que ya existen.

---

**AÑADIDO el mismo día, al construir la sección de privacidad — la séptima brecha:**

`--bg-surface-inverse` hace bien su trabajo ("lo contrario de la página"), y por eso en oscuro es
**blanco**. Correcto para la barra de anuncio, que es delgada. **Bomba de luz** para una sección a
todo lo ancho — y me tocó justo en la que argumenta que Neto es calmado y privado. Un usuario
leyendo de noche recibe un flash blanco a mitad de scroll en la sección que le promete lo contrario.

Lo que la pieza pide es **un panel de marketing que siga siendo oscuro en los dos temas**, que es
otra cosa que un inverse. Mientras tanto la dejé en la banda tintada de la página, que se ve bien
pero pierde el peso que debería tener. ¿Token nuevo, o se queda sin panel oscuro?
