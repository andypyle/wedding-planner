import Navigation from '@/components/Navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wedding Planner',
  description: 'Plan your perfect wedding day',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body
        className={`${dmSans.className} text-gray-900 bg-earth-50 min-h-screen`}>
        <Navigation user={data.user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
