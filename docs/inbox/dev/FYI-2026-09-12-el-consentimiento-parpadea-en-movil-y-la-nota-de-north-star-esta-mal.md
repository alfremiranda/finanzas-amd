# FYI-2026-09-12 — El consentimiento parpadea en prod móvil, y `NORTH_STAR` dice que no

**Observado por Alfredo en el teléfono, hoy, después del deploy.** Chrome móvil, login fresco con
Google: tras el callback aparece la **pantalla de consentimiento de Ley 1581** —la de Neto, no la de
Google— durante **~2 segundos** y desaparece sola, sin que él tocara nada, y entra al panel.

Confirmado por él que era la de Neto («la página de autorización, la que se requiere para poder usar
la app»). Que se fuera **sin un toque** es la prueba de que no era una solicitud real: el gate espera
a «Autorizar y continuar». Nada se re-escribió; el pull trajo su registro y el gate se cerró.

## Esto falsa dos frases de `NORTH_STAR §2 W3 (c)`

> A **dev-only consent re-prompt** exists … **prod is masked by the login pull** (both need network),
> so **no prod re-prompt**. Closable offline-bulletproof with a dedicated local consent key if ever
> wanted — **judged marginal**.

Hay re-prompt en prod. No era marginal: era **invisible desde un escritorio**, porque ahí el pull
gana la carrera. Es tuyo actualizar esa nota — yo no toco `NORTH_STAR`.

## El mecanismo, y no es el que la nota supone

La nota lo atribuye a que «el consentimiento local se cae transitoriamente». Leyendo
`src/store/authStore.ts:20-55`, la causa parece otra y más concreta: **`cloudReady` se pone en `true`
sin que haya habido pull.**

`initialize()` corre dos caminos a la vez. En `onAuthStateChange`:

```ts
const shouldSync = (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && user && !import.meta.env.DEV
if (shouldSync) {
  syncFromCloud().finally(() => { consolidateSettings(); set({ cloudReady: true }) })   // correcto
} else {
  consolidateSettings()
  set({ user, loading: false, cloudReady: true })   // ← aquí
}
```

En un callback de OAuth, Supabase puede emitir primero `INITIAL_SESSION` **con `user === null`** (la
página cargó, el code aún no se ha canjeado). `shouldSync` es falso → entra al `else` → **`cloudReady`
queda en `true` sin un solo pull**. Después llega `SIGNED_IN` con el usuario real, pero `cloudReady`
ya es `true` de antes.

La cadena de gates entonces evalúa: pasa el spinner (`cloudReady`), pasa `LoginScreen` (hay `user`),
y llega a `needsConsent` con `_settings` **todavía vacío** → pinta `ConsentScreen`. Se va cuando
`syncFromCloud()` aterriza. Eso son los dos segundos.

Tu propio comentario en `authStore.ts:9` dice que `cloudReady` significa *«true once initial cloud
sync resolves»*, y en esa rama no resuelve nada. El mismo comentario en `App.tsx:158` apoya el gate
del consentimiento **en esa promesa**.

**Cómo de seguro estoy:** esto es lectura del código, no reproducción. No pude reproducirlo: en dev
`shouldSync` lleva `!import.meta.env.DEV`, así que dev **nunca** sincroniza y el camino de prod no
existe ahí. Trátalo como hipótesis fuerte con línea y orden, no como diagnóstico cerrado.

## Por qué merece arreglo y no otra nota de «marginal»

Es cosmético en datos y feo donde peor cae: a alguien entrando por primera vez le parpadea una
pantalla legal. Y si el pull **falla** en vez de tardar, el gate no parpadea — se queda, y le pide
autorizar de nuevo a quien ya autorizó.

La salida que propone la nota (clave local dedicada) sigue siendo válida, pero si la lectura de
arriba es correcta hay una más barata y más cerca de la causa: que esa rama `else` no declare
`cloudReady` cuando hay una sesión a punto de establecerse.

POINTER: `src/store/authStore.ts:20-55` · `src/App.tsx:146-163` · `src/lib/privacy.ts` ·
`NORTH_STAR.md:126-128`.
