import { useSearchParams } from "react-router-dom"

export function useSharedSearch(param = "q") {
  const [params, setParams] = useSearchParams()

  const value = params.get(param) ?? ""

  const setValue = (newValue: string) => {
    setParams(prev => {
      if (newValue) {
        prev.set(param, newValue)
      } else {
        prev.delete(param)
      }
      return prev
    }, { replace: true })
  }

  return [value, setValue] as const
}