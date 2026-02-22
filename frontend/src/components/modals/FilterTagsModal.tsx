import { motion, type Variants } from "framer-motion"
import { useState, useMemo, useEffect, useCallback } from "react"

// Hooks
import { useTags } from "../../hooks/tags/useTags"

// Componentes
import { ModalWrapper } from "./Modal"
import { SelectTags } from "../Events"
import { GenericButton as Button } from "../GenericButton"
import { type GenericTag, type ActiveTags } from "../../types/tag"
import { FilterTagSkeleton } from "../skeletons/FilterTagSkeleton"

const filterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

interface FilterTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTags: ActiveTags;
  onFilter: (activeTagsCopy: ActiveTags) => void;
  onClean: () => void;
}

export function FilterTagsModal({ isOpen, onClose, activeTags, onFilter, onClean }: FilterTagsModalProps) {
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
  const handleFilterTagClick = useCallback((tag: GenericTag) => {
    setActiveTagsCopy((prev) => {
      if (prev[tag.id]) {
        const { [tag.id]: _, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [tag.id]: tag,
        }
      }
    })
  }, [])

  // ==================
  // Effects
  // ==================

  useEffect(() => {
    if (!isOpen) return

    setActiveTagsCopy(structuredClone(activeTags))
  }, [isOpen, activeTags])

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
    >
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl text-center">Filtros de Busca</h2>
        <div className="max-h-70 overflow-y-auto flex flex-col gap-6">
          {isTagsLoading ? (
            <FilterTagSkeleton />
          ) : (
            <>
              {tagsEntries.map(([type, tags]) => (
                <motion.div 
                  key={`${type}-tags-filter`}
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="capitalize font-medium mb-1 text-ink/75 dark:text-paper/75">{type}</h3>
                  <SelectTags tags={tags} activeTags={activeTagsCopy} canSelect={true} onClick={handleFilterTagClick} />
                </motion.div>
              ))}
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            onClick={() => onFilter(activeTagsCopy)}
          >

            <span className="text-paper">Aplicar Filtros</span>
          </Button>
          <Button
            className="bg-transparent border-4 border-teal-light hover:border-teal-mid "
            onClick={onClean}
          >

            <span className="">Limpar Filtros</span>
          </Button>
        </div>
      </section>
    </ModalWrapper>
  )
}