import type { Info, InfoCard } from '../types/infos';
import type { InfoTagType } from '../types/tag';
import { getInfoTagByName } from './tags.mock'
import testMockContent from './markdown.mock.md?raw' 

export const mockInfos = [
  // Matrícula
  {
    title: 'JupiterWeb',
    tags: ['Matrícula'],
    body: testMockContent,
    icon_name: 'planet'
  },
  {
    title: 'Disciplinas',
    tags: ['Matrícula'],
    body: testMockContent,
    icon_name: 'book'
  },
  {
    title: 'Trancamento',
    tags: ['Matrícula'],
    body: testMockContent,
    icon_name: 'lock'
  },

  // Avaliações
  {
    title: 'Calendário de Provas',
    tags: ['Avaliações'],
    body: testMockContent,
    icon_name: 'calendar'
  },
  {
    title: 'Notas e Frequência',
    tags: ['Avaliações'],
    body: testMockContent,
    icon_name: 'clipboard-check'
  }
].map((event, index) => ({
  ...event,
  id: 'i' + String(index),
  tags: event.tags.map(tag => getInfoTagByName(tag)),
  autor_id: 'a' + String(index),
  created_at: '2023-01-15T10:00:00Z',
  status: 'published'
})) as Info[];

// Icons para cada tag de Info, agrupados pelo tipo da tag
export const infoTagIcons: Record<InfoTagType, InfoCard[]> = {
  'estudos': [
    {
      card: 'Matrícula',
      icon: 'book'
    },
    {
      card: 'Avaliações',
      icon: 'abacus'
    },
    {
      card: 'Progressão',
      icon: 'clock'
    },
    {
      card: 'Conclusão',
      icon: 'graduation'
    }
  ],
  'campus': [
    {
      card: 'Alimentação',
      icon: 'apple'
    },
    {
      card: 'Transporte',
      icon: 'bus'
    },
    {
      card: 'Biblioteca',
      icon: 'books'
    },
    {
      card: 'Saúde',
      icon: 'first-aid'
    }
  ],
  'apoios': [
    {
      card: 'Bolsas',
      icon: 'money-bill-wave'
    }
  ],
  'carreira': [
    {
      card: 'Estágios',
      icon: 'briefcase'
    }
  ]
}