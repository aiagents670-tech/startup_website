// Create Admin User in Supabase
// Run with: node scripts/create-admin-user.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zvcibjktgehwipmohsmw.supabase.co';
// Using the publishable key from .env.local
const SUPABASE_KEY = 'sb_publishable_F7flULweZr8DZTi621miOg_V7KnFvjl';

const ADMIN_EMAIL    = 'hemanthofficial670@gmail.com';
const ADMIN_PASSWORD = 'HemanthRamHanuman2007';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
console.log(`${BOLD}  Creating Admin User${RESET}`);
console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

console.log(`  Email:    ${ADMIN_EMAIL}`);
console.log(`  Password: ${'*'.repeat(ADMIN_PASSWORD.length)}\n`);

// Try to sign up
const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
});

if (signUpError) {
  if (signUpError.message?.toLowerCase().includes('already registered') ||
      signUpError.message?.toLowerCase().includes('already exists') ||
      signUpError.code === 'user_already_exists') {
    console.log(`${CYAN}  ℹ  User already exists. Attempting to sign in to verify credentials...${RESET}`);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signInError) {
      console.log(`${RED}  ❌ Sign-in failed — ${signInError.message}${RESET}`);
      console.log(`\n  The user exists but the password may be different.`);
      console.log(`  Go to: https://supabase.com/dashboard/project/zvcibjktgehwipmohsmw/auth/users`);
      console.log(`  Find ${ADMIN_EMAIL} and reset the password manually.\n`);
    } else {
      console.log(`${GREEN}  ✅ Sign-in successful! Admin credentials are correct.${RESET}`);
      console.log(`\n  You can now login at: http://localhost:3000/admin/login`);
      console.log(`  Email:    ${ADMIN_EMAIL}`);
      console.log(`  Password: ${ADMIN_PASSWORD}\n`);
    }
  } else {
    console.log(`${RED}  ❌ Sign-up failed — ${signUpError.message}${RESET}`);
    console.log(`\n  Please create the user manually at:`);
    console.log(`  https://supabase.com/dashboard/project/zvcibjktgehwipmohsmw/auth/users\n`);
  }
} else {
  const user = signUpData?.user;
  if (user) {
    console.log(`${GREEN}  ✅ Admin user created successfully!${RESET}`);
    console.log(`  User ID: ${user.id}`);
    console.log(`  Email:   ${user.email}`);
    
    if (!user.email_confirmed_at) {
      console.log(`\n  ${CYAN}⚠  Email confirmation may be required.${RESET}`);
      console.log(`  → Go to Supabase Dashboard → Authentication → Users`);
      console.log(`  → Find ${ADMIN_EMAIL} and click "Confirm email" or disable email confirmation in settings.`);
    }

    console.log(`\n  You can now login at: http://localhost:3000/admin/login`);
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}\n`);
  } else {
    console.log(`${CYAN}  ℹ  Sign-up returned no user — email confirmation may be pending.${RESET}`);
    console.log(`  Check your email (${ADMIN_EMAIL}) for a confirmation link.`);
    console.log(`  Or disable email confirmation in Supabase Dashboard → Auth → Settings.\n`);
  }
}

console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
