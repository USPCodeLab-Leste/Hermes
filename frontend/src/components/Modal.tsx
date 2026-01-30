import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { FocusTrap } from 'focus-trap-react'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function Modal({ children, onClose, ref }: ModalProps) {
  return (
    <motion.div
      className="modal-open overlay fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      ref={ref}
    >
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          clickOutsideDeactivates: true,
          initialFocus: false,
        }}
      >
        <motion.div
          className='modal-card'
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          role="dialog"
          aria-modal="true"
        >
          <button 
            onClick={onClose}
            role="button"
            aria-label="Close modal"
            className='cursor-pointer mb-4'
          >
            Close
          </button>
          {children}
        </motion.div>
      </FocusTrap>
    </motion.div>
  )
}

export function ModalWrapper({ isOpen, onClose, children }: ModalProps) {
  const modalRoot = document.getElementById('modal-root')
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