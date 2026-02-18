import { fakeRequest } from './client'
import { authUsers } from '../mocks/auth.mock'
import type { LoginPayload, RegisterPayload } from '../types/payloads'

export async function signIn(data: LoginPayload) {
  const { email, password } = data
  
  const user = authUsers.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    await fakeRequest(null)
    throw new Error('Credenciais inválidas')
  }

  localStorage.setItem('fake-cookie', user.uuid)

  return fakeRequest({
    message: 'Login realizado com sucesso',
  })
}

export async function signOut() {
  return fakeRequest(true)
}

export async function register(data: RegisterPayload) {
  const newUser = {
    uuid: crypto.randomUUID(),
    ...data,
    role: 'USER',
  } as const

  authUsers.push(newUser)

  return fakeRequest({
    message: 'Usuário criado',
    uuid: newUser.uuid,
  })
}
