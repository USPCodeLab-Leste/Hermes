export interface User {
  uuid: string
  name: string
}

export type UserCredential = {
  uuid: string
  email: string
  name: string
}

export interface UserMe {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}