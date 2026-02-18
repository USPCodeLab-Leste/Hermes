import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export function useSharedSearch(param = "q") {
  const [params, setParams] = useSearchParams()

  const value = params.get(param) ?? ""

  const setValue = useCallback((newValue: string) => {
    setParams(prev => {
      if (newValue) {
        prev.set(param, newValue)
      } else {
        prev.delete(param)
      }
      return prev
    }, { replace: true })
  }, [setParams])

  return [value, setValue] as const
}