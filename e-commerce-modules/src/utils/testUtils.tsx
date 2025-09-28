import App from '@/App'
import { AppProvider, getInitialAppContext } from '@/contexts/app.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor, type waitForOptions } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

export const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })

export const logScreenImmediate = (body: HTMLElement = document.body.parentElement as HTMLElement) => {
  screen.debug(body, 99999999)
}

export const logScreenAfter = async (body: HTMLElement = document.body, options?: waitForOptions) => {
  const { timeout = 1000 } = options || {}
  await waitFor(
    () => {
      screen.debug(body, 99999999)
    },
    { timeout }
  )
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    }
  })

  const Provider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Provider
}

const Provider = createWrapper()

export const renderWithRouter = ({ route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  const defaultValueAppContext = getInitialAppContext()

  return {
    user: userEvent.setup(),
    ...render(
      <Provider>
        <AppProvider defaultValue={defaultValueAppContext}>
          <App />
        </AppProvider>
      </Provider>,
      { wrapper: BrowserRouter }
    )
  }
}
