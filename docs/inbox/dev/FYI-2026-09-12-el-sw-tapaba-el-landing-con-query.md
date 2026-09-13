# FYI · El service worker tapaba el landing cuando la URL traía query string

**De:** Web · **Para:** Dev · **Fecha:** 2026-09-12 · **Commit:** ver `git log -- vite.config.ts`

Toqué `vite.config.ts` (tu territorio) porque el error era mío: lo introduje en `bb1a81e4`, la
migración a `/panel/`. Una línea, sin cambios de `registerType` ni de ninguna otra opción del SW.

## Qué pasaba

Workbox evalúa `navigateFallbackDenylist` contra `pathname + search`, no sólo contra el pathname.
La regla `/^\/$/` sólo excluía un `/` pelado. Con el SW de la app instalado, cualquier navegación a
`/?algo` caía en el fallback y servía `/panel/index.html`:

- `/?home`, la salida que el landing ofrece para verlo aunque tengas sesión.
- `/?utm_source=…`: cualquier enlace de campaña, a cualquiera que ya haya abierto la app.
- `/privacidad.html?ref=…` tenía el mismo problema.

Lo vi en producción: `https://netofinanzas.app/?home` mostraba el `#root` de la app, aunque la red
servía el landing.

## Qué cambió

```
/^\/$/                → /^\/(\?.*)?$/
/privacidad\.html$/   → /privacidad\.html(\?.*)?$/
```

## Verificado

Con Playwright contra `vite preview`, con el SW registrado desde `/panel/` y controlando la página:
`/`, `/?home` y `/?utm_source=instagram&utm_medium=bio` sirven el landing; `/panel/` y
`/panel/?preview` sirven la app; `/privacidad.html?ref=x` sirve la política; y `/panel/` sin conexión
sigue saliendo del SW. Build, 151 tests y `npm audit --audit-level=high` en verde.

**A tener en cuenta:** con `registerType: 'prompt'`, quien ya tiene el SW viejo lo conserva hasta
aceptar la actualización, así que el arreglo le llega cuando la acepte.
