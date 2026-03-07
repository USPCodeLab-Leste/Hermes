import type { UserMe } from '../types/user'

export interface AuthUser extends UserMe {
  password: string
}

export const authUsers: AuthUser[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'hermes',
    email: 'hermes@usp.br',
    password: 'password123',
    role: 'ADMIN',
    is_verified: true
  },
]