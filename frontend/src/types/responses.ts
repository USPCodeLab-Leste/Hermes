import type { UserMe } from "./user"

export interface BaseResponse {
  message: string
}

export interface RegisterResponse extends BaseResponse {
  userId: string
}

export interface UserResponse {
  user: UserMe
}

export interface UpdateUserResponse extends BaseResponse {
  user: {
    id: string
    name: string
    email: string
    role: 'USER' | 'ADMIN'
  }
}