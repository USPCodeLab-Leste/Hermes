import { fakeRequest } from './client'
import { mockInfos as infos } from '../mocks/infos.mock'

export function getInfos() {
  return fakeRequest(infos)
}

export function getInfosByType(type: string) {
  return fakeRequest(infos.filter(info => info.tags.some(tag => tag.type === type)))
}

export function getInfosCountByType(type: string) {
  const filteredInfos = infos.filter(info => info.tags.some(tag => tag.type === type))
  const reduced = filteredInfos.reduce((acc, info) => {
    for (const tag of info.tags) {
      if (!acc[tag.name]) {
        acc[tag.name] = 0
      }
      acc[tag.name] += 1
    }
    return acc
  }, {} as Record<string, number>)

  return fakeRequest(reduced)
}

export function getInfosByTag(tagId: string) {
  return fakeRequest(infos.filter(info => info.tags.some(tag => tag.id === tagId)))
}

export function getInfoById(id: string) {
  return fakeRequest(infos.find(e => e.id === id))
}