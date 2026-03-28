import type { EventTagType } from "./tag"
import type { Info } from "./infos"

export interface Event extends Info<EventTagType> {
  data_inicio: string
  data_fim: string
  local: string
  img_banner: string
}

export interface EventsResponse {
  data: Event[]
  hasMore: boolean
}

export interface UseEventsParams {
  eventTitle?: string
  tags?: string[]
  limit?: number
}