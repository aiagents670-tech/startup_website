import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Service role key — NEVER expose to client. Only use in server components / API routes.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!serviceRoleKey) {
  console.warn(
    '[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY is not set. Admin mutations will fail.'
  );
}

// Server-only admin client — bypasses RLS for admin operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
