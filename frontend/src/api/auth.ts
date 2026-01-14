import { fakeRequest } from './client'
import { authUsers } from '../mocks/auth.mock'
import type { LoginPayload, RegisterPayload } from '../types/payloads'

export async function signIn(data: LoginPayload) {
  const { email, password } = data
  
  const user = authUsers.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciais inválidas')
  }

  const token = `jwt-${user.uuid}`
  return fakeRequest({
    token,
  })
}

export async function checkEmail(email: string) {
  const emailExists = authUsers.some(u => u.email === email)

  if (emailExists) {
    throw new Error('Email já cadastrado')
  }

  return fakeRequest({ message: 'Email verificado' })
}

export async function signOut() {
  return fakeRequest(true)
}

export async function register(data: RegisterPayload) {
  const newUser = {
    uuid: crypto.randomUUID(),
    ...data,
  }

  authUsers.push(newUser)

  return fakeRequest({
    message: 'Usuário criado',
    uuid: newUser.uuid,
  })
}
