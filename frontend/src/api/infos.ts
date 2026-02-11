import { fakeRequest } from './client'
import { mockInfos as infos, infoTagIcons } from '../mocks/infos.mock'

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
  // TODO: trocar por ID de fato(?)
  return fakeRequest(infos.filter(info => info.tags.some(tag => tag.name === tagId)))
}

export function getInfoById(id: string) {
  return fakeRequest(infos.find(e => e.id === id))
}

export function getInfosCardsByType(type: string) {
  return fakeRequest(infoTagIcons[type as keyof typeof infoTagIcons] || {})
}

export function getInfoByTitleAndType(title: string, type: string) {
  return fakeRequest(infos.filter(info => {
    return info.tags.some(tag => tag.type === type) && info.title.toLowerCase().includes(title.toLowerCase())
  }))
}