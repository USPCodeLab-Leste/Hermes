import type { RegisterPayload, LoginPayload } from '../types/payloads'
import {  
  register as registerAPI, 
  signIn as signInAPI, 
  signOut as signOutAPI
} from '../api/auth'

import {
  getMe as getMeAPI
} from '../api/users'
import type { UserMe } from '../types/user'
import type { RegisterResponse } from '../types/responses'

export type AuthListener = (user: UserMe | null) => void

export interface AuthService {
  register: (data: RegisterPayload) => Promise<RegisterResponse>
  signIn: (data: LoginPayload) => Promise<UserMe>
  signOut: () => Promise<boolean>
  refresh: () => Promise<UserMe | null>
  onAuthStateChanged: (cb: AuthListener) => () => void
}

export function createAuthService(): AuthService {
  let listeners: AuthListener[] = []
  let currentUser: UserMe | null = null

  // isHyydrated = usuário já foi buscado?
  let isHydrated = false
  let hydratePromise: Promise<void> | null = null

  function notify() {
    listeners.forEach(cb => cb(currentUser))
  }

  async function ensureHydrated() {
    if (isHydrated) return
    if (hydratePromise) return hydratePromise

    hydratePromise = (async () => {
      try {
        currentUser = await getMeAPI()
      } catch {
        currentUser = null
      } finally {
        isHydrated = true
        hydratePromise = null
        notify()
      }
    })()

    return hydratePromise
  }

  async function register(data: RegisterPayload) {
    const response = await registerAPI(data)
    return response
  }

  async function signIn(data: LoginPayload) {
    await signInAPI(data)
    const user = await getMeAPI()

    currentUser = user
    isHydrated = true
    notify()
    return user
  }

  async function signOut() {
    const response = await signOutAPI()

    currentUser = null
    isHydrated = true
    notify()

    return response
  }

  async function refresh() {
    try {
      const user = await getMeAPI()
      currentUser = user
      isHydrated = true
      notify()
      return user
    } catch {
      currentUser = null
      isHydrated = true
      notify()
      return null
    }
  }

  function onAuthStateChanged(cb: AuthListener) {
    listeners.push(cb)

    if (isHydrated) {
      cb(currentUser)
    } else {
      void ensureHydrated()
    }

    return () => {
      listeners = listeners.filter(l => l !== cb)
    }
  }

  return {
    register,
    signIn,
    signOut,
    refresh,
    onAuthStateChanged,
  }
}

export const auth: AuthService = createAuthService()
