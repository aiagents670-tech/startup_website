import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { validateCSRFToken } from '@/lib/csrf';

// Validation schema
const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.')
    .max(255),
  csrfToken: z.string().optional(),
});

/**
 * Get CSRF token from cookie
 */
function getStoredCSRFToken(request: NextRequest): string | null {
  return request.cookies.get('csrf-token')?.value || null;
}

export async function POST(request: NextRequest) {
  try {
    // ────────────────────────────────────────────────────────
    // 1. Rate Limiting (generous for newsletter signup)
    // ────────────────────────────────────────────────────────
    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimitResult = rateLimit(
      `newsletter:${clientIp}`,
      10, // 10 requests
      60000 // per minute
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many subscription attempts. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
          },
        }
      );
    }

    // ────────────────────────────────────────────────────────
    // 2. Parse and validate request body
    // ────────────────────────────────────────────────────────
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Please enter a valid email address.';
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { email, csrfToken } = result.data;
    const normalized = email.toLowerCase().trim();

    // ────────────────────────────────────────────────────────
    // 3. Optional CSRF Token Validation (for forms)
    // ────────────────────────────────────────────────────────
    // If CSRF token is provided, validate it
    if (csrfToken) {
      const storedCSRFToken = getStoredCSRFToken(request);

      if (!storedCSRFToken || !validateCSRFToken(csrfToken, storedCSRFToken)) {
        return NextResponse.json(
          { success: false, message: 'Security validation failed. Please refresh and try again.' },
          { status: 403 }
        );
      }
    }

    // ────────────────────────────────────────────────────────
    // 4. Add subscriber to database
    // ────────────────────────────────────────────────────────
    try {
      await db.addSubscriber(normalized);
    } catch (dbError) {
      console.error('Database error adding subscriber:', dbError);
      // Don't expose database errors to client
      return NextResponse.json(
        {
          success: false,
          message: 'An error occurred. Please try again later.',
        },
        { status: 500 }
      );
    }

    // ────────────────────────────────────────────────────────
    // 5. Success Response
    // ────────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Check your email for confirmation.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────────
// OPTIONS handler for CORS preflight
// ────────────────────────────────────────────────────────
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}
