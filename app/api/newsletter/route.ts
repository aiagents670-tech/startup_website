import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
});

function isTableMissingError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === 'PGRST205' ||
    err.code === '42P01' ||
    err.message?.includes('schema cache') ||
    err.message?.includes('does not exist') ||
    err.message?.includes('Could not find') ||
    false
  );
}

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

    // Check Supabase for existing subscription
    const { data: existing, error: selectError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', normalized)
      .maybeSingle();

    if (selectError) {
      if (isTableMissingError(selectError)) {
        // Table not created yet — still return success gracefully
        console.warn('⚠ newsletter_subscribers table not found. Run supabase_schema.sql.');
        return NextResponse.json(
          { success: true, message: 'Thank you for subscribing!' },
          { status: 200 }
        );
      }
      console.error('Supabase newsletter select error:', selectError.message);
      return NextResponse.json(
        { success: false, message: 'Could not process your request. Please try again later.' },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed.' },
        { status: 409 }
      );
    }

    // Insert into Supabase
    const { error: insertError } = await supabase.from('newsletter_subscribers').insert([
      {
        email: normalized,
        subscribed_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      if (isTableMissingError(insertError)) {
        console.warn('⚠ newsletter_subscribers table not found. Run supabase_schema.sql.');
        return NextResponse.json(
          { success: true, message: 'Thank you for subscribing!' },
          { status: 200 }
        );
      }
      console.error('Supabase newsletter insert error:', insertError.message, insertError.code);
      return NextResponse.json(
        { success: false, message: 'Could not save your subscription. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('✅ Newsletter subscriber saved:', normalized);
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
