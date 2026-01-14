import type { RegisterPayload, LoginPayload } from '../types/payloads'
import { 
  checkEmail as checkEmailAPI, 
  register as registerAPI, 
  signIn as signInAPI, 
  signOut as signOutAPI
} from '../api/auth'

const TOKEN_KEY = 'auth_token'

export type AuthListener = (token: string | null) => void

export interface AuthService {
  register: (data: RegisterPayload) => Promise<{ message: string, uuid: string }>
  signIn: (data: LoginPayload) => Promise<string>
  signOut: () => Promise<boolean>
  checkEmail: (email: string) => Promise<{ message: string }>
  getToken: () => string | null
  onAuthStateChanged: (cb: AuthListener) => () => void
}

export function createAuthService(): AuthService {
  let listeners: AuthListener[] = []
  let currentToken: string | null = localStorage.getItem(TOKEN_KEY)

  function notify() {
    listeners.forEach(cb => cb(currentToken))
  }

  function saveAuth(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
    currentToken = token
    notify()
  }

  function removeAuth() {
    localStorage.removeItem(TOKEN_KEY)
    currentToken = null
    notify()
  }

  async function register(data: RegisterPayload) {
    const response = await registerAPI(data)
    return response
  }

  async function signIn(data: LoginPayload) {
    const { token } = await signInAPI(data)
    saveAuth(token)

    return token
  }

  async function signOut() {
    const response = await signOutAPI()
    removeAuth()

    return response
  }

  async function checkEmail(email: string) {
    return await checkEmailAPI(email)
  }

  function getToken() {
    return currentToken
  }

  function onAuthStateChanged(cb: AuthListener) {
    listeners.push(cb)
    cb(currentToken)

    return () => {
      listeners = listeners.filter(l => l !== cb)
    }
  }

  return {
    register,
    signIn,
    signOut,
    checkEmail,
    getToken,
    onAuthStateChanged,
  }
}

export const auth: AuthService = createAuthService()
