export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: 'doces' | 'salgados' | 'servicos' | 'ingressos'
  images: string[]
  sellerId: string
  createdAt: string
  distanceKm?: number
}