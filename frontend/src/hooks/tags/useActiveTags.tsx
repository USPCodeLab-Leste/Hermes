import { useEffect, useMemo, useState } from "react"
import { type ActiveTags } from "../../types/tag"

const getSavedActiveTags = (): ActiveTags => {
  const savedTags = localStorage.getItem("activeTags")
  if (savedTags) {
    return JSON.parse(savedTags) as ActiveTags
  }
  return {} as ActiveTags
}


export function useActiveTags() {
  const [activeTags, setActiveTags] = useState<ActiveTags>(getSavedActiveTags() as ActiveTags)

  const activeTagsValues = useMemo(() => Object.values(activeTags), [activeTags])
  const activeTagsNames = useMemo(() => activeTagsValues.map(tag => tag.name), [activeTagsValues])

  useEffect(() => {
    localStorage.setItem("activeTags", JSON.stringify(activeTags))
  }, [activeTags])

  return { activeTags, setActiveTags, activeTagsNames, activeTagsValues } as const
}