import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { getUser, onAuthStateChange, signInWithGitHub, signInWithGoogle, signOut as sbSignOut } from '@/lib/supabase'
import { useFinanceStore } from '@/store/financeStore'

/**
 * Whether an OAuth redirect is still being processed.
 *
 * Supabase returns either `?code=` (PKCE) or `#access_token=` (implicit) and clears it once the
 * exchange succeeds. While either is present there is a session on its way, so "no user yet" is
 * not the same fact as "signed out" — and only the second one means there is nothing to pull.
 */
function oauthCallbackInFlight(): boolean {
  if (typeof window === 'undefined') return false
  const { search, hash } = window.location
  return /[?&]code=/.test(search) || /access_token=|error=/.test(hash)
}

interface AuthState {
  user: User | null
  loading: boolean
  /**
   * True once the initial cloud pull has RESOLVED — the gate chain in App leans on it, so
   * anything that declares it true without a pull lets the gates run against empty settings.
   * That is what made the Ley 1581 consent screen flash for ~2s after an OAuth callback in
   * production: a legal gate shown to someone who had already consented, which then vanished
   * on its own when the pull landed.
   */
  cloudReady: boolean
  signInWithGitHub: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  initialize: () => () => void  // returns unsubscribe fn
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  cloudReady: false,

  initialize: () => {
    // Seed initial user (handles OAuth callback on page load)
    getUser().then(user => {
      set({ user, loading: false })
      // No session → no sync needed. Consolidate local settings immediately
      // (local-first hatch: nothing in the cloud to collide with) and mark ready.
      //
      // UNLESS a callback is in flight. On an OAuth return this resolves BEFORE the code has
      // been exchanged, so "no user" means "not yet", not "signed out" — and declaring ready
      // there is what let the gate chain reach the consent screen with `_settings` still empty.
      if (!user && !oauthCallbackInFlight()) {
        useFinanceStore.getState().consolidateSettings()
        set({ cloudReady: true })
      }
    })

    // In prod: auto-pull whenever a session appears — both a fresh sign-in
    // (SIGNED_IN, OAuth redirect) AND a restored session on normal app open
    // (INITIAL_SESSION). The latter was missing before, so reopening the app
    // never fetched changes made on another device.
    // cloudReady is set only after sync completes to avoid showing onboarding
    // briefly for returning users whose _settings.onboardingDone is in the cloud.
    const unsub = onAuthStateChange((user, event) => {
      const shouldSync = (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && user && !import.meta.env.DEV
      if (shouldSync) {
        // cloudReady goes back to FALSE here on purpose. An earlier no-user event may already
        // have set it true; a session arriving afterwards means the pull it promised has not
        // happened yet, and the flag has to tell the truth about that rather than stay stale.
        set({ user, loading: false, cloudReady: false })
        // `.finally` does not consume a rejection, so a pull that fails — which is just
        // "offline" — used to surface as an unhandled rejection: a console error on every
        // offline sign-in, and with Sentry installed, a reported one. The catch below is what
        // makes the failure handled; `cloudReady` still lifts either way, because leaving the
        // splash up on a failed pull would make the app unusable exactly when it is offline,
        // which is the case local-first exists for.
        useFinanceStore.getState().syncFromCloud().catch(() => {}).finally(() => {
          // GATE: consolidate only AFTER the pull resolves, so an authenticated
          // device never seeds its local deductions before seeing the cloud —
          // seeding blind would let two devices duplicate the same custom provision.
          useFinanceStore.getState().consolidateSettings()
          set({ cloudReady: true })
        })
      } else {
        // No sync path (signed out / dev): safe to consolidate now — no cloud to race.
        useFinanceStore.getState().consolidateSettings()
        set({ user, loading: false, cloudReady: true })
      }
    })
    return unsub
  },

  signInWithGitHub: async () => {
    await signInWithGitHub()
  },

  signInWithGoogle: async () => {
    await signInWithGoogle()
  },

  signOut: async () => {
    await sbSignOut()
    set({ user: null })
  },
}))
