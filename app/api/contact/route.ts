import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { validateCSRFToken } from '@/lib/csrf';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  businessType: z.string().min(1, 'Please select a business type').max(50),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^[0-9+\-\s()]{10,}$/.test(val),
      'Please enter a valid phone number'
    ),
  service: z.string().min(1, 'Please select a service').max(100),
  budget: z.string().min(1, 'Please select or enter a budget').max(50),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
  csrfToken: z.string().min(1, 'CSRF token is missing'),
});

/**
 * Get n8n webhook URL from environment variables
 * Fails if not configured
 */
function getN8nWebhookUrl(): string {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      'N8N_WEBHOOK_URL is not configured. Add it to your environment variables.'
    );
  }

  // Validate URL format
  try {
    new URL(webhookUrl);
  } catch {
    throw new Error('N8N_WEBHOOK_URL is not a valid URL');
  }

  return webhookUrl;
}

/**
 * Get CSRF token from cookie
 */
function getStoredCSRFToken(request: NextRequest): string | null {
  return request.cookies.get('csrf-token')?.value || null;
}

export async function POST(request: NextRequest) {
  try {
    // ────────────────────────────────────────────────────────
    // 1. Rate Limiting
    // ────────────────────────────────────────────────────────
    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimitResult = rateLimit(
      `contact:${clientIp}`,
      5, // 5 requests
      60000 // per minute
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
          },
        }
      );
    }

    // ────────────────────────────────────────────────────────
    // 2. CSRF Token Validation
    // ────────────────────────────────────────────────────────
    const storedCSRFToken = getStoredCSRFToken(request);
    const body = await request.json();

    if (!storedCSRFToken) {
      return NextResponse.json(
        { success: false, message: 'Security validation failed. Please refresh and try again.' },
        { status: 403 }
      );
    }

    if (!validateCSRFToken(body.csrfToken, storedCSRFToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid security token. Please refresh and try again.' },
        { status: 403 }
      );
    }

    // ────────────────────────────────────────────────────────
    // 3. Input Validation with Zod
    // ────────────────────────────────────────────────────────
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid form input.';
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const formData = result.data;
    const submittedAt = new Date().toISOString();

    // ────────────────────────────────────────────────────────
    // 4. Save to Database
    // ────────────────────────────────────────────────────────
    let savedMessage: any;
    try {
      savedMessage = await db.saveMessage({
        name: formData.name,
        email: formData.email,
        business_type: formData.businessType,
        phone: formData.phone || null,
        service: formData.service,
        budget: formData.budget,
        message: formData.message,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save your inquiry. Please try again later.',
        },
        { status: 500 }
      );
    }

    // ────────────────────────────────────────────────────────
    // 5. Forward to n8n Webhook (non-blocking)
    // ────────────────────────────────────────────────────────
    let webhookSuccess = false;
    let n8nResponseDetails: {
      status: number | null;
      statusText: string;
      ok: boolean;
      responseTimeMs: number;
      timestamp: string;
      error?: string;
    } = {
      status: null,
      statusText: '',
      ok: false,
      responseTimeMs: 0,
      timestamp: new Date().toISOString(),
    };

    try {
      const webhookUrl = getN8nWebhookUrl();
      const startTime = Date.now();

      const webhookPayload = {
        id: savedMessage.id,
        name: formData.name,
        email: formData.email,
        businessType: formData.businessType,
        phone: formData.phone || '',
        service: formData.service,
        budget: formData.budget,
        message: formData.message,
        submittedAt,
        source: 'TERVOM Website Inquiry Form',
      };

      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TervomWebsite/1.0',
          // Add security headers
          'X-Webhook-Source': 'contact-form',
          'X-Submission-Time': submittedAt,
        },
        body: JSON.stringify(webhookPayload),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const latency = Date.now() - startTime;
      webhookSuccess = webhookRes.ok;

      let responseBody: any = null;
      const rawText = await webhookRes.text();
      try {
        responseBody = JSON.parse(rawText);
      } catch {
        responseBody = rawText;
      }

      n8nResponseDetails = {
        status: webhookRes.status,
        statusText: webhookRes.statusText,
        ok: webhookRes.ok,
        responseTimeMs: latency,
        timestamp: new Date().toISOString(),
      };

      if (!webhookRes.ok) {
        console.warn(
          `n8n Webhook returned non-200 response (${webhookRes.status}):`,
          rawText
        );
      }
    } catch (webhookError: any) {
      console.error('Error dispatching to n8n Webhook:', webhookError);
      n8nResponseDetails = {
        status: 0,
        statusText: 'Network Error',
        ok: false,
        error: webhookError?.message || 'Failed to connect to n8n webhook',
        responseTimeMs: Date.now(),
        timestamp: new Date().toISOString(),
      };
      // Continue even if webhook fails - inquiry is still saved
    }

    // ────────────────────────────────────────────────────────
    // 6. Success Response
    // ────────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. We will contact you soon!',
        data: {
          id: savedMessage.id,
          email: formData.email,
        },
        webhookStatus: webhookSuccess ? 'sent' : 'failed_or_skipped',
        // Don't expose full webhook details to client
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact inquiry API error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again later.' },
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
