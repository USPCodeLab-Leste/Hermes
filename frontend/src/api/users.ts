import { fakeRequest } from './client'
import { authUsers } from '../mocks/auth.mock'
import type { UserMe } from '../types/user'

export async function getMe(): Promise<UserMe> {
  const uuid = localStorage.getItem('fake-cookie')
  
  if (!uuid) {
    throw new Error('Usuário não autenticado')
  }

  const authUser = authUsers.find(u => u.uuid === uuid)

  if (!authUser) {
    throw new Error('Usuário não encontrado')
  }

  return fakeRequest({
    id: authUser.uuid,
    name: authUser.name,
    email: authUser.email,
    role: 'USER',
  })
}
