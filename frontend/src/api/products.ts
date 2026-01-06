import { fakeRequest } from './client'
import { products } from '../mocks/products.mock'

export function getProductById(id: string) {
  return fakeRequest(products.find(p => p.id === id))
}