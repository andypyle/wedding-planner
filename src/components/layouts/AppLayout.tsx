'use client'

import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/auth/callback']

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6 h-6 w-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    name: 'Timeline',
    href: '/timeline',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6 h-6 w-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    name: 'Guests',
    href: '/guests',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6 h-6 w-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
  {
    name: 'Vendors',
    href: '/vendors',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6 h-6 w-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
        />
      </svg>
    ),
  },
  {
    name: 'Checklist',
    href: '/checklist',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6 h-6 w-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // Handle root route
      if (pathname === '/') {
        if (user) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
        return
      }

      // Handle other routes
      if (!user && !publicRoutes.includes(pathname)) {
        router.push('/login')
      } else if (user && publicRoutes.includes(pathname)) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, router, pathname])

  // Show loading state only for protected routes
  if (loading && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // For public routes, render without the sidebar
  if (publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">{children}</main>
      </div>
    )
  }

  // For protected routes, require authentication
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed inset-y-0 left-0 w-80 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* User Profile Section */}
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs tracking-tighter">
                {user.user_metadata?.partner1_name?.charAt(0) &&
                user.user_metadata?.partner2_name?.charAt(0)
                  ? `${user.user_metadata.partner1_name.charAt(
                      0
                    )} & ${user.user_metadata.partner2_name.charAt(0)}`
                  : user.user_metadata?.partner1_name?.charAt(0) ||
                    user.user_metadata?.partner2_name?.charAt(0) ||
                    'U'}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900">
                  {user.user_metadata?.partner1_name}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {user.user_metadata?.partner2_name}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t border-slate-200 p-4">
            <div className="space-y-1">
              <Link
                href="/profile"
                className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="pl-80">
        <main className="p-8">{children}</main>
      </motion.div>
    </div>
  )
}
