import type { Tag, TagType } from "../types/tag";

export const tagsTypes = ['entidade', 'curso', 'esporte', 'outro'] as const;

export const mockTags = [
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
  { name: 'Wokshop', type: 'outro' },

].map((tag, index) => ({ ...tag, id: String(index) })) as Tag[];

export const tagsByType = mockTags.reduce((acc, tag) => {
  if (!acc[tag.type]) {
    acc[tag.type] = [];
  }
  acc[tag.type].push(tag);
  return acc;
}, {} as Record<TagType, Tag[]>);