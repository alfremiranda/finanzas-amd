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

| `cta-final.webp` | Fondo del cierre «Sabe cuánto es tuyo antes de gastarlo» (foto + overlay) | ✅ 2026-09-12 · 1536×1024 · 71 kB |
| `como-trabajas-independiente.webp` | Fondo de «¿Cómo trabajas?» con **Independiente** elegido | ✅ 2026-09-12 · 1600×900 · 64 kB |
| `como-trabajas-empleado.webp` | Fondo de «¿Cómo trabajas?» con **Empleado** elegido | ✅ 2026-09-12 · 1600×900 · 69 kB |
| `como-trabajas-ambos.webp` | Fondo de «¿Cómo trabajas?» con **Ambos** elegido | ✅ 2026-09-12 · 1600×900 · 81 kB |

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
sujeto real es lo que la app te muestra, no quién la usa. (Las tres versiones por perfil, más abajo, sí llevan
persona: allí la composición la saca del camino de las píldoras.)

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
   la primera cara que se diseñó para la página. Que no sea la cara por defecto de un generador gringo.
4. **Sin pantallas.** Misma regla de siempre: una UI inventada que se parezca a Neto es una captura
   falsa de un producto financiero.

**Cuando la agregues, hay que volver a medir.** El texto va encima de la foto a tamaño display, y
el overlay está calculado para una imagen de valor medio. Una foto clara (pared blanca, ventana
quemada) puede tumbar el contraste del titular. El ajuste está en `.cta-final::before` de
`styles.css`: los dos topes del degradado.


---

## Lo que pasó al agregar `cta-final.webp` — el aviso se cumplió

El prompt terminaba diciendo «cuando la agregues, hay que volver a medir». Se midió, y **falló**.

| | media | peor píxel | pide | |
|---|---|---|---|---|
| titular (48px) | 14.96 | **10.42** | 3 | ok |
| bajada (20px) | 6.04 | **3.87** | 4.5 | ✗ |
| nota (14px) | 5.48 | **3.47** | 4.5 | ✗ |

La foto tiene una ventana quemada a la derecha, justo detrás del texto. Pero la causa no era la
foto: **mi degradado iba de 90% arriba a 74% abajo, o sea se debilitaba exactamente donde vive el
texto secundario.** El titular nunca estuvo en riesgo — el texto grande pide 3 y sacaba 10. Lo que
una fotografía se come es la letra chica.

Reformado a cuatro paradas, más fuerte en la franja del medio: `82% · 94% (45%) · 94% (78%) · 80%`.
Vuelto a medir: **12.60 · 5.96 · 5.90**, las tres con margen. La atmósfera de la foto sobrevive.

**La lección para la próxima imagen con texto encima:** un overlay que se degrada hacia abajo es
decorativo; uno que es más fuerte donde está el texto es funcional. Y mide el peor píxel, no el
promedio — el promedio de la bajada daba 6.04 y habría pasado.


---

### La serie de «¿Cómo trabajas?» — tres imágenes, una por perfil · 1600×900

Ya están cableadas: al elegir un perfil, su foto se pone detrás de las píldoras. Cada una va apilada
**sobre** `como-trabajas.webp`, así que mientras un archivo no exista su perfil sigue mostrando el
escritorio de siempre. Sueltas el `.webp` con su nombre y aparece.

**Con personas, a pedido de Alfredo.** La foto por defecto no lleva gente, y la razón sigue en pie:
una persona compite con las píldoras. Aquí se resuelve con la composición, no quitando a la persona.
Va en la mitad derecha, de perfil o de tres cuartos, mirando su trabajo y nunca a cámara, así que el
ojo no se queda en una cara que le devuelve la mirada. El tercio izquierdo sigue siendo fondo tranquilo.

**Lo que más importa: se intercambian en el mismo sitio.** Al cambiar de perfil debe leerse como
«cambia quién eres», no como un salto. Las tres comparten encuadre, altura de cámara, lado de la luz,
tamaño de la persona en el cuadro y color. Cambian la persona, el lugar y los objetos.

**Truco práctico:** genera las tres en la misma conversación y, cuando tengas la primera buena,
adjúntala como referencia para las otras dos («mismo encuadre, luz y color que esta imagen»).

**Base compartida** (va al inicio de los tres prompts):

> Fotografía editorial documental y realista, encuadre medio a la altura de los ojos, formato
> horizontal 16:9. Una sola persona sentada trabajando en la mitad derecha del cuadro, de perfil o de
> tres cuartos, concentrada en lo que hace y sin mirar a cámara, con expresión tranquila y natural.
> El tercio izquierdo del cuadro es fondo despejado y desenfocado (pared, ventana o espacio abierto),
> sin objetos ni personas. Luz natural cálida entrando de lado desde la izquierda, sombras suaves,
> profundidad de campo baja y grano sutil. Paleta sobria de maderas, blancos y gris pizarra, con un
> acento turquesa apagado. Contexto colombiano real, no una sesión de catálogo. La pantalla de la
> laptop mira en sentido contrario a la cámara. Sin texto, sin logos, sin pantallas legibles ni
> interfaces.

