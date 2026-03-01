import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { GenericButton } from "../../components/GenericButton";
import { CreateTagModal } from "../../components/modals/CreateTagModal";
import { Tags } from "../../components/Events";

// Hooks
import { useEventTags } from "../../hooks/tags/useEventTags";
import { useInfoTags } from "../../hooks/tags/useInfoTags";

// Utils
import { groupByType } from "../../utils/tags";

// Icons
import ArrowIcon from "../../assets/icons/right-arrow.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";

export default function CreateTags() {
  const { data: eventTags, isLoading: isLoadingEvents } = useEventTags(true);
  const { data: infoTags, isLoading: isLoadingInfos } = useInfoTags(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const eventTagsByType = useMemo(() => groupByType(eventTags), [eventTags]);
  const infoTagsByType = useMemo(() => groupByType(infoTags), [infoTags]);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <>
      <CreateTagModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />

      <div className="w-full mt-6 p-4 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Gerenciar Tags</h1>
          <GenericButton onClick={handleOpenCreateModal} className="flex flex-row items-center gap-2 bg-teal-mid hover:bg-teal-light">
            <PlusIcon className="text-paper" />
            <span className="text-paper">Criar uma nova Tag</span>
          </GenericButton>
        </div>

        <TagsSection
          title="Tags de Eventos"
          isLoading={isLoadingEvents}
          hasAnyTags={!!eventTags && eventTags.length > 0}
          tagsByType={eventTagsByType}
          emptyMessage="Nenhuma tag de evento encontrada."
          keyPrefix="event"
        />

        <TagsSection
          title="Tags de Informações"
          isLoading={isLoadingInfos}
          hasAnyTags={!!infoTags && infoTags.length > 0}
          tagsByType={infoTagsByType}
          emptyMessage="Nenhuma tag de informação encontrada."
          keyPrefix="info"
        />
      </div>
    </>
  );
}

interface TagsSectionProps {
  title: string;
  isLoading: boolean;
  hasAnyTags: boolean;
  tagsByType: ReturnType<typeof groupByType>;
  emptyMessage: string;
  keyPrefix: string;
}

function TagsSection({
  title,
  isLoading,
  hasAnyTags,
  tagsByType,
  emptyMessage,
  keyPrefix,
}: TagsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <section className="flex flex-col">
      <button
        type="button"
        onClick={toggleOpen}
        className={`flex items-center justify-between gap-2 text-left p-4 border-2 cursor-pointer ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <ArrowIcon className={`size-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden p-4 border-2 border-t-0 rounded-b-2xl"
          >
            {isLoading ? (
              <p className="text-sm text-gray-500">Carregando {title.toLowerCase()}...</p>
            ) : !hasAnyTags ? (
              <p className="text-sm text-gray-500">{emptyMessage}</p>
            ) : (
              <div className="flex flex-col gap-3 mt-1">
                {Object.entries(tagsByType ?? {}).map(([type, tags]) => (
                  <div key={`${keyPrefix}-${type}`}>
                    <h3 className="font-medium capitalize mb-2 text-ink/80 dark:text-paper/80">{type}</h3>
                    <Tags tags={tags} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
