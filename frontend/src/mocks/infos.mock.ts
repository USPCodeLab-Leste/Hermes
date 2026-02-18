import type { Info } from '../types/infos';
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
  },

  // Progressão
  {
    title: 'Créditos',
    tags: ['Progressão'],
    body: testMockContent,
    icon_name: 'clock'
  },

  // Conclusão
  {
    title: 'Formatura',
    tags: ['Conclusão'],
    body: testMockContent,
    icon_name: 'graduation'
  },

  // Alimentação
  {
    title: 'Bandejão',
    tags: ['Alimentação'],
    body: testMockContent,
    icon_name: 'apple'
  },

  // Transporte
  {
    title: 'Rotas de Ônibus',
    tags: ['Transporte'],
    body: testMockContent,
    icon_name: 'bus'
  },

  // Biblioteca
  {
    title: 'Catálogo',
    tags: ['Biblioteca'],
    body: testMockContent,
    icon_name: 'books'
  },

  // Saúde
  {
    title: 'Atendimento Médico',
    tags: ['Saúde'],
    body: testMockContent,
    icon_name: 'first-aid'
  },

  // Bolsas
  {
    title: 'Bolsas de Estudo',
    tags: ['Bolsas'],
    body: testMockContent,
    icon_name: 'money-bill-wave'
  },

  // Estágios
  {
    title: 'Oportunidades de Estágio',
    tags: ['Estágios'],
    body: testMockContent,
    icon_name: 'briefcase'
  }
].map((event, index) => ({
  ...event,
  id: 'i' + String(index),
  tags: event.tags.map(tag => getInfoTagByName(tag)),
  autor_id: 'a' + String(index),
  created_at: '2023-01-15T10:00:00Z',
  status: 'published'
})) as Info[];