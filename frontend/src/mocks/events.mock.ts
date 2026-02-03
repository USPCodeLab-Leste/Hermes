import type { Event } from '../types/events'
import type { Tag, EventTagType } from '../types/tag';
import { getEventTagByName } from './tags.mock'

export const mockEvents = [
  {
    title: 'Vôlei do CodeLab',
    data_inicio: '30/02/2026',
    data_fim: '30/02/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Localização do Evento',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',
    tags: [
      'SI',
      'CodeLab',
      'Vôlei'
    ],
    status: 'published'
  },
  {
    title: 'Festa CodeLab',
    data_inicio: '31/02/2026',
    data_fim: '31/02/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Outro Local',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',
    tags: [
      'SI',
      'CodeLab',
      'Festa'
    ],
    status: 'published'
  },
  {
    title: 'Hackathon CodeLab',
    data_inicio: '01/03/2026',
    data_fim: '02/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Tech Hub',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'SI',
      'CodeLab',
      'Hackathon'
    ],
    status: 'published'
  },
  {
    title: 'Campeonato de Futebol',
    data_inicio: '05/03/2026',
    data_fim: '10/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Campo Central',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'Futebol',
    ],
    status: 'published'
  },
  {
    title: 'Workshop de Design',
    data_inicio: '08/03/2026',
    data_fim: '08/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Sala de Aula - Bloco A',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'SI',
      'MKT',
      'Workshop'
    ],
    status: 'published'
  },
  {
    title: 'Campeonato de Xadrez',
    data_inicio: '10/03/2026',
    data_fim: '12/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Biblioteca Central',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'Xadrez',
      'Competição'
    ],
    status: 'published'
  },
  {
    title: 'Festa de Confraternização SI',
    data_inicio: '12/03/2026',
    data_fim: '12/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Pátio da Faculdade',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'SI',
      'Festa',
    ],
    status: 'published'
  },
  {
    title: 'Aula de Calistenia',
    data_inicio: '15/03/2026',
    data_fim: '15/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Quadra Poliesportiva',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'Calistenia',
      'EFS'
    ],
    status: 'published'
  },
  {
    title: 'Meetup Conway Dev',
    data_inicio: '18/03/2026',
    data_fim: '18/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Auditório Principal',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'SI',
      'Conway'
    ],
    status: 'published'
  },
  {
    title: 'Campeonato de Basquete',
    data_inicio: '20/03/2026',
    data_fim: '25/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Ginásio Coberto',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'Basquete',
    ],
    status: 'published'
  },
  {
    title: 'Show Música ao Vivo',
    data_inicio: '22/03/2026',
    data_fim: '22/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Anfiteatro',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'Música',
      'Festa'
    ],
    status: 'published'
  },
  {
    title: 'Palestra Empreendedorismo',
    data_inicio: '25/03/2026',
    data_fim: '25/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Sala de Conferência',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',

    tags: [
      'MKT',
      'GER',
    ],
    status: 'published'
  },
  {
    title: 'Torneio de Vôlei Misto',
    data_inicio: '28/03/2026',
    data_fim: '30/03/2026',
    created_at: '2024-05-01T10:00:00Z',
    local: 'Quadra de Vôlei',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam corrupti est sunt sint labore porro, culpa consectetur asperiores voluptates placeat magni possimus, expedita laboriosam architecto, maxime optio fuga! Asperiores, dolor!',
    img_banner: 'https://picsum.photos/id/_/500/300',
    tags: [
      'Vôlei',
    ],
    status: 'published'
  }
].map((event, index) => ({
  ...event,
  id: 'e'+String(index),
  img_banner: event.img_banner.replace('_', String(Math.floor(Math.random() * 1000))),
  tags: event.tags.map(tag => getEventTagByName(tag)) as Tag<EventTagType>[],
  autor_id: 'a'+String(index)
})) as Event[];