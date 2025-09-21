import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout/MainLayout'

const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: path.home,
      element: <MainLayout />,
      children: [
        {
          path: path.register,
          element: (
            <Suspense>
              <Register />
            </Suspense>
          )
        },
        {
          path: path.login,
          element: (
            <Suspense>
              <Login />
            </Suspense>
          )
        }
      ]
    }
  ])
  return routeElements
}
