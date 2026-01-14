import { fakeRequest } from './client'
import { users } from '../mocks/users.mock'
import { authUsers } from '../mocks/auth.mock'
import type { UserMe } from '../types/user'

function parseUuidFromToken(token: string): string | null {
  if (!token || typeof token !== 'string') return null
  const prefix = 'jwt-'
  if (!token.startsWith(prefix)) return null
  return token.substring(prefix.length)
}

export async function getMe(token: string): Promise<UserMe> {
  const uuid = parseUuidFromToken(token)
  if (!uuid) {
    throw new Error('Token inválido')
  }

  const baseUser = users.find(u => u.uuid === uuid)
  const authUser = authUsers.find(u => u.uuid === uuid)

  if (!baseUser || !authUser) {
    throw new Error('Usuário não encontrado')
  }

  return fakeRequest({
    id: baseUser.uuid,
    nome: baseUser.username,
    email: authUser.email,
    role: 'USER',
  })
}
