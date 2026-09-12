# public/landing/images/

Imágenes del landing. Las genera Alfredo (Gemini / ChatGPT / Midjourney) y las deja aquí con el
**nombre exacto** de la tabla — el CSS ya apunta a esas rutas, así que basta con soltar el archivo.

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
| `como-trabajas.webp` | Fondo del bloque «¿Cómo trabajas?» (panel oscuro, píldoras encima) | **pendiente** |

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
