import type { Event } from '../types/events'
import type { Tag, EventTagType } from '../types/tag';
import { getEventTagByName } from './tags.mock'

export const mockEvents = [
  {
    title: 'Vôlei do CodeLab',
    data_inicio: '2026-02-28T10:00:00Z',
    data_fim: '2026-02-28T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Localização do Evento',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    tags: [
      'SI',
      'CodeLab',
      'Vôlei'
    ],
    status: 'published'
  },
  {
    title: 'Festa CodeLab',
    data_inicio: '2026-03-01T10:00:00Z',
    data_fim: '2026-03-01T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Outro Local',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    tags: [
      'SI',
      'CodeLab',
      'Festa'
    ],
    status: 'published'
  },
  {
    title: 'Hackathon CodeLab',
    data_inicio: '2026-03-05T10:00:00Z',
    data_fim: '2026-03-06T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Tech Hub',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'SI',
      'CodeLab',
      'Hackathon'
    ],
    status: 'published'
  },
  {
    title: 'Campeonato de Futebol',
    data_inicio: '2026-03-10T10:00:00Z',
    data_fim: '2026-03-15T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Campo Central',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'Futebol',
    ],
    status: 'published'
  },
  {
    title: 'Workshop de Design',
    data_inicio: '2026-03-18T10:00:00Z',
    data_fim: '2026-03-18T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Sala de Aula - Bloco A',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'SI',
      'MKT',
      'Workshop'
    ],
    status: 'published'
  },
  {
    title: 'Campeonato de Xadrez',
    data_inicio: '2026-03-20T10:00:00Z',
    data_fim: '2026-03-22T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Biblioteca Central',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'Xadrez',
      'Competição'
    ],
    status: 'published'
  },
  {
    title: 'Festa de Confraternização SI',
    data_inicio: '2026-03-23T10:00:00Z',
    data_fim: '2026-03-23T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Pátio da Faculdade',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'SI',
      'Festa',
    ],
    status: 'published'
  },
  {
    title: 'Aula de Calistenia',
    data_inicio: '2026-03-24T10:00:00Z',
    data_fim: '2026-03-24T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Quadra Poliesportiva',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'Calistenia',
      'EFS'
    ],
    status: 'published'
  },
  {
    title: 'Meetup Conway Dev',
    data_inicio: '2026-03-25T10:00:00Z',
    data_fim: '2026-03-25T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Auditório Principal',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'SI',
      'Conway'
    ],
    status: 'published'
  },
  {
    title: 'Campeonato de Basquete',
    data_inicio: '2026-03-26T10:00:00Z',
    data_fim: '2026-03-31T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Ginásio Coberto',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'Basquete',
    ],
    status: 'published'
  },
  {
    title: 'Show Música ao Vivo',
    data_inicio: '2026-04-02T10:00:00Z',
    data_fim: '2026-04-02T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Anfiteatro',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'Música',
      'Festa'
    ],
    status: 'published'
  },
  {
    title: 'Palestra Empreendedorismo',
    data_inicio: '2026-04-05T10:00:00Z',
    data_fim: '2026-04-05T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Sala de Conferência',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',

    tags: [
      'MKT',
      'GER',
    ],
    status: 'published'
  },
  {
    title: 'Torneio de Vôlei Misto',
    data_inicio: '2026-04-10T10:00:00Z',
    data_fim: '2026-04-12T10:00:00Z',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Quadra de Vôlei',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    tags: [
      'Vôlei',
    ],
    status: 'published'
  }
].map((event, index) => ({
  ...event,
  id: 'e'+String(index),
  img_banner: `https://static.photos/640x360/${100+index}`,
  tags: event.tags.map(tag => getEventTagByName(tag)) as Tag<EventTagType>[],
  autor_id: 'a'+String(index)
})) as Event[];