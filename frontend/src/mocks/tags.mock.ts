import type { EventTagType, InfoTagType, Tag } from "../types/tag";

export const eventTypes = ['entidade', 'curso', 'esporte', 'outro'] as const;
export const infoTypes = ['estudos', 'campus', 'apoios', 'carreira'] as const;

// ==========================
// == Event Tags Mock
// ==========================
export const mockEventTags = [
  // Entidades
  { name: 'CodeLab', type: 'entidade' },
  { name: 'Conway', type: 'entidade' },
  { name: 'Síntese JR.', type: 'entidade' },
  { name: 'DASI', type: 'entidade' },
  { name: 'COSSI', type: 'entidade' },
  { name: 'EiTS', type: 'entidade' },


  // Esportes
  { name: 'Basquete', type: 'esporte' },
  { name: 'Futebol', type: 'esporte' },
  { name: 'Vôlei', type: 'esporte' },
  { name: 'Calistenia', type: 'esporte' },
  { name: 'Xadrez', type: 'esporte' },
  
  // Cursos
  { name: 'SI', type: 'curso' },
  { name: 'GA', type: 'curso' },
  { name: 'LZT', type: 'curso' },
  { name: 'MKT', type: 'curso' },
  { name: 'GER', type: 'curso' },
  { name: 'LCN', type: 'curso' },
  { name: 'EFS', type: 'curso' },
  { name: 'GPP', type: 'curso' },
  { name: 'OBS', type: 'curso' },
  { name: 'TM', type: 'curso' },
  { name: 'BIOTEC', type: 'curso' },

  // Outros
  { name: 'Festa', type: 'outro' },
  { name: 'Música', type: 'outro' },
  { name: 'Competição', type: 'outro' },
  { name: 'Workshop', type: 'outro' },
  { name: 'Hackathon', type: 'outro' },

].map((tag, index) => ({ ...tag, id: 'event-tag-' + String(index) })) as Tag<EventTagType>[];

// ==========================
// == Info Tags Mock
// ==========================
export const mockInfoTags = [
  // Estudos
  { name: 'Matrícula', type: 'estudos' },
  { name: 'Avaliações', type: 'estudos' },
  { name: 'Progressão', type: 'estudos' },
  { name: 'Conclusão', type: 'estudos' },

  // Campus
  { name: 'Alimentação', type: 'campus' },
  { name: 'Transporte', type: 'campus' },
  { name: 'Saúde', type: 'campus' },
  { name: 'Biblioteca', type: 'campus' },

  // Apoios
  { name: 'Psicológico', type: 'apoios' },
  { name: 'Financeiro', type: 'apoios' },
  { name: 'Acadêmico', type: 'apoios' },
  { name: 'Bolsas', type: 'apoios' },

  // Carreiras
  { name: 'Estágios', type: 'carreira' },
  { name: 'Empregos', type: 'carreira' },
  { name: 'Mentorias', type: 'carreira' },
].map((tag, index) => ({ ...tag, id: 'info-tag-' + String(index) })) as Tag<InfoTagType>[];

// ==========================
// == Funções auxiliares
// ==========================

// Agrupa as event tags por tipo para facilitar o acesso
export const eventTagsByType = mockEventTags.reduce((acc, tag) => {
  if (!acc[tag.type]) {
    acc[tag.type] = [];
  }
  acc[tag.type].push(tag);
  return acc;
}, {} as Record<EventTagType, Tag<EventTagType>[]>);

// Agrupa as info tags por tipo para facilitar o acesso
export const infoTagsByType = mockInfoTags.reduce((acc, tag) => {
  if (!acc[tag.type]) {
    acc[tag.type] = [];
  }
  acc[tag.type].push(tag);
  return acc;
}, {} as Record<InfoTagType, Tag<InfoTagType>[]>);

// Retorna uma tag de evento pelo nome
export const getEventTagByName = (name: string): Tag<EventTagType> | undefined => {
  return mockEventTags.find(tag => tag.name === name);
}

// Retorna uma tag de informação pelo nome
export const getInfoTagByName = (name: string): Tag<InfoTagType> | undefined => {
  return mockInfoTags.find(tag => tag.name === name);
}