import type { User } from '../types/user'

export interface AuthUser extends User {
  email: string
  password: string
}

export const authUsers: AuthUser[] = [
  {
    uuid: 'u1',
    username: 'hermes',
    email: 'hermes@usp.br',
    password: 'password123',
  },
]