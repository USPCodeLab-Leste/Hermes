import { fakeRequest } from './client'
import { mockEvents as events } from '../mocks/events.mock'

export function getEvents() {
  return fakeRequest(events)
}

export function getMyEvents() {
  return fakeRequest(events)
}

export function getEventById(id: string) {
  return fakeRequest(events.find(e => e.id === id))
}