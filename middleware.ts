import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/auth';

const LOGIN_PATH = '/admin/login';
const PROTECTED_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const isLoginPage = pathname === LOGIN_PATH;

  // Allow login page and non-protected routes
  if (!isProtectedRoute || isLoginPage) {
    return NextResponse.next();
  }

  // For protected routes, validate session
  const sessionToken = request.cookies.get('admin-session')?.value;

  if (!sessionToken) {
    // No session token, redirect to login
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('next', pathname);
    loginUrl.searchParams.set('reason', 'session-expired');
    return NextResponse.redirect(loginUrl);
  }

  // Verify session token signature and expiration
  const session = verifySessionToken(sessionToken);

  if (!session) {
    // Invalid or expired token, redirect to login
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('next', pathname);
    loginUrl.searchParams.set('reason', 'invalid-session');

    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    response.cookies.delete('admin-session');
    return response;
  }

  // Session is valid, allow access
  // Optionally, create a response header with session info for logging
  const responseHeaders = new Headers();
  responseHeaders.set('x-admin-email', session.email);

  return NextResponse.next({
    request: {
      headers: responseHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
