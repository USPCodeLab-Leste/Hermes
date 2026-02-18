import { fakeRequest } from "./client";
import { mockEventTags } from "../mocks/tags.mock";

export function getEventTags() {
  return fakeRequest(mockEventTags);
}