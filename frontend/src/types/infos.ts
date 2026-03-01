import type { InfoTagType, Tag } from "./tag"

export interface Info<T = InfoTagType> {
  id: string
  title: string
  tags: Tag<T>[]
  body: string
  local?: string
  status: 'draft' | 'published' | 'archived'
  created_at: string    
  autor_id: string
  icon_name?: string
}

export interface InfoCard {
  cardName: string
  icon: string
  count: number
}

export interface InfosResponse {
  data: Info[]
  hasMore: boolean
}

export interface CreateInfoPayload {
  title: string
  body: string
  local: string
  tags: string[]
}