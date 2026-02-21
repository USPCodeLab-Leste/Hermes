import { fakeRequest } from './client'
import { mockInfos as infos } from '../mocks/infos.mock'
import { mockInfoTags } from '../mocks/tags.mock'
import type { InfoTagType, Tag } from '../types/tag'

// Retorna todas as informações
export function getInfos() {
  return fakeRequest(infos)
}

// Retorna as informações filtradas por título
export function getInfosByTitle(infoTitle: string) {
  return fakeRequest(infos.filter(info => info.title.toLowerCase().includes(infoTitle.toLowerCase())))
}

// Retorna as informações do autor (mock) filtradas por título
export function getMyInfos(infoTitle?: string) {
  return fakeRequest(
    infos.filter(info => {
      return infoTitle ? info.title.toLowerCase().includes(infoTitle.toLowerCase()) : true
    })
  )
}

export function postInfo(data: {
  title: string
  body: string
  local: string
  tags: string[]
  type: InfoTagType
  icon_name?: string
}) {
  const tags = data.tags.map((tagName) => {
    const existing = mockInfoTags.find(
      (t) => t.name === tagName && t.type === data.type,
    );

    if (existing) return existing as Tag<InfoTagType>;

    const created = {
      id: 'info-tag-' + data.type + '-' + tagName,
      name: tagName,
      type: data.type,
    } as Tag<InfoTagType>;

    mockInfoTags.push(created);
    return created;
  });

  infos.unshift({
    id: 'info-' + crypto.randomUUID(),
    title: data.title,
    body: data.body,
    local: data.local,
    tags,
    autor_id: 'fake-user-id-123',
    created_at: new Date().toISOString(),
    status: 'published',
    icon_name: data.icon_name ?? 'unknown',
  });

  return fakeRequest({
    message: 'Informação criada com sucesso',
  });
}

// Retorna as informações filtradas por tag
export function getInfosByTag(tagName: string, infoTitle?: string) {
  return fakeRequest(infos.filter(info => {
    return info.tags.some(tag => tag.name === tagName) && (!infoTitle || info.title.toLowerCase().includes(infoTitle.toLowerCase()))
  }))
}

// Retorna as informações filtradas por tipo
export function getInfoByType(type: string, title?: string) {
  return fakeRequest(infos.filter(info => {
    return info.tags.some(tag => tag.type === type) && (!title || info.title.toLowerCase().includes(title.toLowerCase()))
  }))
}