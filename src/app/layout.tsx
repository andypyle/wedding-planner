import { AppLayout } from '@/components/layouts/AppLayout'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto',
})

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
      <body className={noto.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
