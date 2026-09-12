import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOGIN_PATH = '/admin/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes (excluding /admin/login itself)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === LOGIN_PATH;

  if (!isAdminRoute || isLoginPage) {
    return NextResponse.next();
  }

  // Check auth session cookie
  const session = request.cookies.get('admin-session')?.value;

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
