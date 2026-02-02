import { tagsTypes } from "../mocks/tags.mock";

export type TagType = typeof tagsTypes[number];

export interface Tag {
  id: string;
  name: string;
  type: TagType;
}