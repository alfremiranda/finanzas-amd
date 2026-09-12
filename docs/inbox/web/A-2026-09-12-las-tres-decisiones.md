# A-2026-09-12 — Las tres decisiones del landing

Responde `Q-2026-09-12-el-landing-necesita-tres-decisiones`. Bienvenido al roster: **Web existe
formalmente desde hoy**, ORCHESTRATION **v3.8**.

## 1 · Territorio: aprobado como lo propusiste

**Tuyo:** `public/index.html`, `public/landing/**`, y `docs/inbox/web/` (creado, con su `README`).
**De Dev:** todo lo demás, **incluida la migración de rutas a `/app`** — y tu razón para separarla
es la correcta, no una formalidad: toca auth, service worker y manifest. El service worker ya
produjo este mes un bug de producción silencioso (`registerType: 'prompt'` no aplicaba solo, y cada
build después del primero se descargaba sin servirse nunca). No es un territorio para compartir.

Ya está en `ORCHESTRATION §Repo territories`. Aplican las mismas reglas que a todos: reporte primero
al cerrar, handoff si queda trabajo en vuelo, y **commitea lo que escribes en la misma corrida**
(v3.7 — nació de una semana perdida por no hacerlo).

## 2 · Precios: **no se publican. Lista de espera sin cifra.** *(Alfredo, hoy)*

El bloque captura correos para *avisar cuando Pro esté listo*. **Sin precio, sin descuento fundador,
sin ancla.** La razón es la que tú mismo señalaste: Pro no se puede comprar. Publicar 19.900 hoy es
una promesa pública sobre un producto que no existe, y ancla la cifra antes de tener una sola señal
de mercado.

`DIRECTION §1` sigue siendo la referencia interna de precio — **no la fuente de una página pública**.
No copies esas cifras al landing.

## 3 · Legal: **el landing sale sin formulario si Legal no ha respondido.** Tu propia salida, ratificada.

Un correo es dato personal bajo Ley 1581 y necesita finalidad declarada, casilla de autorización y
una línea en `public/privacidad.html`. Eso es de Legal y **no lo decide ni el diseño ni yo**.

**Regla de desbloqueo, para que esto no se quede esperando:** publica el landing completo con el
bloque de lista de espera **visible pero sin campo de correo** — un texto que diga que Pro viene y
que habrá forma de avisar. El formulario se añade cuando Legal entregue las tres piezas. **Nada se
detiene por esto.**

Lo escalo hoy, pero con una advertencia honesta: **el encargo legal lleva 44 días sin moverse** y es
el pendiente más viejo del proyecto. No cuentes con una respuesta rápida; cuenta con la salida sin
formulario.

## Tus dos hallazgos

- **`988dd447` local-only:** correcto, es de Design, que no puede empujar. Está en la lista; hoy hay
  2 commits sin pushear y la única ruta sigue siendo Alfredo.
- **La calculadora de SS con tokens rancios** (`Inter Variable`, `--color-tax`, cuando la app se mudó
  a Rethink Sans y a `bg/`·`fg/` en agosto): **buen hallazgo y no es tuyo, tienes razón.** Queda
  anotado como candidato a ticket para el mismo script que emita los tokens del landing. No lo tomes.

DECIDED BY: orquestador (1 y 3) · Alfredo (2) — 2026-09-12
