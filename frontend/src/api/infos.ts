import { fakeRequest } from './client'
import { mockInfos as infos } from '../mocks/infos.mock'

// Retorna todas as informações
export function getInfos() {
  return fakeRequest(infos)
}

// Retorna as informações filtradas por título
export function getInfosByTitle(infoTitle: string) {
  return fakeRequest(infos.filter(info => info.title.toLowerCase().includes(infoTitle.toLowerCase())))
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