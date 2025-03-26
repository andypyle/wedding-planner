import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired
  await supabase.auth.getSession()

  // Optional: Check auth status and redirect if necessary
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected paths that require authentication
  const authRequiredPaths = [
    '/vendors',
    '/guests',
    '/profile',
    '/timeline',
    '/checklist',
  ]

  // Public paths that don't require auth
  const isPublicPath = ['/login', '/signup', '/auth/callback'].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Check if path requires auth
  const isAuthRequired = authRequiredPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Redirect unauthenticated users to login
  if (isAuthRequired && !user && !isPublicPath) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|.*\\.(?:js|css)$).*)',
  ],
}
