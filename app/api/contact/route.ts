import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  businessType: z.string().min(1, 'Please select a business type'),
  phone: z.string().optional().nullable(),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().min(1, 'Please select or enter a budget'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

const DEFAULT_N8N_WEBHOOK = 'https://hemu123.app.n8n.cloud/webhook/tervom-inquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    // 1. Save message to database / storage
    const savedMessage = await db.saveMessage({
      name: formData.name,
      email: formData.email,
      business_type: formData.businessType,
      phone: formData.phone || null,
      service: formData.service,
      budget: formData.budget,
      message: formData.message,
    });

    // 2. Forward inquiry details to n8n Webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;
    
    let webhookSuccess = false;
    let n8nResponseDetails: {
      status: number | null;
      statusText: string;
      ok: boolean;
      webhookUrl: string;
      body: any;
      responseTimeMs: number;
      timestamp: string;
      error?: string;
    } = {
      status: null,
      statusText: '',
      ok: false,
      webhookUrl,
      body: null,
      responseTimeMs: 0,
      timestamp: new Date().toISOString(),
    };

    const startTime = Date.now();

    try {
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
        },
        body: JSON.stringify(webhookPayload),
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
        webhookUrl,
        body: responseBody,
        responseTimeMs: latency,
        timestamp: new Date().toISOString(),
      };

      if (!webhookRes.ok) {
        console.warn(`n8n Webhook returned non-200 response (${webhookRes.status}):`, rawText);
      }
    } catch (webhookError: any) {
      const latency = Date.now() - startTime;
      console.error('Error dispatching to n8n Webhook:', webhookError);
      n8nResponseDetails = {
        status: 0,
        statusText: 'Network Error',
        ok: false,
        webhookUrl,
        body: null,
        error: webhookError?.message || 'Failed to connect to n8n webhook URL',
        responseTimeMs: latency,
        timestamp: new Date().toISOString(),
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been submitted and dispatched to n8n workflow!',
        data: savedMessage,
        webhookStatus: webhookSuccess ? 'sent' : 'failed_or_skipped',
        n8nResponse: n8nResponseDetails,
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

