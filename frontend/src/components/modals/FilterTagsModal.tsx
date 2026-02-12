import { motion, type Variants } from "framer-motion"
import { useState, useMemo, useEffect, useCallback } from "react"
import { toast } from "react-toastify"

// Hooks
import { useTags } from "../../hooks/tags/useTags"

// Componentes
import { ModalWrapper } from "./Modal"
import { Tags } from "../Events"
import { GenericButton as Button } from "../GenericButton"
import { type ActiveTags, type TagType } from "../../types/tag"

const filterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

interface FilterTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTags: ActiveTags;
  handleApplyFilter: (activeTagsCopy: ActiveTags) => void;
}

export function FilterTagsModal({ isOpen, onClose, activeTags, handleApplyFilter }: FilterTagsModalProps) {
  const { data: tagsData, isLoading: isTagsLoading } = useTags(isOpen)
  const [activeTagsCopy, setActiveTagsCopy] = useState<ActiveTags>({} as ActiveTags)
  
  // ==================
  // == Memos
  // ==================

  // Agrupa as tags por tipo
  const tagsByType = useMemo(() => {
    return tagsData?.reduce((acc, tag) => {
      if (!acc[tag.type]) {
        acc[tag.type] = [];
      }
      acc[tag.type].push(tag);
      return acc;
    }, {} as Record<string, typeof tagsData>);
  }, [tagsData])

  // Cria um array de entries para iteração no render
  const tagsEntries = useMemo(() => Object.entries(tagsByType ?? {}), [tagsByType])

  // ==================
  // == Handlers
  // ==================

  // Adiciona ou remove tag dos filtros ativos no modal
  const handleFilterTagClick = useCallback((tag: { name?: string; type?: TagType }) => {
    setActiveTagsCopy((prevActiveTags) => {
      const tagType = tag.type!;
      const tagName = tag.name!;
      const currentTags = prevActiveTags[tagType] || [];
      let updatedTags: string[];

      if (currentTags.includes(tagName)) {
        // Remover tag
        updatedTags = currentTags.filter((name) => name !== tagName);
      } else {
        // Adicionar tag
        updatedTags = [...currentTags, tagName];
      }

      return {        
        ...prevActiveTags,
        [tagType]: updatedTags,
      };
    });
  }, [])

  // Limpa todos os filtros ativos
  const handleClean = useCallback(() => {
    setActiveTagsCopy({} as Record<TagType, string[]>)
    toast.success("Filtros limpos com sucesso!")
  }, [])

  // ==================
  // Effects
  // ==================

  useEffect(() => {
    if (isOpen) {
      setActiveTagsCopy(structuredClone(activeTags))
    }
  }, [isOpen])

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
    >
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl text-center">Filtros de Busca</h2>
        <div className="max-h-70 overflow-y-auto">
          {isTagsLoading ? <p>Carregando tags...</p> : (
            <>
              {tagsEntries.map(([type, tags]) => (
                <motion.div 
                  className="mb-6" key={`${type}-tags-filter`}
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="capitalize font-medium mb-1 text-ink/75 dark:text-paper/75">{type}</h3>
                  <Tags tags={tags} activeTags={activeTagsCopy} canSelect={true} onClick={handleFilterTagClick} />
                </motion.div>
              ))}
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            onClick={() => handleApplyFilter(activeTagsCopy)}
          >

            <span className="text-paper">Aplicar Filtros</span>
          </Button>
          <Button
            className="bg-transparent border-4 border-teal-light hover:border-teal-mid "
            onClick={handleClean}
          >

            <span className="">Limpar Filtros</span>
          </Button>
        </div>
      </section>
    </ModalWrapper>
  )
}