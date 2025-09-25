import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout/MainLayout'

const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: path.home,
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
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
        },
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        }
      ]
    }
  ])
  return routeElements
}
