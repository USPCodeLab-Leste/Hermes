import type { InfoTagType, Tag } from "./tag"

export interface Info<T = InfoTagType> {
  id: string
  title: string
  tags: Tag<T>[]
  body: string
  status: 'draft' | 'published' | 'archived'
  created_at: string    
  autor_id: string
  icon_name?: string
}