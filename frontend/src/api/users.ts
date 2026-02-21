import { fakeRequest } from './client'
import { authUsers } from '../mocks/auth.mock'
import type { UserMe } from '../types/user'
import { USER_KEY } from '../services/auth'

type HttpError = Error & { status: number }

function createHttpError(status: number, message: string): HttpError {
  const error = new Error(message) as HttpError
  error.status = status
  return error
}

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
    role: authUser.role,
  })
}

export async function postChangeName(data: { name: string }) {
  const uuid = localStorage.getItem('fake-cookie')

  if (!uuid) {
    throw createHttpError(401, 'Usuário não autenticado')
  }

  if (!data?.name || data.name.trim() === '') {
    throw createHttpError(400, 'Erro ao atualizar informações do usuario')
  }

  const authUser = authUsers.find(u => u.uuid === uuid)

  if (!authUser) {
    throw createHttpError(400, 'Erro ao atualizar informações do usuario')
  }

  authUser.name = data.name.trim()

  const existing = localStorage.getItem(USER_KEY)
  if (existing) {
    const parsed = JSON.parse(existing) as UserMe
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ ...parsed, name: data.name }),
    )
  }

  return fakeRequest({ message: 'Nome atualizado com sucesso' })
}

export async function postChangePassword(data: {
  oldPassword: string
  newPassword: string
}) {
  const uuid = localStorage.getItem('fake-cookie')

  if (!uuid) {
    throw createHttpError(401, 'Não autorizado')
  }

  if (!data.oldPassword || !data.newPassword) {
    throw createHttpError(400, 'Dados inválidos')
  }

  const authUser = authUsers.find(u => u.uuid === uuid)

  if (!authUser) {
    throw createHttpError(404, 'Utilizador não encontrado')
  }

  if (authUser.password !== data.oldPassword) {
    throw createHttpError(401, 'Senha antiga incorreta')
  }

  if (data.newPassword === data.oldPassword) {
    throw createHttpError(400, 'Dados inválidos')
  }

  authUser.password = data.newPassword

  return fakeRequest({ message: 'Senha atualizada com sucesso' })
}
