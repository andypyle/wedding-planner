'use client'

import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/auth/callback']

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Guests', href: '/guests' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Checklist', href: '/checklist' },
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

  // Show loading state
  if (loading) {
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
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* User Profile Section */}
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {user.user_metadata?.partner1_name} &{' '}
                  {user.user_metadata?.partner2_name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
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
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
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
        className="pl-64">
        <main className="p-8">{children}</main>
      </motion.div>
    </div>
  )
}
