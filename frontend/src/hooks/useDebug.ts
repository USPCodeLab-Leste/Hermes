import { useRef } from "react"

type DebugSnapshot = Record<string, unknown>

export type UseDebugOptions = {
  enabled?: boolean
  logger?: (...args: any[]) => void
}

const defaultLogger = (...args: any[]) => {
  console.log(...args)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isEqual(a: unknown, b: unknown): boolean {
  // Mesmo valor ou mesma referência
  if (Object.is(a, b)) return true

  // Tipos diferentes → mudou
  if (typeof a !== typeof b) return false

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }

    return true
  }

  // Objetos
  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!(key in b)) return false
      if (!isEqual(a[key], b[key])) return false
    }

    return true
  }

  // Primitivos diferentes
  return false
}

export function useDebug<TSnapshot extends DebugSnapshot>(
  name: string,
  snapshot: TSnapshot,
  options: UseDebugOptions = {}
) {
  const enabled = options.enabled ?? import.meta.env.DEV
  const logger = options.logger ?? defaultLogger

  const renderCountRef = useRef(0)
  const prevRef = useRef<TSnapshot | null>(null)

  if (!enabled) return

  renderCountRef.current += 1

if (prevRef.current) {
  const changed = (Object.entries(snapshot) as Array<[keyof TSnapshot, unknown]>)
    .filter(([key, value]) => {
      const prevValue = prevRef.current?.[key]
      return !isEqual(prevValue, value)
    })
    .map(([key, value]) => [
      key,
      prevRef.current?.[key],
      value,
    ])

  if (changed.length > 0) {
    logger(`[${name}] render #${renderCountRef.current}`, {
      changed,
      snapshot,
    })
  } else {
    logger(`[${name}] render #${renderCountRef.current}`, {
      snapshot,
    })
  }
} else {
  logger(`[${name}] render #${renderCountRef.current}`, { snapshot })
}

  prevRef.current = snapshot
}
