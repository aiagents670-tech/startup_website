import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'hemanthchowdary670@gmail.com').trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'hemanth';

    const providedEmail = (email || '').trim().toLowerCase();
    const providedPassword = password || '';

    // Secure server-side credential verification
    if (providedEmail !== expectedEmail || providedPassword !== expectedPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    const maxAge = rememberMe ? 2592000 : 86400; // 30 days or 1 day
    const response = NextResponse.json({
      success: true,
      message: 'Login successful. Redirecting to admin dashboard...',
    });

    // Set secure admin-session cookie
    response.cookies.set({
      name: 'admin-session',
      value: 'true',
      path: '/',
      httpOnly: true, // Prevent JS access — protects against XSS
      sameSite: 'lax',
      maxAge,
    });

    return response;
  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
