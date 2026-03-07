export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface ChangeName {
  name: string
}

export interface ChangePassword {
  oldPassword: string
  newPassword: string
}