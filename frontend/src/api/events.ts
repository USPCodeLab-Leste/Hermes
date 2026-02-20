import { fakeRequest } from './client'
import { mockEvents as events } from '../mocks/events.mock'
import { getEventTagByName, mockEventTags } from '../mocks/tags.mock';
import type { EventTagType, Tag } from '../types/tag';

export function getEvents(eventTitle?: string, tags?: string[]) {
  return fakeRequest(events.filter(e => {
    const matchesTitle = eventTitle ? e.title.toLowerCase().includes(eventTitle.toLowerCase()) : true;
    const matchesTags = tags && tags.length > 0 ? tags.every(tag => e.tags.some(eventTag => eventTag.name === tag)) : true;

    return matchesTitle && matchesTags;
  }));
}

export function getMyEvents(eventTitle?: string) {
  return fakeRequest(events.filter(e => {
    return eventTitle ? e.title.toLowerCase().includes(eventTitle.toLowerCase()) : true;
  }));
}

export function getEventById(id: string) {
  return fakeRequest(events.find(e => e.id === id))
}

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