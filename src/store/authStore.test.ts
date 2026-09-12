import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * `cloudReady`'s one invariant: it is true only when the gates that depend on it can trust
 * what they are reading.
 *
 * This had no test, and the cost was visible in production. After an OAuth callback the Ley
 * 1581 consent screen flashed for about two seconds and then vanished on its own — a legal
 * gate shown to someone who had already consented. Alfredo saw it on Chrome mobile, Safari
 * mobile and the installed PWA; it never showed on a desktop, because there the pull wins the
 * race. The cause was not the consent record: it was `cloudReady` going true down a path where
 * no pull had happened, so `App`'s chain evaluated `needsConsent` against empty `_settings`.
 *
 * Two paths did it, not one, and the tests below pin both.
 *
 * The reason this needed unit tests rather than a manual check is in the code itself:
 * `shouldSync` carries `!import.meta.env.DEV`, so in dev the sync path does not exist at all
 * and the production behaviour cannot be reproduced by hand. These drive the callbacks
 * directly instead.
 */
// The node environment has no DOM, and `oauthCallbackInFlight` reads `window.location`. A
// two-field stub is enough and keeps the suite out of jsdom.
const loc = { search: '', hash: '' }
;(globalThis as unknown as { window: unknown }).window = { location: loc }

const listeners: Array<(user: unknown, event: string) => void> = []
let getUserResult: unknown = null
let syncResolve: (() => void) | null = null
let syncReject: ((e: unknown) => void) | null = null

vi.mock('@/lib/supabase', () => ({
  getUser: () => Promise.resolve(getUserResult),
  onAuthStateChange: (cb: (user: unknown, event: string) => void) => { listeners.push(cb); return () => {} },
  signInWithGitHub: vi.fn(), signInWithGoogle: vi.fn(), signOut: vi.fn(),
}))

vi.mock('@/store/financeStore', () => ({
  useFinanceStore: {
    getState: () => ({
      consolidateSettings: vi.fn(),
      syncFromCloud: () => new Promise<void>((res, rej) => { syncResolve = res; syncReject = rej }),
    }),
  },
}))

// PRODUCTION is the environment under test: `shouldSync` carries `!import.meta.env.DEV`, which
// vitest sets true, so without this the sync path never runs and every assertion below would be
// measuring the signed-out branch instead.
vi.stubEnv('DEV', false)

const { useAuthStore } = await import('./authStore')

const USER = { id: 'u1' }
const flush = () => new Promise(r => setTimeout(r, 0))

beforeEach(() => {
  listeners.length = 0
  getUserResult = null
  syncResolve = null
  syncReject = null
  useAuthStore.setState({ user: null, loading: true, cloudReady: false })
  loc.search = ''
  loc.hash = ''
})

describe('cloudReady', () => {
  it('stays false while an OAuth code is still in the URL', async () => {
    // getUser resolves BEFORE the exchange, so "no user" here means "not yet".
    loc.search = '?code=abc123'
    useAuthStore.getState().initialize()
    await flush()
    expect(useAuthStore.getState().cloudReady).toBe(false)
  })

  it('also recognises the implicit flow, which returns tokens in the hash', async () => {
    loc.hash = '#access_token=xyz'
    useAuthStore.getState().initialize()
    await flush()
    expect(useAuthStore.getState().cloudReady).toBe(false)
  })

  it('is true straight away for someone genuinely signed out', async () => {
    // No user and no callback in the URL: there is nothing to pull, and holding the splash
    // up would be a spinner in front of the login screen.
    useAuthStore.getState().initialize()
    await flush()
    expect(useAuthStore.getState().cloudReady).toBe(true)
  })

  it('goes back to false when a session arrives after a no-user event', async () => {
    // The exact production sequence: INITIAL_SESSION with user null, then SIGNED_IN with the
    // real user. Without the reset, the second event inherits the first event's `true`.
    useAuthStore.getState().initialize()
    await flush()
    listeners.forEach(cb => cb(null, 'INITIAL_SESSION'))
    expect(useAuthStore.getState().cloudReady).toBe(true)

    listeners.forEach(cb => cb(USER, 'SIGNED_IN'))
    expect(useAuthStore.getState().cloudReady).toBe(false)
  })

  it('turns true only once the pull resolves, not when it starts', async () => {
    useAuthStore.getState().initialize()
    await flush()
    listeners.forEach(cb => cb(USER, 'SIGNED_IN'))
    expect(useAuthStore.getState().cloudReady).toBe(false)

    syncResolve!()
    await flush()
    expect(useAuthStore.getState().cloudReady).toBe(true)
  })

  it('turns true even if the pull REJECTS — a failed sync must not strand the app', async () => {
    // The failure mode this guards is worse than the flash: if a rejected pull left the flag
    // false, the splash would never lift and the app would be unusable offline.
    useAuthStore.getState().initialize()
    await flush()
    listeners.forEach(cb => cb(USER, 'SIGNED_IN'))
    syncReject!(new Error('offline'))
    await flush()
    expect(useAuthStore.getState().cloudReady).toBe(true)
  })
})
