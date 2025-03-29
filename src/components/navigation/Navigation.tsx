'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Outfit } from 'next/font/google'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavigationItem {
  name: string
  href: string
}

interface NavigationProps {
  user: User | null
}

const outfit = Outfit({
  weight: '800',
  subsets: ['latin'],
})

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Guests', href: '/guests' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Checklist', href: '/checklist' },
]

export default function Navigation({ user }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex flex-1">
            <div className="flex-shrink-0 flex items-center flex-1">
              <Link
                href="/"
                className={`${outfit.className} text-4xl font-extrabold text-slate-800`}>
                Wedding Planner
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user &&
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-slate-600 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}>
                    {item.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Right side menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    id="user-menu-button"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                </div>

                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}>
                    <span className="block px-4 py-2 text-xs text-slate-500">
                      {user.email}
                    </span>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => setIsProfileMenuOpen(false)}>
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => setIsProfileMenuOpen(false)}>
                      Settings
                    </Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleSignOut()
                      }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 px-3 py-2">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 px-3 py-2 rounded-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {user &&
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-slate-50 border-slate-600 text-slate-900'
                      : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  )
}
