# Imágenes del landing

> Vive en `docs/` y no dentro de `public/landing/images/`, que es donde se dejan los archivos:
> Vite copia `public/` entero a `dist/`, así que un README ahí se publicaría en
> `netofinanzas.app/landing/images/README.md`. Notas internas de proceso en el dominio de
> marketing.

Imágenes del landing. Las genera Alfredo (Gemini / ChatGPT / Midjourney) y las deja aquí con el
**nombre exacto** de la tabla — el CSS ya apunta a esas rutas, así que basta con soltar el archivo.

**Suelta el original tal cual te lo dé el generador** (PNG, JPG, lo que sea) y corre:

```
node scripts/landing-image.mjs <original> <nombre>.webp
```

Esa es la pieza que faltaba la primera vez: esta máquina no tiene `cwebp`, ni ImageMagick, ni
`sharp`, ni PIL, y el `sips` de macOS no escribe webp. El script usa el Chromium de Playwright —
que ya está instalado para la regresión visual— como codificador. Pedir webp sin dar cómo hacerlo
era pedir PNG.

Después **mueve el original fuera de `public/`**, a `~/Projects/Neto/assets/landing/`. Vite copia
`public/` entero a `dist/`: un PNG de 2 MB ahí viaja en cada deploy.

Ninguna es obligatoria para que la página funcione: cada hueco tiene su capa base debajo y el
bloque se ve completo sin la foto. La imagen añade atmósfera, nunca información.

## Reglas, antes de los prompts

1. **Formato: `.webp`**, calidad ~80. Los nombres de abajo ya llevan la extensión.
2. **Peso: ≤ 250 kB** por imagen. El landing no carga bundle y ése es medio argumento de la página;
   una foto de 2 MB se lo come. Convertir: `cwebp -q 80 origen.jpg -o destino.webp`.
3. **Tamaño: 1600×900** (16:9) salvo que la tabla diga otra cosa.
4. **Nada de interfaces inventadas.** Ni pantallas de app, ni gráficas, ni cifras, ni texto legible
   en la imagen. Una UI generada que se parezca a Neto sin serlo es una captura falsa de un producto
   financiero — y las capturas reales ya están pedidas por otra vía (`scripts/visual-regression.mjs`).
   Si el generador mete una pantalla con números, descártala.
5. **Sin texto.** Nada de letras, marcas de agua ni logos. El texto del bloque va en HTML.
6. **El lado izquierdo se oscurece** con un degradado para que se lean las píldoras. Componer con el
   sujeto **a la derecha** y el tercio izquierdo tranquilo.
7. **Cuidado con el sesgo del generador.** Estos modelos, pidiéndoles "freelancer" o "persona de
   negocios", devuelven por defecto hombres jóvenes y oficinas de San Francisco. El usuario objetivo
   es un independiente colombiano. Pide explícitamente Latinoamérica y varía edad y género entre
   imágenes; si la primera tanda sale toda igual, es el sesgo, no el azar.

## Las imágenes

| Archivo | Dónde va | Estado |
|---|---|---|
| `como-trabajas.webp` | Fondo del bloque «¿Cómo trabajas?» (panel oscuro, píldoras encima) | ✅ 2026-09-12 · 1254×1254 · 111 kB |

| `cta-final.webp` | Fondo del cierre «Sabe cuánto es tuyo antes de gastarlo» (foto + overlay) | **pendiente** |

**Nota sobre la que ya está:** llegó cuadrada, no 16:9. No se recortó — `background-size: cover`
la encuadra y el CSS la centra, y la composición aguanta porque el tercio tranquilo recorre toda la
altura. El original está en `~/Projects/Neto/assets/landing/como-trabajas-original.png`.

**Contraste medido sobre esa foto, no estimado:** el pie del bloque es el único texto de la página
que se apoya en una imagen. Replicando el composite (foto con `cover` + el mismo degradado) y
muestreando justo donde cae el texto: **6.02 de media y 5.24 en su píxel más claro**, contra los 4.5
que pide AA. El scrim aguanta *con esta foto*; una imagen mucho más clara en el lado izquierdo
habría que volver a medirla.

---

### `como-trabajas.webp` — 1600×900

