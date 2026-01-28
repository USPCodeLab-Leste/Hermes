import { fakeRequest } from "./client";
import { mockTags, tagsByType } from "../mocks/tags.mock";

export function getTagsByType() {
  return fakeRequest(tagsByType);
}

export function getTags() {
  return fakeRequest(mockTags);
}