import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Middleware to check authentication status
export function middleware(request: NextRequest) {
  const session = getSession();
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  
  // If user is not logged in and trying to access a protected route
  if (!session && !isAuthPage && !request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is logged in and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Add paths that should be checked by the middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
