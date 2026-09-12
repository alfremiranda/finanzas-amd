# FYI-2026-09-12 — Toqué `src/` para el persona demo. Qué y por qué.

Sin pregunta; aviso. Las capturas de la app para el landing necesitaban datos, y resultó que
**tú ya habías construido el mecanismo**: `?preview` salta los gates y siembra un fixture. Extendí
eso en vez de inventar otra cosa.

## Lo que agregué

- **`src/lib/demoSeed.ts`** (nuevo) — un año generado de forma determinista, con su propio persona.
- **`?preview=demo`** en `devPreview.ts` (una constante) y dos líneas en `App.tsx` que eligen entre
  tu fixture y el mío. Sigue tu propio patrón: `=onboarding` y `=consent` ya existían.
- Verificado que **se va del bundle de producción**: `grep` de los nombres del persona en
  `dist/assets/*.js` da 0. Vive dentro de `DEV_PREVIEW`, así que `import.meta.env.DEV` lo dobla a
  false y el tree-shaking se lo lleva, igual que el tuyo.

**No toqué tu `previewDB()`.** Es de un mes y así debe quedarse: está hecho para ejercitar las
vistas en QA visual. El mío tiene que hacer que las superficies **anuales** rindan —dona, tendencia
de 8 meses, ranking de categorías, y una página de Obligaciones con meses pagados y meses no—, y
con un solo mes todas esas son estados vacíos.

## Tres reglas que sigue, y la segunda te va a interesar

1. **No es Alfredo.** Una captura real muestra su sueldo, sus gastos y sus saldos. Eso no va en una
   página pública.
2. **Sin marcas de terceros.** `TRANSFER_ACCOUNTS` trae Bancolombia, Nequi y «ARQ (Observer Hub)» —
   bancos reales y un cliente real. En una captura de marketing eso se lee como una integración o un
   aval que no existe, y las tiendas de apps rechazan imágenes que impliquen afiliación. Las cuentas
   del demo describen su función: «Cuenta en dólares», «Reserva para la DIAN», «CDT 12 meses».
3. **Determinista.** Todo sale de un generador sembrado, así que el mismo mes da siempre las mismas
   cifras. Una captura que cambia entre corridas no se puede volver a tomar después de un cambio de
   UI sin re-fotografiar las seis.

## Y algo que rompí yo y arreglé

El docstring de `devPreview.ts` decía `http://localhost:5173/?preview`. **Desde la migración eso da
404**: en dev, `/` sirve el landing desde `publicDir`. Ahora dice `/panel/?preview`. Era mi migración
la que lo dejó mintiendo.

## El script

`scripts/landing-captures.mjs` — maneja el servidor de dev, encuadra **por tarjeta nombrada** (no por
viewport, que cortaba el gráfico de tendencia a media barra) y el borde inferior **sube solo** hasta
no partir ninguna fila. Doce capturas, claro y oscuro. Si cambias una vista, se vuelve a correr.
