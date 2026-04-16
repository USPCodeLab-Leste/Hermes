import { useCallback, useState } from "react"
import { toast } from "react-toastify"

// Hooks
import { useShare } from "../hooks/useShare"
import { useDeleteEvent } from "../hooks/events/useDeleteEvent"
import { useFollowTag } from "../hooks/tags/useFollowTag"
import { useAuth } from "../hooks/auth/useAuth"

// Types
import type { Event } from "../types/events"
import type { GenericTag } from "../types/tag"

// Components
import { FollowTags } from "./Events"
import { DateWrapper } from "./Date"
import { GenericButton } from "./GenericButton"
import { AdminEditDeleteButtons } from "./admin/AdminEditDeleteButtons"
import { ConfirmDeleteModal } from "./modals/ConfirmModal"
import { CreateEventModal } from "./modals/CreateEventModal"
import MarkdownRenderer from "./MarkdownRenderer"

// Icons

import CalendarIcon from "../assets/icons/calendar-plus.svg?react"

// Utils
import { createGoogleCalendarLink, downloadICS, formatIcs } from "../utils/dates"
import { isMobile } from "../utils/so"
import { ScrollingTitle } from "./ScrollingTittle"


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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followTag] = useFollowTag()
  const { mapTags } = useAuth();

  // Handlers
  const handleShare = useCallback(() => {
    if (!event) return;

    const urlObj = new URL(window.location.href);
    urlObj.searchParams.set("q", event.title);
    const url = urlObj.toString();

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

  const handleOpenEdit = useCallback(() => {
    setIsEditModalOpen(true);
  }, [])

  const handleFollowTag = useCallback((tag: GenericTag) => {
    const isFollowing = mapTags.has(tag.id);

    followTag({ tagId: tag.id, isFollowing });
  }, [followTag, mapTags])

  const handleAddToCalendar = useCallback(() => {
    if (!event) return

    let message = '';

    const calendarEvent = {
      title: event.title || "",
      description: event.body || "",
      location: event.local || "",
      start: new Date(event.data_inicio || ""),
      end: new Date(event.data_fim || ""),
    }

    if (isMobile()) {
      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView?.postMessage(
          JSON.stringify({ type: "download-ics", ics: formatIcs(calendarEvent) })
        );
        message = "Evento criado! Aguarde enquanto tentamos abrir seu aplicativo de calendário."
      } else {
        downloadICS(calendarEvent)
        message = "Evento criado! Abra o arquivo do evento baixado para adicionar ao seu calendário."
      }
      toast.success(message)
    } else {
      const url = createGoogleCalendarLink(calendarEvent)
      window.open(url, "_blank")
      toast.success("Evento aberto no Google Agenda. Confira e salve por lá.")
    }

  }, [event])

  return (
    <div className="flex flex-col gap-4">
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCreated={onDeleted}
        initialEvent={event}
      />

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
        className="aspect-video w-auto bg-no-repeat bg-cover bg-center overflow-hidden bg-violet-dark rounded-xl -mx-6 -mt-12 mb-4"
        style={{ backgroundImage: `url('${event?.img_banner}')` }}
      />
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[40dvh]">
        <FollowTags
          tags={event?.tags || []}
          className="mb-4"
          activeTags={mapTags}
          onClick={handleFollowTag}
        />
        <div className="flex flex-row justify-between items-center gap-4">
          {/* <h2 className="text-2xl font-bold -mb-1 truncate">{event?.title}</h2> */}
          <ScrollingTitle title={event?.title || ""} className="text-2xl font-bold -mb-1" />
          <button 
            className="cursor-pointer p-2 rounded-xl bg-teal-light shadow-md hover:bg-teal-light/90 transition-colors"
            onClick={handleAddToCalendar}
            aria-label={`Adicionar o evento "${event?.title}" ao calendário`}
          >
            <CalendarIcon className="size-5 text-paper" />
          </button>
        </div>
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-0 items-center mb-2">
          <span className="text-[18px] dark:text-paper/75 text-ink/75">{event?.local}</span>
          <span>-</span>
          <DateWrapper start={event?.data_inicio!} end={event?.data_fim!} textClass="dark:text-paper/75 text-ink/75"/>
        </div>
        {/* <p className="text-[16px] dark:text-paper/50 text-ink/50 text-justify hyphens-auto indent-2">{event?.body}</p> */}
        <MarkdownRenderer>{event?.body || ""}</MarkdownRenderer>
      </div>
      {isAdmin ? (
        <AdminEditDeleteButtons
          onEdit={handleOpenEdit}
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