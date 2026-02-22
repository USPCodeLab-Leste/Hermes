import { fakeRequest } from './client'
import { mockEvents as events } from '../mocks/events.mock'
import { getEventTagByName, mockEventTags } from '../mocks/tags.mock';
import type { EventTagType, Tag } from '../types/tag';
import { normalizeString } from '../utils/string';

function paginate<T>(items: T[], offset: number, limit: number) {
  const data = items.slice(offset, offset + limit)
  const hasMore = offset + limit < items.length

  return { data, hasMore }
}

interface GetEventsParams {
  offset: number
  limit: number
  title?: string
  tags?: string[]
}

// Retorna os eventos com base em um título e/ou tags
export function getEvents({ offset, limit, title, tags }: GetEventsParams) {
  const filteredEvents = events.filter((e) => {
    const matchesTitle = title
      ? normalizeString(e.title).includes(normalizeString(title))
      : true

    const matchesTags =
      tags && tags.length > 0
        ? tags.every((tag) =>
            e.tags.some((eventTag) => eventTag.name === tag)
          )
        : true

    return matchesTitle && matchesTags
  })

  return fakeRequest(paginate(filteredEvents, offset, limit))
}

interface GetFeedParams {
  offset: number
  limit: number
}

export function getFeed({
  offset,
  limit,
}: GetFeedParams) {
  const publishedEvents = events.filter((e) => e.status === 'published')

  return fakeRequest(paginate(publishedEvents, offset, limit))
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

  const filteredEvents = events.filter((e) => title ? normalizeString(e.title).includes(normalizeString(title)) : true)

  return fakeRequest(paginate(filteredEvents, offset, limit))
}

// Retorna um evento específico pelo ID
export function getEventById(id: string) {
  return fakeRequest(events.find(e => e.id === id))
}

// Faz o post de um evento
export function postEvent(data: any) {
  events.unshift({
    ...data,
    tags: data.tags.map((tag: string) => getEventTagByName(tag)) as Tag<EventTagType>[],
    autor_id: 'fake-user-id-123',
    created_at: new Date().toISOString(),
    id: 'event-' + crypto.randomUUID(),
    status: 'published',
  })

  for (const tagName of data.tags) {
    if (!mockEventTags.some(tag => tag.name === tagName)) {
      mockEventTags.push({
        id: 'event-tag-outro-' + tagName,
        name: tagName,
        type: "outro",
      });
    }
  }

  return fakeRequest({
    message: "Evento criado com sucesso",
  });
}