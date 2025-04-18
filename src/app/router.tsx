import { authService } from '@/api'
import Loader from '@/components/loader'
import { useAuth } from '@/hooks/use-auth'
import { Routes } from '@/utilities/routes'
import { useQuery } from '@tanstack/react-query'
import { FC, useMemo } from 'react'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import MaintenanceError from './pages/errors/maintenance-error'
import NotFoundError from './pages/errors/not-found-error'
import { tokenStore } from '@/store/token'

const Setup = () => {
  const { isLoggedIn } = useAuth()
  const routers = useMemo(
    () =>
      createBrowserRouter([
        // Auth routes
        {
          path: Routes.SIGN_IN,
          lazy: async () => ({
            Component: (await import('./pages/auth/sign-in')).default,
          }),
          loader: () => {
            if (isLoggedIn) {
              return redirect(Routes.DASHBOARD)
            } else {
              return null
            }
          },
        },
        {
          path: Routes.SIGN_UP,
          lazy: async () => ({
            Component: (await import('./pages/auth/sign-up')).default,
          }),
        },
        {
          path: Routes.FORGOT_PASSWORD,
          lazy: async () => ({
            Component: (await import('./pages/auth/forgot-password')).default,
          }),
        },
        {
          path: Routes.OTP,
          lazy: async () => ({
            Component: (await import('./pages/auth/otp')).default,
          }),
        },

        // Main routes
        {
          path: Routes.DASHBOARD,
          lazy: async () => {
            const AppShell = await import('@/components/app-shell')
            return { Component: AppShell.default }
          },
          loader: () => {
            if (!isLoggedIn) {
              return redirect(Routes.SIGN_IN)
            } else {
              return null
            }
          },
          errorElement: <GeneralError />,
          children: [
            {
              index: true,
              lazy: async () => ({
                Component: (await import('./pages/dashboard')).default,
              }),
            },
            {
              path: Routes.USERS,
              lazy: async () => ({
                Component: (await import('./pages/users')).default,
              }),
            },
            {
              path: Routes.TASKS,
              lazy: async () => ({
                Component: (await import('./pages/tasks')).default,
              }),
            },
            {
              path: Routes.PROFILE,
              lazy: async () => ({
                Component: (await import('./pages/profile')).default,
              }),
            },
            
          ],
        },

        // Error routes
        { path: Routes.ERROR.GENERAL, Component: GeneralError },
        { path: Routes.ERROR.NOT_FOUND, Component: NotFoundError },
        { path: Routes.ERROR.MAINTENANCE, Component: MaintenanceError },

        // Fallback 404 route
        { path: Routes.FALLBACK, Component: NotFoundError },
      ]),
    [isLoggedIn]
  )

  return <RouterProvider router={routers} />
}

const Router: FC = () => {
  const { login, logout, isLoggedIn, refreshToken } = useAuth()
  const { isLoading } = useQuery<Promise<boolean>>({
    queryKey: ['user', isLoggedIn],
    queryFn: async () => {
      if (isLoggedIn) {
        try {
          const {
            data: { access },
          } = await authService.getAccessToken(refreshToken)

          tokenStore.setAccessToken(access)
          const user = await authService.getUserInfo()
          login(user)
        } catch {
          logout()
          return true // handle this as true to load router even after refresh token give error
        }
      }
      return true
    },
  })
  if (isLoading) {
    return <Loader />
  }

  return <Setup />
}

export default Router
