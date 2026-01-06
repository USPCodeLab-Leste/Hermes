import type { Product } from '../types/product'

export const products: Product[] = [
  {
    id: 'p1',
    title: 'Brigadeiro Gourmet',
    description: 'Brigadeiro artesanal com chocolate belga.',
    price: 3.6,
    category: 'doces',
    images: ['/products/brigadeiro1.png'],
    sellerId: 'u2',
    createdAt: new Date().toISOString(),
    distanceKm: 2.4,
  },
]