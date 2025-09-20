import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout/MainLayout'

const Register = lazy(() => import('./pages/Register'))

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: path.register,
      element: (
        <MainLayout>
          <Suspense>
            <Register />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}
