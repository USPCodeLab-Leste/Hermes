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

// const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export type AuthListener = (user: UserMe | null) => void

export interface AuthService {
  register: (data: RegisterPayload) => Promise<{ message: string, uuid: string }>
  signIn: (data: LoginPayload) => Promise<UserMe>
  signOut: () => Promise<boolean>
  onAuthStateChanged: (cb: AuthListener) => () => void
}

export function createAuthService(): AuthService {
  let listeners: AuthListener[] = []
  // let currentToken: string | null = localStorage.getItem(TOKEN_KEY)
  let currentUser: UserMe | null = localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null

  function notify() {
    // listeners.forEach(cb => cb(currentToken))
    listeners.forEach(cb => cb(currentUser))
  }

  function saveAuth(user: UserMe) {
    // localStorage.setItem(TOKEN_KEY, token)
    // currentToken = user
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    currentUser = user
    notify()
  }

  function removeAuth() {
    // localStorage.removeItem(TOKEN_KEY)
    // currentToken = null
    localStorage.removeItem(USER_KEY)
    currentUser = null
    notify()
  }

  async function register(data: RegisterPayload) {
    const response = await registerAPI(data)
    return response
  }

  async function signIn(data: LoginPayload) {
    await signInAPI(data)
    const user = await getMeAPI()

    saveAuth(user)
    return user
  }

  async function signOut() {
    const response = await signOutAPI()
    removeAuth()

    return response
  }

  function onAuthStateChanged(cb: AuthListener) {
    listeners.push(cb)
    cb(currentUser)

    return () => {
      listeners = listeners.filter(l => l !== cb)
    }
  }

  return {
    register,
    signIn,
    signOut,
    onAuthStateChanged,
  }
}

export const auth: AuthService = createAuthService()
