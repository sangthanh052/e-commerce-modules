/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout/MainLayout'
import NotFound from './pages/NotFound'

const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

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
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '',
          element: <RejectedRoute />,
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
        },
        {
          path: '',
          element: <ProtectedRoute />,
          children: [
            {
              path: path.cart,
              element: (
                <Suspense>
                  <Cart />
                </Suspense>
              )
            }
          ]
        },
      ]
    },
     {
          path: '*',
          element: <NotFound />
        }
  ])
  return routeElements
}
