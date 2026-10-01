import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });

  // Clear the httpOnly admin-session cookie server-side
  response.cookies.set({
    name: 'admin-session',
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0, // Immediately expire
  });

  return response;
}
