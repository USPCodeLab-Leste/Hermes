import { fakeRequest } from './client'
import { mockInfos as infos } from '../mocks/infos.mock'
import { mockInfoTags } from '../mocks/tags.mock'
import type { InfoTagType, Tag } from '../types/tag'
import { normalizeString } from '../utils/string'

function paginate<T>(items: T[]) {
  const data = items
  const hasMore = true

  return { data, hasMore }
}

// Retorna todas as informações
export function getInfos() {
  return fakeRequest(paginate(infos))
}

// Retorna as informações filtradas por título
export function getInfosByTitle(infoTitle: string) {
  const filtered = infos.filter(info => normalizeString(info.title).includes(normalizeString(infoTitle)))

  return fakeRequest(paginate(filtered))
}

// Retorna as informações do autor (mock) filtradas por título
export function getMyInfos(infoTitle?: string) {
  const filtered = infos.filter(info => infoTitle ? normalizeString(info.title).includes(normalizeString(infoTitle)) : true)

  return fakeRequest(paginate(filtered))
}

// Faz o post de uma nova informação
export function postInfo(data: {
  title: string
  body: string
  local: string
  tags: string[]
  type: InfoTagType
  icon_name?: string
}) {
  // Garante que as tags existam no mock (ou cria novas) e retorna os objetos de tag completos
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

  // Adiciona a nova informação no início da lista (simulando que é a mais recente)
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

// Deleta uma informação pelo id
export function deleteInfo(infoId: string) {
  const index = infos.findIndex((info) => info.id === infoId)

  if (index === -1) {
    throw new Error('Informação não encontrada')
  }

  infos.splice(index, 1)

  return fakeRequest({
    message: 'Informação deletada com sucesso',
    id: infoId,
  })
}

// Retorna as informações filtradas por tag
export function getInfosByTag(tagName: string, infoTitle?: string) {
  return fakeRequest(paginate(infos.filter(info => {
    return info.tags.some(tag => tag.name === tagName) && (!infoTitle || normalizeString(info.title).includes(normalizeString(infoTitle)))
  })))
}

// Retorna as informações filtradas por tipo
export function getInfoByType(type: string, title?: string) {
  return fakeRequest(paginate(infos.filter(info => {
    return info.tags.some(tag => tag.type === type) && (!title || normalizeString(info.title).includes(normalizeString(title)))
  })))
}