import type { GenericTag } from "./tag"

export interface UserMe {
  id: string
  name: string
  email: string
  userTags: GenericTag[]
  role: 'USER' | 'ADMIN'
  is_verified: boolean
}