import { apiRequest } from './client'
import type { LoginPayload, RegisterPayload } from '../types/payloads'
import type { BaseResponse, RegisterResponse } from '../types/responses'

export async function signIn(data: LoginPayload) {
  return apiRequest<BaseResponse>('/auth/login', {
    method: 'POST',
    body: data,
    skipAuthRefresh: true,
  })
}

export async function signOut() {
  await apiRequest<BaseResponse>('/auth/logout', {
    method: 'POST',
  })

  return true
}

export async function register(data: RegisterPayload) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: data,
    skipAuthRefresh: true,
  })
}
