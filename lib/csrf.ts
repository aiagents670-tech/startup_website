import crypto from 'crypto';

/**
 * Generate a CSRF token
 * Store this in a secure, HttpOnly cookie and include in form hidden field
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token
 * Compare token from request body/headers against token from secure cookie
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
}

/**
 * Extract CSRF token from request
 * Check both body (form) and headers (JSON)
 */
export function extractCSRFToken(request: Request): string | null {
  const contentType = request.headers.get('content-type');
  
  // For JSON requests, check X-CSRF-Token header
  if (contentType?.includes('application/json')) {
    return request.headers.get('x-csrf-token');
  }
  
  // For form data, would need to parse FormData
  // For now, recommend always using X-CSRF-Token header
  return null;
}
