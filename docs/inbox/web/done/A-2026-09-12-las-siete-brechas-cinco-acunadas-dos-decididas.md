# A-2026-09-12 — las siete: cinco acuñadas, dos decididas por Alfredo

Todo lo que sigue ya está en Figma y emitido. `git pull` y lo tienes en `tokens.css`.

Ninguno de estos valores lo inventé: cada uno sale de una rampa que el sistema ya tenía. Donde
eso no daba una respuesta, la pregunta subió a Alfredo en vez de resolverse sola.

## 1 · Escala display — `ts-display-{md,lg,xl}`

| clase | tamaño / interlineado | tracking |
|---|---|---|
| `.ts-display-xl` | 72 / 76 | −1 |
| `.ts-display-lg` | 60 / 64 | −1 |
| `.ts-display-md` | 48 / 52 | −1 |

**No son fluidos.** Un token no puede llevar un `clamp()` dentro: Figma guarda un número. Los tres
peldaños son las paradas; el `clamp()` entre ellos lo escribes tú en el landing —
`clamp(48px, 6vw, 72px)` cubre el rango con los extremos ya acuñados.

El interlineado se aprieta al subir (1.083 · 1.067 · 1.056), como el resto de la rampa.

**Una nota medida, no corregida:** `Heading/Display` (28) lleva tracking **+0.5**, que va al revés
de la rampa del producto (`Section` y `Subsection` en −0.25). Está en uso, así que no lo toqué. Los
display nacen en −1, que es donde debían estar.

**Y una trampa que encontré al acuñar:** `size/*` existe en **dos** colecciones — Typography y
Semantic — y las dos emiten a `--size-N`. Hoy los valores coinciden en los siete nombres que se
solapan, así que nadie lo ha notado. Si alguna vez cambian, uno pisa al otro en silencio. No lo
arreglé (es cirugía de nombres, no de landing); queda dicho.

## 2 · Ritmo de sección — `--spacing-96 · 128 · 160`

El tramo alto de la escala ya subía de 32 en 32 (`32 · 48 · 64`, y en primitivos `72 · 80 · 96`).
96 → 128 → 160 es ese mismo paso, no una invención. El producto sigue con techo en `spacing/64`.

## 3 · Reveal — `--motion-duration-reveal: 450ms` y `--motion-stagger-base: 50ms`

La rampa de duración va por **×1.5**: 100 · 150 · 200 · 300. El peldaño siguiente es **450**, y cae
dentro de los 400–600 que pediste. No elegí un número del rango: usé el que la rampa ya dictaba.

El stagger es **50ms** = mitad de `duration/100`. Es un desfase entre hermanos, no la duración de
nada. Seis elementos terminan de entrar en 450 + 250 = **700ms**, bajo el segundo donde una página
deja de sentirse viva.

`--motion-duration-slow` sigue siendo el techo **de la app**. Estos dos son de marketing.

> Este token salió primero como `--motion-stagger-base: 50px`. No rompía nada: un tiempo en píxeles
> no falla el build, sólo miente hasta que alguien lo usa en una transición y no pasa nada. La regla
> de emisión miraba el prefijo `motion/duration/` y el stagger es tiempo sin llamarse duration.
> Corregido, y **`R9`** ahora lo mide por origen y no por nombre: si un token resuelve a la rampa
> `duration/*`, tiene que salir en `ms`.

## 4 · Desenfoque — `--blur-sm · md · lg · xl` (8 · 20 · 48 · 96)

Los tres primeros son los desenfoques que las sombras de elevación ya usan (`raised`, `floating`,
`overlay`). El cuarto duplica: 96, el peldaño de hero. Escala derivada, no nueva.

## 5 · Las seis piezas: **viven en el landing** — decisión de Alfredo

Nav, footer, tarjeta de feature, strip de logos, captura de correo, FAQ: las construyes con tokens
del DS pero **no entran a Figma como componentes publicados**. La regla 11 se sostiene.

Si alguna aparece dos veces — el nav y el footer son las candidatas si el landing crece a varias
páginas — vuelve a pedirlas y las dibujo.

## 6 · Cian decorativo: **sí, sólo en marketing** — decisión de Alfredo

Familia nueva, con la frontera escrita en la descripción de cada token:

| token | valor | para qué |
|---|---|---|
| `--marketing-accent-wash` | `cyan/100` | tinte de sección |
| `--marketing-accent-glow` | `cyan/500` al 30% | mancha difuminada, va con `blur-lg`/`blur-xl` |
| `--marketing-accent-line` | `cyan/500` al 20% | filete y borde decorativo |
| `--marketing-accent-on-panel` | `cyan/400` | el único peldaño que se lee sobre el panel oscuro (9.88) |

**Dentro del producto el cian sigue reservado.** `design.md §Principios #4` no cambia: estos cuatro
existen para superficies de marketing y su descripción lo dice, para que el siguiente que los vea en
el picker no los suba a la app.

El `wash` apunta a `cyan/100` y no a `cyan/50` **porque lo medí**: el 50 contra
`bg/surface/canvas` da **1.01** — un tinte que no se ve no es un tinte. El 100 da 1.07, el mismo
rango que los tintes `bg/*-subtle` del producto (1.06–1.10).

## 7 · El panel oscuro — `--marketing-panel-*`

Tenías razón en el diagnóstico y en por qué `inverse` no servía. Un inverse dice *«lo contrario de
la página»*, y por eso en oscuro es blanco — correcto en una barra delgada, bomba de luz a todo lo
ancho.

Tres tokens nuevos que **valen lo mismo en los dos temas**. No es un descuido: es la definición.

| token | valor fijo | mide sobre el panel |
|---|---|---|
| `--marketing-panel-background` | `slate/900` `#0f172a` | — |
| `--marketing-panel-foreground` | `slate/50` | **17.06** |
| `--marketing-panel-foreground-subtle` | `slate/400` | **6.96** |
| `--marketing-accent-on-panel` | `cyan/400` | **9.88** |

`#0f172a` es exactamente lo que `bg/surface/inverse` ya vale en claro, así que en tema claro tu
sección no cambia de aspecto: lo único que cambia es que en oscuro deja de dar el flash.

La sección de privacidad puede recuperar su peso.

---

**Lo que NO te di, y por qué:** el `clamp()` fluido del punto 1. Los tokens son paradas; la
interpolación es del landing. Si prefieres que el DS publique también las clases fluidas, dilo y lo
miramos — pero entonces el DS empieza a tener opinión sobre el viewport, que hoy no tiene.

— Design
