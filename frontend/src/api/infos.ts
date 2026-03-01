import { apiRequest } from './client'
import type { CreateInfoPayload, InfosResponse } from '../types/infos'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 100

function requestInfos(params: { title?: string; tags?: string[] } = {}) {
  const searchParams = new URLSearchParams()

  searchParams.set('offset', String(DEFAULT_OFFSET))
  searchParams.set('limit', String(DEFAULT_LIMIT))

  if (params.title) {
    searchParams.set('title', params.title)
  }

  if (params.tags && params.tags.length > 0) {
    for (const tag of params.tags) {
      searchParams.append('tags', tag)
    }
  }

  return apiRequest<InfosResponse>(`/infos/?${searchParams.toString()}`)
}

// Retorna as informações filtradas por título
export function getInfos(infoTitle: string) {
  return requestInfos({ title: infoTitle })
}

// Retorna as informações do autor filtradas por título
export function getMyInfos(infoTitle?: string) {
  return requestInfos({ title: infoTitle })
}

// Retorna as informações filtradas por tag
export function getInfosByTag(tagName: string, infoTitle?: string) {
  return requestInfos({ title: infoTitle, tags: [tagName] })
}

// Retorna as informações filtradas por tipo
export async function getInfoByType(type: string, title?: string): Promise<InfosResponse> {
  const response = await requestInfos({ title })

  const data = response.data.filter(info => info.tags.some(tag => tag.type === type))

  return {
    ...response,
    data,
  }
}

// Faz o post de uma nova informação
export function postInfo(data: CreateInfoPayload) {
  return apiRequest<{ message: string }>('/infos/', {
    method: 'POST',
    body: {
      title: data.title,
      body: data.body,
      local: data.local,
      tags: data.tags,
    },
  })
}

// Deleta uma informação pelo id
export function deleteInfo(infoId: string) {
  return apiRequest<{ message: string }>(`/infos/${infoId}`, {
    method: 'DELETE',
  })
}