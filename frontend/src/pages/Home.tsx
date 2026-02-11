import { motion, type Variants } from "framer-motion"
import { useCallback, useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

// Hooks
import { useEvents } from "../hooks/useEvents"
import { useTags } from "../hooks/useTags"

// Types
import type { TagType } from "../types/tag"

// Componentes
import { ModalWrapper } from "../components/modals/Modal"
import AppHeader from "../components/AppHeader"
import { EventCard, Tags } from "../components/Events"
import SearchBar from "../components/SearchBar"
import { SelectedEventDetails } from "../components/SelectedEventDetails"
import { SelectedEventDetailsSkeleton } from "../components/skeletons/SelectedEventDetailsSkeleton"
import { GenericButton as Button } from "../components/GenericButton"

// Icons
import FilterIcon from "../assets/icons/filter.svg?react"
import FilterSparkIcon from "../assets/icons/filter-spark.svg?react"
import { useSharedSearch } from "../hooks/useSharedSearch"

const filterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useSharedSearch()
  const [params, setParams] = useSearchParams()
  const { data, isLoading } = useEvents(searchQuery)

  // Modal States
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Tag States
  const [activeTags, setActiveTags] = useState<Record<TagType, string[]>>({} as Record<TagType, string[]>)
  const [activeTagsCopy, setActiveTagsCopy] = useState<Record<TagType, string[]>>({} as Record<TagType, string[]>)
  const { data: tagsData, isLoading: isTagsLoading } = useTags()

  // ===================
  // == Handlers
  // ===================

  // Abre modal do evento selecionado
  const handleEventCardClick = useCallback((id: string) => {
    setParams(prev => {
      prev.set("event", id);
      return prev;
    }, { replace: true });
  }, [setParams])

  // Fecha modal do evento
  const handleModalEventClose = useCallback(() => {
    setParams(prev => {
      prev.delete("event");
      return prev;
    }, { replace: true });

    setSelectedEventId(null);
    setIsCardModalOpen(false);
  }, [setParams, setSelectedEventId, setIsCardModalOpen])

  // Abre modal de filtros e 
  const handleFilterClick = useCallback(() => {
    setActiveTagsCopy(structuredClone(activeTags))
    setIsFilterModalOpen(true)
  }, [activeTags])

  // Fecha modal de filtros sem aplicar mudanças
  const handleModalFilterClose = useCallback(() => {
    setIsFilterModalOpen(false)
    setActiveTagsCopy(structuredClone(activeTags))
  }, [activeTags])

  // Limpa todos os filtros ativos
  const handleClean = useCallback(() => {
    // setActiveTags({} as Record<TagType, string[]>)
    setActiveTagsCopy({} as Record<TagType, string[]>)
    toast.success("Filtros limpos com sucesso!")
  }, [])

  // Aplica os filtros selecionados
  const handleApplyFilter = useCallback(() => {
    setIsFilterModalOpen(false)
    setActiveTags(structuredClone(activeTagsCopy))
    toast.success("Filtros aplicados com sucesso!")
  }, [activeTagsCopy])

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

  // ===================
  // == Memos
  // ===================

  const hasAnyFilter = useMemo(() => Object.values(activeTags).some(tags => tags.length > 0), [activeTags])
  const selectedEventData = useMemo(() => data?.find((e) => e.id === selectedEventId) ?? null, [data, selectedEventId])
  const tagsEntries = useMemo(() => Object.entries(tagsData ?? {}), [tagsData])

  // ===================
  // == Effects
  // ===================

  useEffect(() => {
    const eventId = params.get("event");

    if (eventId) {
      setSelectedEventId(eventId);
      setIsCardModalOpen(true);
    }
  }, [params])

  return (
    <>
      <AppHeader>
        <div className="flex items-center gap-4 w-full">
          <SearchBar search={searchQuery} setSearch={setSearchQuery}/>
          <button 
            onClick={handleFilterClick}
            className="cursor-pointer bg-teal-mid border-2 border-teal-mid p-2 rounded-xl
                       hover:border-teal-light hover:bg-teal-light aria-expanded:border-teal-light aria-expanded:bg-teal-light
                        transition-colors group"
            aria-label="Abrir filtros de busca"
            aria-expanded={isFilterModalOpen}
          >
            {hasAnyFilter ? (
              <FilterSparkIcon className="text-paper transition-colors"/>
            ) : (
              <FilterIcon className="text-paper transition-colors"/>
            )}
          </button>
        </div>
      </AppHeader>
      <main className="main-app">
        {/* Modal Card Event */}
        <ModalWrapper
          isOpen={isCardModalOpen}
          onClose={handleModalEventClose}
        >
          {(selectedEventId && selectedEventData) ? (
            <SelectedEventDetails
              event={selectedEventData}
              search={searchQuery}
            />
          ) : (
            <SelectedEventDetailsSkeleton />
          ) }
        </ModalWrapper>

        {/* Modal Filter */}
        <ModalWrapper
          isOpen={isFilterModalOpen}
          onClose={handleModalFilterClose}
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
                onClick={handleApplyFilter}
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

        {isLoading ? <p>Carregando eventos...</p> : data!.length > 0 ? (
          <>
            <section className="m-auto mt-10 flex flex-col items-center gap-8">
              {data?.map((event) => (
                <EventCard key={event.id} event={event} selectEvent={handleEventCardClick}/>
              ))}
            </section>
          </>
        ) : (
          <p className="text-center font-medium p-4">Nenhum evento encontrado com essa busca.</p>
        )}
      </main>
    </>
  )
}