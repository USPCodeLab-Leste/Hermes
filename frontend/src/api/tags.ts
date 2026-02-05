import { fakeRequest } from "./client";
import { eventTagsByType, mockEventTags } from "../mocks/tags.mock";

export function getEventTagsByType() {
  return fakeRequest(eventTagsByType);
}

export function getEventTags() {
  return fakeRequest(mockEventTags);
}