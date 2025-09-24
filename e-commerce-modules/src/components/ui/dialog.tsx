import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

interface PropsTypes {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}

export default function Dialog({ isOpen, setIsOpen, children }: PropsTypes) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, setIsOpen])

  return (
    <div>
      <AnimatePresence mode='wait'>
        {isOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className='flex flex-col items-center justify-center gap-5 overflow-auto rounded-xl bg-black/70 px-5 py-10 font-normal text-white'
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
