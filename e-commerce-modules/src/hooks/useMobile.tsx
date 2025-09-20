import { useEffect, useState } from 'react'

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const breakpoint = 768

    const handleResize = () => {
      const newValue = window.innerWidth < breakpoint
      setIsMobile(newValue)
    }

    handleResize() // gọi lần đầu
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}
