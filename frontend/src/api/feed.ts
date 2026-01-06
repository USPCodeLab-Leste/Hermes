import { fakeRequest } from './client'
import { products } from '../mocks/products.mock'

export function getForYouFeed() {
  return fakeRequest(products)
}

export function getFollowingFeed() {
  return fakeRequest(products)
}