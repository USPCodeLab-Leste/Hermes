import { apiRequest } from './client'
import type { Event, EventsResponse } from '../types/events';

interface GetEventsParams {
  offset: number
  limit: number
  title?: string
  tags?: string[]
}

// Retorna os eventos com base em um título e/ou tags da API /events
export function getEvents({ offset, limit, title, tags }: GetEventsParams) {
  const params = new URLSearchParams()

  params.set('offset', String(offset))
  params.set('limit', String(limit))

  if (title) {
    params.set('title', title)
  }

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      params.append('tag', tag)
    }
  }

  return apiRequest<EventsResponse>(`/events?${params.toString()}`)
}

interface GetFeedParams {
  offset: number
  limit: number
}

interface MuralResponse {
  mural: Event[]
  hasMore: boolean
}

// Retorna o mural personalizado do usuário a partir da rota /mural
export async function getFeed({
  offset,
  limit,
}: GetFeedParams): Promise<EventsResponse> {
  const params = new URLSearchParams()
  params.set('offset', String(offset))
  params.set('limit', String(limit))

  const response = await apiRequest<MuralResponse>(`/mural?${params.toString()}`)

  return {
    data: response.mural,
    hasMore: response.hasMore,
  }
}

// Retorna os eventos criados pelo usuário
interface GetMyEventsParams {
  offset: number
  limit: number
  title?: string
}

// Retorna os eventos criados pelo usuário, com filtro opcional por título
export function getMyEvents(params: GetMyEventsParams) {
  const { offset, limit, title } = params

  // Por enquanto, reutiliza a mesma lógica de getEvents
  return getEvents({
    offset,
    limit,
    title,
    tags: undefined,
  })
}

// Retorna um evento específico pelo ID
export function getEventById(id: string) {
  return apiRequest<Event>(`/events/${id}`)
}

// Faz o post de um evento
export function postEvent(data: any) {
  return apiRequest<{ message: string }>("/events", {
    method: "POST",
    body: data,
  });
}

// Atualiza parcialmente um evento
export function patchEvent(id: string, data: any) {
  return apiRequest<{ message: string }>(`/events/${id}`, {
    method: "PATCH",
    body: data,
  });
}

// Deleta um evento pelo id
export function deleteEvent(eventId: string) {
  return apiRequest<{ message: string }>(`/events/${eventId}`, {
    method: "DELETE",
  });
}