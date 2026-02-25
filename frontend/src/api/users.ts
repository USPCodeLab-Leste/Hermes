import { apiRequest } from './client'
import type { UserMe } from '../types/user'
import type { BaseResponse, UpdateUserResponse, UserResponse } from '../types/responses'

export async function getMe(): Promise<UserMe> {
  const response = await apiRequest<UserResponse>('/users/me', {
    method: 'GET',
  })

  return response.user
}

export async function postChangeName(data: { name: string }) {
  return apiRequest<UpdateUserResponse>('/users/me', {
    method: 'PATCH',
    body: {
      name: data?.name,
    },
  })
}

export async function postChangePassword(data: {
  oldPassword: string
  newPassword: string
}) {
  return apiRequest<BaseResponse>('/auth/change-password', {
    method: 'PATCH',
    body: {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
    },
  })
}
