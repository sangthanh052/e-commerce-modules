import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()

  return (
    <>
      <>{routeElements}</>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
