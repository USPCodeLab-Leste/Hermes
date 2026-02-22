import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useDragControls } from 'framer-motion'
import { createPortal } from 'react-dom'
import { FocusTrap } from 'focus-trap-react'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function Modal({ children, onClose, ref }: ModalProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const [scope, animate] = useAnimate()
  const isDraggingRef = useRef(false)
  const dragControls = useDragControls()

  // Handlers
  const handleDrag = useCallback((_: any, info: any) => {
    if (info.offset.y < 0) return
    
    setDragOffset(info.offset.y)
  }, [])

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true
  }, [])

  const handleDragEnd = useCallback(() => {
    if (dragOffset > 150) {
      onClose()
    }
    
    isDraggingRef.current = false
    setDragOffset(0)
    animate(scope.current, { y: 0, opacity: 1 }, { type: 'spring', stiffness: 300, damping: 25 })
  }, [animate, dragOffset, onClose, scope])
  
  const handleClose = useCallback(() => {
    if (dragOffset > 0 || isDraggingRef.current) return

    isDraggingRef.current = false
    dragControls.stop()
    onClose()
  }, [dragOffset, onClose])
  
  return (
    <motion.div
      className="modal-open overlay min-h-dvh fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
      ref={ref}
    >
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          clickOutsideDeactivates: true,
          initialFocus: false,
          fallbackFocus: () => scope.current as HTMLElement,
        }}
      >
        <motion.div
          ref={scope}
          className='p-6 pt-2 bg-paper dark:bg-violet-mid rounded-t-2xl md:rounded-2xl modal-card absolute 
                     md:relative bottom-0 w-full md:w-9/10 md:max-w-120 origin-bottom md:origin-center max-h-[95dvh] overflow-auto shadow-lg shadow-black/30'
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 - Math.abs(dragOffset) / 1000 }}
          exit={{ scale: 0.8, opacity: 0 }}
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className='cursor-grab block py-4 px-12 m-auto touch-none active:cursor-grabbing select-none sticky z-12 top-0'
            onPointerDown={(e) => dragControls.start(e)}
            onClick={handleClose}
            aria-label="Fechar modal"
          >
            <div className='h-1.5 w-15 bg-violet-light dark:bg-paper shadow-md shadow-black/30 rounded-full m-auto' aria-hidden="true"/>
          </button>
          {children}
        </motion.div>
      </FocusTrap>
    </motion.div>
  )
}

const modalRoot = document.getElementById('modal-root')

export function ModalWrapper({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  if (!modalRoot) return null

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Modal onClose={onClose} ref={modalRef}>
          {children}
        </Modal>
      )}
    </AnimatePresence>,
    modalRoot
  )
}