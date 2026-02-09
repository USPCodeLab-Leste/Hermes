import type { Info, InfoCard } from '../types/infos';
import type { Tag, InfoTagType } from '../types/tag';
import { getInfoTagByName } from './tags.mock'

export const mockInfos = [
  // Matrícula
  {
    title: 'JupiterWeb',
    tags: [
      'Matrícula'
    ],
    body: "Sistema de gestão acadêmica utilizado pela universidade para controle de matrículas, notas e frequência dos alunos.",
    icon_name: 'planet'
  },
  {
    title: 'Disciplinas',
    tags: [
      'Matrícula'
    ],
    body: "Lista de disciplinas oferecidas pela universidade, incluindo informações sobre carga horária, professor responsável e ementa.",
    icon_name: 'book'
  },
  {
    title: 'Trancamento',
    tags: [
      'Matrícula'
    ],
    body: "Procedimento que permite ao aluno interromper temporariamente seus estudos na universidade, sem perder o vínculo acadêmico.",
    icon_name: 'lock'
  },
  // Avaliações
  {
    title: 'Calendário de Provas',
    tags: [
      'Avaliações'
    ],
    body: "Cronograma com as datas das provas, trabalhos e outras avaliações para cada disciplina do semestre.",
    icon_name: 'calendar'
  },
  {
    title: 'Notas e Frequência',
    tags: [
      'Avaliações'
    ],
    body: "Sistema onde os alunos podem consultar suas notas e frequência em cada disciplina, atualizado regularmente pelos professores.",
    icon_name: 'clipboard-check'
  }
].map((event, index) => ({
  ...event,
  id: 'i'+String(index),
  tags: event.tags.map(tag => getInfoTagByName(tag)) as Tag<InfoTagType>[],
  autor_id: 'a'+String(index),
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