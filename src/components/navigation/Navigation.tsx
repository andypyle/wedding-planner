'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationProps } from './types'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Guests', href: '/guests' },
  { name: 'Checklist', href: '/checklist' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Settings', href: '/settings' },
]

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}>
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-slate-600 bg-opacity-75"
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-xl font-semibold text-slate-900">
              Wedding Planner
            </span>
            <button
              type="button"
              className="rounded-md p-2 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              onClick={onClose}>
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={onClose}>
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-slate-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-semibold text-slate-900">
                Wedding Planner
              </span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}>
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
