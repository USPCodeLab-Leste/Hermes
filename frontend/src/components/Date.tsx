import { useMemo } from 'react';

export function DateWrapper({start, end, textClass }: {start: string; end: string; textClass?: string}) {
  return (
    <div className="flex flex-row gap-1.25">
      <Date dateString={start} textClass={textClass} />
      {start !== end && (
        <>
          <span className={`text-sm ${textClass}`}>até</span>
          <Date dateString={end} textClass={textClass} />
        </>
      )}
    </div>
  )
}

export function Date({ dateString, textClass }: { dateString: string; textClass?: string }) {
  const dateSplit = useMemo(() => dateString.split('/'), [dateString])
  const formatedDate = useMemo(() => dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0], [dateSplit])
  const date = useMemo(() => new globalThis.Date(formatedDate), [formatedDate])

  return (
    <time dateTime={formatedDate} className={`text-sm ${textClass}`}>
      {date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })}
    </time>
  )
}