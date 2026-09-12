import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Please enter a valid email address.';
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const normalized = email.toLowerCase().trim();

    await db.addSubscriber(normalized);

    return NextResponse.json(
      { success: true, message: 'Thank you for subscribing!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription API error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
