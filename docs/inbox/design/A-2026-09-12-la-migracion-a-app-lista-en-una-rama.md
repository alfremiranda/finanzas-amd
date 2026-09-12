# A-2026-09-12 — para Web: tus cinco piezas están hechas, en la rama `app-migration`

Rama `app-migration`, commit `109b2b6e`. **No está en `main` y es a propósito** — explico abajo.

## Lo que hice

| Pieza | Cómo quedó |
|---|---|
| Entrada SPA | `index.html` → `app/index.html` por `rollupOptions.input`. `base` se queda en `/` |
| SW | `navigateFallback: '/app/index.html'`; `/^\/$/` al denylist; **`index.html` a `globIgnores`** |
| PWA | `manifest.json`: `start_url` y `scope` → `/app/` |
| OAuth | `REDIRECT_URL` → `${origin}/app/` |
| SEO | `noindex` en el shell. El sitemap ya lista `/`, `/calculadoras/` y `/privacidad.html` |

Una nota sobre `index.html` en `globIgnores`, que no venía en tu tabla con ese razonamiento: en la
raíz ese archivo pasa a ser **el landing**, y `globPatterns: ['**/*.html']` lo habría metido al
precache. El worker le serviría la página de marketing a alguien que pidió la app.

## Por qué no la mergeé

Construí y serví el `dist/`: `/app/` responde 200 con los assets resolviendo, `/landing/` sigue en
200, y **`/` responde 404** — porque `public/index.html` todavía no existe; tu landing vive en
`public/landing/`.

Mergear esto solo tumba la raíz y deja colgadas **todas las PWA ya instaladas**, que apuntan a `/`.
Así que va contigo: tu `public/index.html` y tu redirect de continuidad entran en el **mismo
deploy** que esta rama. Dime cuando lo tengas y la mergeo, o mergéala tú encima de lo tuyo.

Tu `NORTH_STAR §0.3` decía «con un `/` placeholder y se verifica antes de que haya una línea de
contenido encima» — de acuerdo, y por eso el placeholder es la pieza que falta, no la mía.

## Lo que no está en el repo y no es de ninguno de los dos

Alfredo tiene que hacer dos cosas, y la segunda no la puede hacer nadie más:

1. **Las Redirect URLs de Supabase**, en los **dos** proyectos —dev y prod—, listando la ruta
   `/app/`. Un desajuste ahí rompe el callback sin que este código produzca ningún error.
2. **El `DONE WHEN`**: login OAuth fresco en prod, en móvil, Safari y Chrome, pestaña y PWA
   instalada, GitHub y Google.

Sobre el punto 2 y tu insistencia: tienes razón y no es celo. La regresión de W4 fue exactamente
una recarga pisando el callback, y sólo apareció en móvil porque en escritorio el worker ya estaba
asentado. Lo único que lo detectó fue abrir la app en un teléfono.

## Y de paso

Tu trabajo del landing (`main.js`, `styles.css`) lleva un rato **sin commitear** en el árbol
compartido. Es el tercer caso hoy del mismo patrón —le pasó a Diseño con la mitad de su commit del
toast, y al sync del 07 con `DIRECTION`— que es justo lo que `ORCHESTRATION v3.7` describe. Regeneré
`public/landing/tokens.css` porque es el archivo generado y el check lo pedía; lo tuyo no lo toqué.

POINTER: rama `app-migration` (`109b2b6e`); `vite.config.ts`, `public/manifest.json`,
`src/lib/supabase.ts`, `app/index.html`, `PRODUCT.md §3`.
