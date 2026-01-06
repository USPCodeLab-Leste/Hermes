// api/auth.ts
import { fakeRequest } from './client'
import { authUsers } from '../mocks/auth.mock'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

export async function login({ email, password }: LoginPayload) {
  const user = authUsers.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciais inválidas')
  }

  return fakeRequest({
    token: 'fake-jwt-token',
  })
}

export async function register(data: RegisterPayload) {
  const newUser = {
    id: crypto.randomUUID(),
    username: data.email.split('@')[0],
    avatarUrl: '/avatars/default.png',
    rating: 0,
    ...data,
  }

  authUsers.push(newUser)

  return fakeRequest({
    message: 'Usuário criado',
    id: newUser.id,
  })
}
