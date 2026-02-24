export interface BaseResponse {
  message: string
}

export interface RegisterResponse extends BaseResponse {
  userId: string
}

export interface UserResponse {
  user: {
    id: string
    name: string
    email: string
    role: 'USER' | 'ADMIN'
    is_verified: boolean
  }
}