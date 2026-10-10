import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Session configuration
 */
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  console.warn(
    'WARNING: SESSION_SECRET is not configured or too short. Set a strong SESSION_SECRET in .env.local (min 32 chars)'
  );
}

interface SessionPayload {
  email: string;
  loginAt: string;
  expiresAt: number;
  nonce: string;
}

/**
 * Create a signed session token
 * Format: payload.signature
 */
export function createSessionToken(email: string): string {
  if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not configured');
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const nonce = crypto.randomBytes(16).toString('hex');

  const payload: SessionPayload = {
    email,
    loginAt: new Date().toISOString(),
    expiresAt,
    nonce,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr).toString('base64url');

  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('hex');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode session token
 * Returns null if invalid or expired
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!SESSION_SECRET) {
    console.error('SESSION_SECRET is not configured');
    return null;
  }

  try {
    const [payloadB64, signature] = token.split('.');

    if (!payloadB64 || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadB64)
      .digest('hex');

    // Use constant-time comparison
    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    // Decode payload
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr) as SessionPayload;

    // Check expiration
    if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Session token verification failed:', error);
    return null;
  }
}

/**
 * Set secure session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get session from cookie
 */
export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if session is valid
 */
export async function isValidSession(): Promise<boolean> {
  const session = await getSessionFromCookie();
  return session !== null;
}
