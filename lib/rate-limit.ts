import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar persistent store
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;

  if (!store[key]) {
    store[key] = { count: 0, resetTime: now + windowMs };
  }

  const entry = store[key];

  // Clean up old entries (older than 2 windows)
  Object.keys(store).forEach((k) => {
    if (store[k].resetTime < now) {
      delete store[k];
    }
  });

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  return {
    success: true,
    remaining: limit - entry.count,
  };
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    identifier?: (req: NextRequest) => string;
    limit?: number;
    windowMs?: number;
  } = {}
): Promise<NextResponse> {
  const {
    identifier = (req) => req.headers.get('x-forwarded-for') || 'anonymous',
    limit = 10,
    windowMs = 60000,
  } = options;

  const id = identifier(request);
  const result = rateLimit(id, limit, windowMs);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(
            Math.ceil(Date.now() / 1000) + (result.retryAfter || 60)
          ),
        },
      }
    );
  }

  const response = await handler(request);
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set(
    'X-RateLimit-Reset',
    String(Math.ceil((Date.now() + windowMs) / 1000))
  );

  return response;
}