**1 · `como-trabajas-independiente.webp`**

> [base] Un hombre afrocolombiano de unos treinta años, diseñador independiente, trabajando desde su
> casa a media mañana. Está sentado ante una mesa de madera clara con una laptop abierta, una taza de
> café de cerámica y un cuaderno con bocetos. Viste ropa cómoda de casa, una camiseta lisa. Al fondo,
> desenfocados, una planta y una ventana con luz de día. Un lugar propio, flexible y ordenado a su
> manera.

**2 · `como-trabajas-empleado.webp`**

> [base] Una mujer colombiana de unos cuarenta años trabajando en su puesto de una oficina luminosa, a
> media mañana. Está sentada ante un escritorio con un teclado y un monitor cuya pantalla queda fuera
> de cuadro. A su lado, un vaso de café para llevar y un carné corporativo completamente en blanco
> colgado de un cordón al cuello. Viste una blusa sencilla de oficina. Al fondo, desenfocados, paneles
> de vidrio y luz de ventanal. Un lugar estructurado, de rutina.

**3 · `como-trabajas-ambos.webp`**

> [base] Una mujer colombiana de unos veintiocho años, en casa al final de la tarde, con la luz dorada
> y más baja. Acaba de volver del trabajo: el carné corporativo completamente en blanco y su cordón
> están sobre la mesa, junto a un vaso de café para llevar. Ahora está concentrada en su laptop
> personal abierta, con un cuaderno de proyectos al lado, en su propio proyecto. Viste ropa de oficina
> con las mangas remangadas. Al fondo, desenfocada, una sala de casa. Alguien que terminó su jornada
> de empleo y sigue con lo suyo.

**Las trampas de esta serie:**

1. **La mirada a cámara.** Es lo primero que hace un generador con una persona. Si mira al
   espectador, descártala: la cara gana la atención que deben tener las píldoras.
2. **La sonrisa de stock.** Igual que en `cta-final`: nada de risa con dientes ni pulgares arriba.
   Concentrada y tranquila.
3. **Las manos.** Revisa los dedos sobre el teclado y la taza. Una mano de seis dedos en la sección
   que habla de tu trabajo arruina la credibilidad de la página entera.
4. **El carné.** Los generadores le imprimen casi siempre un nombre, un logo o una foto. Por eso el
   prompt dice «completamente en blanco». Si sale con texto, descártala: un logo inventado de una
   empresa es justo lo que no puede aparecer.
5. **La coherencia entre las tres.** Si una sale con la persona más grande, centrada o con la luz del
   otro lado, vuelve a pedirla antes de convertirla: el salto se nota al cambiar de perfil.
6. **El sesgo del generador.** «Freelancer» devuelve hombre joven blanco en loft; «oficina» devuelve
   un estudio de Silicon Valley. Por eso cada prompt fija quién es y dónde está. Con la foto del cierre
   son cuatro personas en la página: que se vean como las personas de Colombia que usan Neto.
7. **Sin pantallas**, como siempre.

**Al agregarlas se vuelve a medir.** Las píldoras tienen su propio fondo y no dependen de la foto, pero
el pie del bloque sí va sobre el velo oscuro. Si alguna sale muy clara en el lado izquierdo (ventana
quemada, pared blanca), puede tumbar ese contraste.

**Medido al agregarlas (2026-09-12).** Con persona, el pie de foto fallaba en pantallas angostas
(2.14:1 a 768px, 1.02:1 a 375px) y un velo inferior lo arregló, pero entre ese velo y el lateral la
foto casi no se veía. Ahora el contraste no depende de la foto: el pie de foto es un chip de vidrio
con el mismo fondo que las píldoras y texto en el foreground completo del panel. El velo quedó ligero
y sólo a la izquierda. Medido en los tres perfiles a 1280, 768 y 375: píldoras ≥11.5:1, pie ≥10.2:1.
Por eso **una foto nueva ya no puede tumbar el contraste**, sólo verse más o menos.
El recorte de las fotos por perfil se ancla en la persona (`background-position: 72% 22%`): centrado
cortaba frentes en escritorio y partía a la persona por la mitad en el teléfono.

**Sin pie de foto (2026-09-12).** Alfredo lo quitó: repetía lo que ya dice la respuesta del perfil encima
del bloque. Sobre las fotos ya sólo van las píldoras, y tienen su propio fondo; lo dicho arriba sobre
el pie de foto y su velo queda como historia.
