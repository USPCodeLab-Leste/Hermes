import { useCallback, useState } from "react"

// Hooks
import { useShare } from "../hooks/useShare"

// Types
import type { Event } from "../types/events"

// Components
import { Tags } from "./Events"
import { DateWrapper } from "./Date"
import { GenericButton } from "./GenericButton"
import { AdminEditDeleteButtons } from "./admin/AdminEditDeleteButtons"
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal"

import { useDeleteEvent } from "../hooks/events/useDeleteEvent"

interface SelectedEventDetailsProps {
  event: Event | null;
  search?: string;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

export function SelectedEventDetails({ event, search, isAdmin = false, onDeleted }: SelectedEventDetailsProps) {
  const share = useShare();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [del, isDeleteLoading, errorDelete] = useDeleteEvent();

  // Handlers
  const handleShare = useCallback(() => {
    if (!event) return;

    const url = window.location.href;
    share({ url, title: event.title, text: `Confira o evento ${event.title} no Hermes!` });
  }, [event, search, share]);

  const handleOpenConfirmDelete = useCallback(() => {
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleCloseConfirmDelete = useCallback(() => {
    if (isDeleteLoading) return;
    setIsConfirmDeleteOpen(false);
  }, [isDeleteLoading]);

  const handleConfirmDelete = useCallback(async () => {
    if (!event) return;

    try {
      await del(event.id);
      setIsConfirmDeleteOpen(false);
      onDeleted?.();
    } catch {
      // erro é exposto via errorDelete
    }
  }, [del, event, onDeleted]);

  return (
    <div className="flex flex-col gap-4">
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onCancel={handleCloseConfirmDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleteLoading}
        error={errorDelete}
        title="Excluir evento"
        description={
          event
            ? `Tem certeza que deseja excluir o evento "${event.title}"? Essa ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir? Essa ação não pode ser desfeita."
        }
      />

      <div
        className="aspect-video w-auto bg-no-repeat bg-cover overflow-hidden bg-violet-dark rounded-xl -mx-6 -mt-12 mb-4"
        style={{ backgroundImage: `url('${event?.img_banner}')` }}
      />
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[40dvh]">
        <Tags tags={event?.tags ?? []} className="mb-2" />
        <h2 className="text-2xl font-bold -mb-1">{event?.title}</h2>
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-0 items-center mb-2">
          <span className="text-[18px] dark:text-paper/75 text-ink/75">{event?.local}</span>
          <span>-</span>
          <DateWrapper start={event?.data_inicio!} end={event?.data_fim!} textClass="dark:text-paper/75 text-ink/75"/>
        </div>
        <p className="text-[16px] dark:text-paper/50 text-ink/50 text-justify hyphens-auto indent-2">{event?.body}</p>
      </div>
      {isAdmin ? (
        <AdminEditDeleteButtons
          onEdit={() => {}}
          onDelete={handleOpenConfirmDelete}
        />
      ) : (
        <GenericButton onClick={handleShare}>
          <span className="text-paper">Compartilhar Evento</span>
        </GenericButton>
      )}
    </div>
  )
}