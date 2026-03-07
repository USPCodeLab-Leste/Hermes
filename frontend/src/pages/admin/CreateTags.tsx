import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { CreateTagModal } from "../../components/modals/CreateTagModal";
import { ConfirmDeleteModal } from "../../components/modals/ConfirmModal";
import { DeleteTags } from "../../components/Events";

// Hooks
import { useEventTags } from "../../hooks/tags/useEventTags";
import { useInfoTags } from "../../hooks/tags/useInfoTags";
import { useDeleteTag } from "../../hooks/tags/useDeleteTag";

// Utils
import { groupByType } from "../../utils/tags";

// Icons
import ArrowIcon from "../../assets/icons/right-arrow.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";
import type { GenericTag } from "../../types/tag";

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
          <button className="bg-teal-mid rounded-full flex items-center justify-center p-3 hover:bg-teal-light cursor-pointer transition-colors" onClick={handleOpenCreateModal}>
            <PlusIcon className="text-paper"/>
          </button>
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
  const [deleteTag, isDeleting, deleteError] = useDeleteTag();
  const [tagToDelete, setTagToDelete] = useState<GenericTag | null>(null);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleClickTag = useCallback((tag: GenericTag) => {
    setTagToDelete(tag);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (isDeleting) return;

    setTagToDelete(null);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!tagToDelete) return;

    await deleteTag(tagToDelete.id);
    setTagToDelete(null);
  }, [deleteTag, tagToDelete]);

  const tagsCount = useMemo(() => Object.values(tagsByType ?? {}).flat().length, [tagsByType]);
  const entries = useMemo(() => Object.entries(tagsByType ?? {}), [tagsByType]);

  return (
    <section className="flex flex-col">
      <ConfirmDeleteModal
        isOpen={!!tagToDelete}
        title="Excluir tag"
        description={tagToDelete ? `Tem certeza que deseja excluir a tag "${tagToDelete.name}"? Essa ação não pode ser desfeita.` : undefined}
        isLoading={isDeleting}
        error={deleteError}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <button
        type="button"
        onClick={toggleOpen}
        className={`flex items-center justify-between gap-2 text-left p-4 border-2 cursor-pointer ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {hasAnyTags && (
            <div className="text-sm text-paper rounded-full bg-teal-mid flex items-center justify-center size-6">
              <span>{tagsCount}</span>
            </div>
          )}
        </div>
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
              <p className="text-sm text-paper/75">Carregando {title.toLowerCase()}...</p>
            ) : !hasAnyTags ? (
              <p className="text-sm text-paper/75">{emptyMessage}</p>
            ) : (
              <div className="flex flex-col gap-3 mt-1">
                {entries.map(([type, tags]) => (
                  <div key={`${keyPrefix}-${type}`}>
                    <h3 className="font-medium capitalize mb-2 text-ink/80 dark:text-paper/80">{type}</h3>
                    <DeleteTags tags={tags} onClick={handleClickTag} />
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
