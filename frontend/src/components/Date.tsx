import { useMemo } from 'react';

export function DateWrapper({start, end, textClass }: {start: string; end: string; textClass?: string}) {
  const isSameDay = useMemo(() => {
    const startDate = parseToDate(start)
    const endDate = parseToDate(end)

    if (!startDate || !endDate) return start === end

    return (
      startDate.getUTCFullYear() === endDate.getUTCFullYear() &&
      startDate.getUTCMonth() === endDate.getUTCMonth() &&
      startDate.getUTCDate() === endDate.getUTCDate()
    )
  }, [end, start])

  return (
    <div className="flex flex-row gap-1.25">
      <DateContent dateString={start} textClass={textClass} />
      {!isSameDay && (
        <>
          <span className={`text-sm ${textClass}`}>até</span>
          <DateContent dateString={end} textClass={textClass} />
        </>
      )}
    </div>
  )
}

export function DateContent({ dateString, textClass }: { dateString: string; textClass?: string }) {
  const date = useMemo(() => parseToDate(dateString), [dateString])
  const dateTime = useMemo(() => normalizeToIsoDateTime(dateString), [dateString])

  if (!date) {
    return (
      <time dateTime={dateTime} className={`text-sm ${textClass}`}>
        --/--/--
      </time>
    )
  }

  return (
    <time dateTime={dateTime} className={`text-sm ${textClass}`}>
      {date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone: "UTC",
      })}
    </time>
  )
}

function parseToDate(dateString: string): Date | null {
  const date = new Date(dateString)
  return date
}

function normalizeToIsoDateTime(dateString: string): string {
  if (!dateString) return ''

  return new Date(dateString).toISOString()
}