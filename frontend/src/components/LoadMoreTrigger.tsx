import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

export const LoadMoreTrigger = ({ onVisible, children }: { onVisible: () => void; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, {
    margin: '200px',
    once: false,
  })

  useEffect(() => {
    if (isInView) {
      onVisible()
    }
  }, [isInView, onVisible])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}