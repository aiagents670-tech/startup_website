import { createClient } from '@supabase/supabase-js';

/**
 * Validate required environment variables for Supabase
 * Throws error if missing to catch issues early
 */
function validateSupabaseConfig(): { url: string; key: string } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    const error = new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not configured. Add it to .env.local or your deployment environment.'
    );
    console.error(error);
    // In development, we might want to warn and continue with fallback
    // In production, this should fail
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return { url: '', key: '' };
  }

  if (!supabaseKey) {
    const error = new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured. Add it to .env.local or your deployment environment.'
    );
    console.error(error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return { url: supabaseUrl, key: '' };
  }

  return { url: supabaseUrl, key: supabaseKey };
}

let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create Supabase client
 * Uses lazy initialization to catch config errors early
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, key } = validateSupabaseConfig();
  
  if (!url || !key) {
    console.warn(
      'Supabase is not fully configured. Local storage will be used as fallback.'
    );
    // Return a null-safe proxy or throw error depending on your strategy
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
}

/**
 * Export for backwards compatibility
 * New code should use getSupabaseClient()
 */
export const supabase = getSupabaseClient();
