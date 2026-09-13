# FYI · La calculadora SEO ahora usa el diseño del landing

**De:** Web · **Para:** Dev (con copia al orquestador) · **Fecha:** 2026-09-12

Alfredo pidió directamente rediseñar `/calculadoras/seguridad-social-independientes/` con base en
el landing. Esa página no está en el territorio declarado de Web (`public/index.html`,
`public/landing/**`), así que dejo constancia de qué cambió y qué no.

## Qué no cambió

- **El bloque `legal-constants`** (JSON) está byte a byte igual.
- **`compute()`** conserva la misma lógica; solo quité los colores inline, que ahora vienen del CSS.
- **El schema `FAQPage`, la canonical, la meta description y el disclaimer** siguen igual.
- **`src/lib/calculadoraSS.test.ts`** pasa sin tocarlo: 13/13.
- **Resultados:** comparé con Playwright la página vieja (HEAD) contra la nueva en 50 combinaciones
  (10 ingresos, incluidos el piso, el umbral de FSP y el tope de 25 SMMLV, × riesgos I–V). Total,
  IBC, desglose, fórmulas, alerta de tope, cifras del FAQ y tabla del FSP dieron 0 diferencias.

## Qué cambió

- **Estilos:** se fue el `:root` copiado a mano (Inter, Geist Mono, `--color-*` retirados en agosto).
  La página carga `/landing/tokens.css`, `/landing/styles.css` y `/landing/calculadora.css`, y
  además `/landing/main.js`.
- **`main.js`** ahora redirige a `/panel/` solo en `/`. En la calculadora, quien tiene sesión se queda.
- **Fuentes:** borré `public/calculadoras/fonts/` (Inter y Geist Mono), que solo usaba esta página.
- **Assets sellados:** `scripts/landing-assets.mjs` también sella los assets de esta página con hash
  de contenido, y `--check` lo verifica.
- **Tabla del FSP:** la columna de rango decía «16 a 16 SMMLV»; ahora dice «Desde 16 SMMLV», y la
  columna de pesos se llama «En pesos (2026)». Los valores no cambian.

## Posible pendiente (tuyo)

`.github/workflows/design-system.yml` corre `landing-assets.mjs --check` solo cuando cambian rutas
de `public/landing/**`. Si alguien edita solo la página de la calculadora, el check no corre en
ese push. Sugiero agregar `public/calculadoras/**` a `paths`.

## Adenda: índice y ruta de navegación

A pedido de Alfredo, para que la calculadora se sienta parte del sitio sin cambiar su URL:

- **Página nueva `public/calculadoras/index.html`:** el índice de calculadoras, con el mismo diseño.
  El `navigateFallbackDenylist` ya la cubría (`/^\/calculadoras\//`), así que no hubo que tocar el SW.
- **Ruta en la calculadora:** *Inicio / Calculadoras / Seguridad social*, con `BreadcrumbList`.
- **`public/sitemap.xml` (tuyo):** agregué `/calculadoras/` y actualicé el `lastmod` de la
  calculadora a 2026-09-12.
