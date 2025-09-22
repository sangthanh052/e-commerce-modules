import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

import { AppContext } from './contexts/app.context'
import useRouteElements from './useRouteElements'
import { LocalStorageEventTarget } from './utils/auths'

function App() {
  const { reset } = useContext(AppContext)
  const routeElements = useRouteElements()

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLs', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLs', reset)
    }
  }, [reset])

  return (
    <>
      <ThemeProvider attribute={'class'} defaultTheme='light'>
        {routeElements}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </>
  )
}

export default App
