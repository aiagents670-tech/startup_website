// Confirm admin user email using service role key
// Run with: node scripts/confirm-admin-email.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zvcibjktgehwipmohsmw.supabase.co';
// Service role key needed to confirm email — get from Supabase Dashboard → Settings → API
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'your_service_role_key_here') {
  console.log('\n❌ SUPABASE_SERVICE_ROLE_KEY not set in .env.local');
  console.log('\nTo confirm your email without this script:');
  console.log('1. Go to: https://supabase.com/dashboard/project/zvcibjktgehwipmohsmw/auth/users');
  console.log('2. Find hemanthofficial670@gmail.com');
  console.log('3. Click the three-dot menu (⋮) → "Send confirmation email"');
  console.log('   OR go to Supabase Dashboard → Auth → Settings → disable "Enable email confirmations"\n');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const USER_ID = 'af74d0e9-ee97-4c42-9388-f5e4c9176344';

const { data, error } = await supabase.auth.admin.updateUser(USER_ID, {
  email_confirm: true,
});

if (error) {
  console.log(`\n❌ Failed to confirm email: ${error.message}\n`);
} else {
  console.log(`\n✅ Email confirmed for: ${data.user.email}`);
  console.log('   You can now login at: http://localhost:3000/admin/login\n');
}