> Fotografía cenital de un escritorio de trabajo en casa en Latinoamérica, a media mañana, con luz
> natural cálida entrando de lado por una ventana. Sobre una mesa de madera clara: una laptop
> abierta vista en ángulo desde atrás (la pantalla no se ve o está fuera de foco), una taza de café
> de cerámica, un cuaderno con un bolígrafo encima y un teléfono boca abajo. Una planta pequeña al
> fondo, desenfocada. El tercio izquierdo del encuadre es superficie de mesa vacía y tranquila; los
> objetos se agrupan a la derecha. Estilo fotográfico editorial, realista, profundidad de campo
> media, sombras suaves. Paleta sobria: maderas, blancos, gris pizarra y un acento turquesa apagado.
> Sin texto, sin logos, sin pantallas legibles, sin interfaces. Sin personas.

**Por qué así:** el tercio izquierdo vacío es donde caen las cinco píldoras. Sin pantallas legibles
porque cualquier UI inventada ahí se leería como una captura de Neto. Sin personas en ésta: la
referencia de Deel sí lleva manos, pero una foto con persona compite con las píldoras y aquí el
sujeto real es lo que la app te muestra, no quién la usa.

**Variante si quieres persona** (más cercana a Deel): igual, pero con las manos y el torso de una
persona latinoamericana adulta entrando por el borde derecho, sosteniendo un teléfono sin pantalla
visible. Cara fuera de cuadro. El tercio izquierdo sigue despejado.

## Cuando agregues una

1. Suelta el `.webp` con su nombre exacto.
2. `npm run build` y míralo en claro y en oscuro — el panel es oscuro siempre, pero la página que lo
   rodea no.
3. Comprueba que las píldoras se siguen leyendo sobre la foto. El degradado está calculado para una
   imagen de valor medio; una muy clara en el lado izquierdo puede necesitar subirle opacidad al
   scrim en `styles.css` (`.router__media::before`).


---

### `cta-final.webp` — 1600×900 (o cuadrada, `cover` la encuadra)

El cierre de la página. Aquí sí va gente: es el único bloque donde el sujeto es **la persona**, no
lo que la app le muestra. El texto va centrado encima, así que la composición tiene que aguantar un
titular grande en el medio.

> Retrato documental de una mujer latinoamericana de unos treinta y tantos trabajando desde casa,
> apoyada en la mesa con una taza de café entre las manos, mirando por la ventana con una sonrisa
> tranquila y contenida. Luz natural suave de última hora de la tarde entrando de lado. Espacio
> real y vivido, no una oficina de revista: pared clara, una planta, algo de desorden cotidiano al
> fondo, todo desenfocado. Encuadre medio, ella descentrada hacia la izquierda o la derecha, con la
> zona central del cuadro relativamente libre. Fotografía editorial realista, grano sutil, colores
> cálidos y apagados. Sin texto, sin logos, sin pantallas visibles.

**Las cuatro trampas de esta foto, que la anterior no tenía:**

1. **La sonrisa de stock.** «Persona sonriendo» le sale al generador como una risa de catálogo con
   dientes y brazos cruzados. Por eso el prompt dice *tranquila y contenida* y le da algo que hacer
   con las manos. Si vuelve con risa a cámara, descártala: en una página de finanzas personales una
   alegría exagerada suena a que le vendieron algo.
2. **El centro tiene que estar libre.** El titular va centrado y encima. Una cara justo en el medio
   compite con él y ninguno de los dos gana.
3. **El sesgo, otra vez y aquí más.** Pedir «freelancer» devuelve hombre joven en loft. El prompt
   pide mujer latinoamericana a propósito — y como la del bloque anterior no tiene personas, ésta es
   la única cara de la página. Que no sea la cara por defecto de un generador gringo.
4. **Sin pantallas.** Misma regla de siempre: una UI inventada que se parezca a Neto es una captura
   falsa de un producto financiero.

**Cuando la agregues, hay que volver a medir.** El texto va encima de la foto a tamaño display, y
el overlay está calculado para una imagen de valor medio. Una foto clara (pared blanca, ventana
quemada) puede tumbar el contraste del titular. El ajuste está en `.cta-final::before` de
`styles.css`: los dos topes del degradado.
