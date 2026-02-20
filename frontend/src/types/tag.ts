import { eventTypes, infoTypes } from "../mocks/tags.mock";

export type EventTagType = typeof eventTypes[number];
export type InfoTagType = typeof infoTypes[number];

export interface Tag<T> {
  id: string;
  name: string;
  type: T;
}

type TagId = string;
export interface ActiveTags {
  [key: TagId]: Tag<TagType>;
}

export type TagType = EventTagType | InfoTagType;
export type EventTag = Tag<EventTagType>;
export type InfoTag = Tag<InfoTagType>;
export type GenericTag = Tag<TagType>;