import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabase = createMiddlewareClient({ req: request, res })
    
    // Refresh session se necessário (isso atualiza os cookies automaticamente)
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware auth error:', error)
    }

    // Protected routes
    const protectedPaths = ['/dashboard', '/chat', '/schedule', '/settings']
    const isProtectedRoute = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )

    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If accessing login with session, redirect to dashboard
    if (request.nextUrl.pathname === '/login' && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return res
  } catch (err) {
    console.error('Middleware error:', err)
    return res
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/schedule/:path*',
    '/settings/:path*',
    '/login',
  ],
}
