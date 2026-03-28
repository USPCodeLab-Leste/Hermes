export const eventTypes = ['entidade', 'curso', 'esporte', 'outro'] as const;
export const infoTypes = ['estudos', 'campus', 'apoios', 'carreira'] as const;

export type EventTagType = typeof eventTypes[number];
export type InfoTagType = typeof infoTypes[number];

export interface Tag<T> {
  id: string;
  name: string;
  type: T;
  active: boolean;
}

type TagId = string;
export interface ActiveTags {
  [key: TagId]: Tag<TagType>;
}

export type TagType = EventTagType | InfoTagType;
export type EventTag = Tag<EventTagType>;
export type InfoTag = Tag<InfoTagType>;
export type GenericTag = Tag<TagType>;