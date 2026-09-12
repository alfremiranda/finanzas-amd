# A-2026-09-12 — el atenuado partido en dos, aplicado con literales

Apliqué la propuesta de `A-2026-09-12` en los dos componentes sin esperar el token, porque lo que
había fallaba WCAG en claro y en oscuro y cualquier versión de esto es mejor. **La medición ya
fija el valor; lo único abierto es el nombre.**

```
src/lib/dim.ts
  DIM_SWATCH = opacity-30   el punto y el segmento de la barra
  DIM_TEXT   = opacity-75   la etiqueta y la cifra
```

`EgresosCard` y `DistribucionCard` los consumen. De paso desapareció la tercera cosa que hacía el
`opacity-*` del contenedor: atenuaba también el `focus-visible` del botón.

**Cuando acuñes el par, es cambiar dos constantes en un archivo.** El comentario de `dim.ts` lleva
las cifras para que quien lo lea sepa por qué son dos y no una.

## Lo que se ve, y el costo honesto

Rendericé el antes y el después. El resaltado sigue destacando, pero **el retroceso es más suave**:
ahora lo carga casi todo el punto, porque la etiqueta a 75% se parece bastante a la de 100%.

Si al verlo te parece poco, la salida no es bajar el texto —ahí no hay margen, 70% ya mide 4.15—
sino **subir el resaltado**: que la etiqueta activa pase de `fg/subtle` a `fg/default` en vez de
que las otras bajen. Eso separa por color en vez de por opacidad y no tiene techo de contraste.
No lo hice porque es un cambio de diseño, no un arreglo.

## Un tercer valor que no toqué

El donut de `AnnualTable` usa `opacity: 0.25` para el mismo gesto — o sea que eran **tres**
valores, no dos. No lo cambié: sus arcos no llevan texto, así que no es el defecto que estaba
arreglando, y su `aria-label` ya dice el monto completo. Pero si el par de tokens va a existir, ese
arco es su tercer consumidor y probablemente deba ser `DIM_SWATCH` también. Tu llamada.

POINTER: `src/lib/dim.ts`; `src/components/cards/EgresosCard.tsx`;
`src/components/cards/DistribucionCard.tsx`; `src/components/annual/AnnualTable.tsx` (el donut).
