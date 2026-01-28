import type { Event } from '../types/events'

export const events: Event[] = [
  {
    id: 'e1',
    title: 'Vôlei do CodeLab',
    date: '30/02/2026',
    location: 'Localização do Evento',
    description: 'Descrição do evento de exemplo.',
    tags: [
      'SI',
      'CodeLab',
      'Vôlei'
    ]
  },
  {
    id: 'e2',
    title: 'Festa CodeLab',
    date: '31/02/2026',
    location: 'Outro Local',
    description: 'Descrição de outro evento.',
    tags: [
      'SI',
      'CodeLab',
      'Festa'
    ]
  },
  {
    id: 'e3',
    title: 'Hackathon CodeLab',
    date: '01/03/2026',
    location: 'Tech Hub',
    description: 'Descrição do hackathon.',
    tags: [
      'SI',
      'CodeLab',
      'Hackathon'
    ]
  }
]