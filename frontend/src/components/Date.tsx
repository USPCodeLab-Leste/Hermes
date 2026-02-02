import { useMemo } from 'react';

export function Date({ dateString }: { dateString: string }) {
  const dateSplit = useMemo(() => dateString.split('/'), [dateString])
  const formatedDate = useMemo(() => dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0], [dateSplit])
  const date = useMemo(() => new globalThis.Date(formatedDate), [formatedDate])

  return (
    <time dateTime={formatedDate} className="text-sm text-ink/75 dark:text-paper/75">
      {date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </time>
  )
}