import type { User } from '../types/user'

export interface AuthUser extends User {
  email: string
  password: string
}

export const authUsers: AuthUser[] = [
  {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'hermes',
    email: 'hermes@usp.br',
    password: 'password123',
  },
]