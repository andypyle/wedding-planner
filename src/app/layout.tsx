import { AppLayout } from '@/components/layouts/AppLayout'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wedding Planner',
  description: 'Plan your perfect wedding',
}

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/auth/callback']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
