export interface User {
  uuid: string
  username: string
}

export type UserCredential = {
  uuid: string
  email: string
  username: string
}

export interface UserMe {
  id: string
  nome: string
  email: string
  role: 'USER' | 'ADMIN'
}