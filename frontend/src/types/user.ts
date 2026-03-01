export interface UserMe {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  is_verified: boolean
}