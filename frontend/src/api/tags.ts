import { apiRequest } from "./client";
import { type EventTag, type InfoTag, type GenericTag, type EventTagType, type InfoTagType, type TagType, eventTypes, infoTypes } from "../types/tag";

const EVENT_TAG_TYPES = eventTypes
const INFO_TAG_TYPES = infoTypes

function isEventTag(tag: GenericTag): tag is EventTag {
  return EVENT_TAG_TYPES.includes(tag.type as EventTagType);
}

function isInfoTag(tag: GenericTag): tag is InfoTag {
  return INFO_TAG_TYPES.includes(tag.type as InfoTagType);
}

// Busca todas as tags na API
interface TagsResponse {
  tags: GenericTag[];
}

export async function getTags() {
  const res = await apiRequest<TagsResponse>("/tags");
  return res.tags;
}

export interface CreateTagPayload {
  name: string;
  type: TagType;
}

export function createTag(payload: CreateTagPayload) {
  return apiRequest<GenericTag>("/tags", {
    method: "POST",
    body: {
      name: payload.name,
      type: payload.type,
    },
  });
}

// Versão nova para event tags, baseada em getTags (não remove a antiga)
export async function getEventTags() {
  const tags = await getTags();
  console.log("Tags recebidas da API:", tags); // Log para depuração
  return tags.filter(isEventTag);
}

// Retorna somente as tags de infos
export async function getInfoTags() {
  const tags = await getTags();
  console.log("Tags recebidas da API:", tags); // Log para depuração
  return tags.filter(isInfoTag);
}