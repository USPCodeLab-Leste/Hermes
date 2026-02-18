import { useEffect, useMemo, useState } from "react"
import type { ActiveTags } from "../../types/tag"

const getSavedActiveTags = (): ActiveTags => {
  const savedTags = localStorage.getItem("activeTags")
  if (savedTags) {
    return JSON.parse(savedTags) as ActiveTags
  }
  return {} as ActiveTags
}

export function useActiveTags() {
  const [activeTags, setActiveTags] = useState<ActiveTags>(getSavedActiveTags() as ActiveTags)

  const tagsFlatten = useMemo(() => Object.values(activeTags).flat(), [activeTags])

  useEffect(() => {
    localStorage.setItem("activeTags", JSON.stringify(activeTags))
  }, [activeTags])

  return {activeTags, setActiveTags, tagsFlatten} as const
}