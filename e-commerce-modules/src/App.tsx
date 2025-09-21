import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()

  return (
    <>
      <ThemeProvider attribute={'class'} defaultTheme='dark'>
        {routeElements}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
