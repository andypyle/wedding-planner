'use client'

import Navigation from './Navigation'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <Navigation user={null} />
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
