import { fakeRequest } from './client'
import { mockEvents as events } from '../mocks/events.mock'
import { getEventTagByName, mockEventTags } from '../mocks/tags.mock';
import type { EventTagType, Tag } from '../types/tag';
import { normalizeString } from '../utils/string';

// Retorna os eventos com base em um título e/ou tags
export function getEvents(eventTitle?: string, tags?: string[]) {
  return fakeRequest(events.filter(e => {
    const matchesTitle = eventTitle
      ? normalizeString(e.title).includes(normalizeString(eventTitle.trim()))
      : true;
    const matchesTags = tags && tags.length > 0 ? tags.every(tag => e.tags.some(eventTag => eventTag.name === tag)) : true;

    return matchesTitle && matchesTags;
  }));
}

// Retorna os eventos para o feed
export function getFeed() {
  return fakeRequest(events.filter(e => e.status === 'published'));
}

// Retorna os eventos criados pelo usuário
export function getMyEvents(eventTitle?: string) {
  return fakeRequest(events.filter(e => {
    return eventTitle ? normalizeString(e.title).includes(normalizeString(eventTitle)) : true;
  }));
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