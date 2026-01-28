import { useCallback, useMemo } from "react"
import type { Event } from "../types/events"
import type { Tag } from "../types/tag"
import { Tags } from "./Events"
import { Date } from "./Date"
import { GenericButton } from "./GenericButton"

export function SelectedEventDetails({ event }: { event: Event | null }) {
  // Handlers
  const handleShare = useCallback(() => {
    // TODO: implementar função para compartilhar com react-share
  }, []);

  // Memos
  const tags = useMemo(() => event?.tags.map(tag => ({name: tag})) as Partial<Tag>[], [event])

  return (
    <div className="flex flex-col gap-4">
      <div
        className="aspect-5/3 w-auto bg-no-repeat bg-cover overflow-hidden bg-violet-dark rounded-xl -mx-6 -mt-12 mb-4"
        style={{ backgroundImage: `url('${event?.banner}')` }}
      />
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[30dvh]">
        <Tags tags={tags} className="mb-2" />
        <h2 className="text-2xl font-bold -mb-1">{event?.title}</h2>
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-0 items-center mb-2">
          <span className="text-[18px] dark:text-paper/75 text-ink/75">{event?.location}</span>
          <Date dateString={event?.date!} />
        </div>
        <p className="text-[16px] dark:text-paper/50 text-ink/50 text-justify hyphens-auto indent-2">{event?.description}</p>
      </div>
      <GenericButton
        onClick={() => handleShare}
      >
        <span className="text-paper">Compartilhar Evento</span>
      </GenericButton>
    </div>
  )
}