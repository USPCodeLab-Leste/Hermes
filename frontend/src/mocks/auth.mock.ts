import type { User } from '../types/user'

export interface AuthUser extends User {
  email: string
  password: string
}

export const authUsers: AuthUser[] = [
  {
    id: 'u1',
    name: 'Hermes',
    username: 'hermes',
    email: 'hermes@email.com',
    password: '123456',
    avatarUrl: '/avatars/1.png',
    rating: 4.9,
  },
]