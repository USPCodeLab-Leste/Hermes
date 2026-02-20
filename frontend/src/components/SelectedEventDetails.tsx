import { useCallback } from "react"

// Hooks
import { useShare } from "../hooks/useShare"

// Types
import type { Event } from "../types/events"

// Components
import { Tags } from "./Events"
import { DateWrapper } from "./Date"
import { GenericButton } from "./GenericButton"

interface SelectedEventDetailsProps {
  event: Event | null;
  search?: string;
}

export function SelectedEventDetails({ event, search }: SelectedEventDetailsProps) {
  const share = useShare();

  // Handlers
  const handleShare = useCallback(() => {
    if (!event) return;

    const url = window.location.href;
    share({ url, title: event.title, text: `Confira o evento ${event.title} no Hermes!` });
  }, [event, search, share]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="aspect-5/3 w-auto bg-no-repeat bg-cover overflow-hidden bg-violet-dark rounded-xl -mx-6 -mt-12 mb-4"
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
      <GenericButton
        onClick={handleShare}
      >
        <span className="text-paper">Compartilhar Evento</span>
      </GenericButton>
    </div>
  )
}