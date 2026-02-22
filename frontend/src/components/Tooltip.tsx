
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import InfoIcon from '../assets/icons/info.svg?react'

const tooltipRoot = document.getElementById('tooltip-root')

interface TooltipProps {
  content: string
}

export function Tooltip({ content }: TooltipProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDownCapture = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (!targetNode) {
        setIsOpen(false)
        return
      }

      const clickedButton = buttonRef.current?.contains(targetNode)
      const clickedTooltip = tooltipRef.current?.contains(targetNode)
      if (clickedButton || clickedTooltip) return

      setIsOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('pointerdown', onPointerDownCapture, { capture: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDownCapture, { capture: true } as AddEventListenerOptions)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={buttonRef}
        aria-label="Informação"
        type="button"
        className="flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <InfoIcon className='size-4 text-teal-light' />
      </button>

      <TooltipContent
        isOpen={isOpen}
        changeOpen={setIsOpen}
        buttonRef={buttonRef}
        tooltipRef={tooltipRef}
        content={content}
      />
    </>
  )
}

interface TooltipContentProps {
  isOpen?: boolean
  changeOpen: (open: boolean) => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
  tooltipRef: React.RefObject<HTMLDivElement | null>
  content: string
}

export function TooltipContent({ isOpen, buttonRef, tooltipRef, content, changeOpen }: TooltipContentProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect()

      setPosition({
        top: rect.top + window.scrollY - rect.height - 20,
        left: rect.left + rect.width + 2,
      })
    }
  }, [isOpen, buttonRef])

  if (!tooltipRoot) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 w-70 rounded-md bg-violet-dark px-3 py-2 text-sm text-white shadow-lg"
          style={{
            top: position.top,
            left: position.left,
          }}
          onMouseEnter={() => changeOpen(true)}
          onMouseLeave={() => changeOpen(false)}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>,
    tooltipRoot
  )
}