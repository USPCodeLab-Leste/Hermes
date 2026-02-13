import { useCallback } from "react"
import { toast } from "react-toastify"

// Types
import type { Event } from "../types/events"

// Components
import { Tags } from "./Events"
import { DateWrapper } from "./Date"
import { GenericButton } from "./GenericButton"

export function SelectedEventDetails({ event }: { event: Event | null }) {
  const handleShare = useCallback(async () => {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: `Confira o evento: ${event.title} em ${event.local}`,
      url: window.location.href, // TODO: Gerar URL específica do evento.
    };

    // Verifica se é um dispotivo touch
    const isTouchDevice = navigator.maxTouchPoints > 0;
    
    // Se estiver no celular usa o navigator.share, caso contrário copia o link para o clipboard
    if (navigator.share && isTouchDevice) {
      try {
        // Celular
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para Desktop: Copiar para o Clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link do evento copiado!");
      } catch {
        toast.error("Não foi possível copiar o link.");
      }
    }
  }, [event]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="aspect-5/3 w-auto bg-no-repeat bg-cover overflow-hidden bg-violet-dark rounded-xl -mx-6 -mt-12 mb-4"
        style={{ backgroundImage: `url('${event?.img_banner}')` }}
      />
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[30dvh]">
        <Tags tags={event?.tags ?? []} className="mb-2" />
        <h2 className="text-2xl font-bold -mb-1">{event?.title}</h2>
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-0 items-center mb-2">
          <span className="text-[18px] dark:text-paper/75 text-ink/75">{event?.local}</span>
          <span>-</span>
          <DateWrapper
            start={event?.data_inicio!}
            end={event?.data_fim!}
            textClass="dark:text-paper/75 text-ink/75"
          />
        </div>
        <p className="text-[16px] dark:text-paper/50 text-ink/50 text-justify hyphens-auto indent-2">
          {event?.body}
        </p>
      </div>
      <GenericButton onClick={handleShare}>
        <span className="text-paper">Compartilhar Evento</span>
      </GenericButton>
    </div>
  )
}