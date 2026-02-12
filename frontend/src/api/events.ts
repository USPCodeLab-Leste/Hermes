import { fakeRequest } from './client'
import { mockEvents as events } from '../mocks/events.mock'

export function getEvents(eventTitle?: string, tags?: string[]) {
  return fakeRequest(events.filter(e => {
    const matchesTitle = eventTitle ? e.title.toLowerCase().includes(eventTitle.toLowerCase()) : true;
    const matchesTags = tags && tags.length > 0 ? tags.every(tag => e.tags.some(eventTag => eventTag.name === tag)) : true;

    return matchesTitle && matchesTags;
  }));
}

export function getMyEvents() {
  return fakeRequest(events)
}

export function getEventById(id: string) {
  return fakeRequest(events.find(e => e.id === id))
}