// Supabase Connection & Data Storage Test
// Run with: node scripts/test-supabase.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wzmhfjewixqunsauelpr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CnjF_Or-EFohRkFc1W4oKw_xqYyhEbg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

function pass(msg) { console.log(`${GREEN}  ✅ PASS${RESET} — ${msg}`); }
function fail(msg) { console.log(`${RED}  ❌ FAIL${RESET} — ${msg}`); }
function info(msg) { console.log(`${CYAN}  ℹ  ${RESET}${msg}`); }

console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
console.log(`${BOLD}  Supabase Integration Test${RESET}`);
console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

info(`URL:  ${SUPABASE_URL}`);
info(`Key:  ${SUPABASE_ANON_KEY.slice(0, 20)}...\n`);

// ── TEST 1: contact_submissions ─────────────────────────────────────────────
console.log(`${BOLD}[TEST 1] contact_submissions table${RESET}`);

const testContact = {
  name:          'Test User',
  email:         'test@techvision.io',
  business_type: 'Startup / Early Stage',
  phone:         '+91 99999 00000',
  service:       'Website Development',
  budget:        '₹10K',
  message:       'This is an automated test submission. Safe to delete.',
  created_at:    new Date().toISOString(),
};

const { data: insertedContact, error: contactErr } = await supabase
  .from('contact_submissions')
  .insert([testContact])
  .select()
  .single();

if (contactErr) {
  fail(`Insert failed — ${contactErr.message} (code: ${contactErr.code})`);

  if (contactErr.code === '42P01' || contactErr.message?.includes('does not exist')) {
    console.log(`\n  ${YELLOW}⚠  Table "contact_submissions" does not exist yet.`);
    console.log(`     → Go to Supabase Dashboard → SQL Editor and run supabase_schema.sql${RESET}\n`);
  } else if (contactErr.code === 'PGRST301' || contactErr.message?.includes('JWT')) {
    console.log(`\n  ${YELLOW}⚠  Auth error — check your SUPABASE_ANON_KEY is correct.${RESET}\n`);
  }
} else {
  pass(`Row inserted — id: ${insertedContact.id}`);
  info(`  name: ${insertedContact.name}`);
  info(`  email: ${insertedContact.email}`);
  info(`  service: ${insertedContact.service}`);
  info(`  created_at: ${insertedContact.created_at}`);

  // Read it back
  const { data: fetched, error: fetchErr } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', insertedContact.id)
    .single();

  if (fetchErr || !fetched) {
    fail(`Read-back failed — ${fetchErr?.message}`);
  } else {
    pass(`Read-back confirmed — row is in the database`);
  }

  // Clean up test row
  const { error: deleteErr } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', insertedContact.id);

  if (!deleteErr) {
    info(`  Test row cleaned up (deleted)`);
  }
}

// ── TEST 2: newsletter_subscribers ──────────────────────────────────────────
console.log(`\n${BOLD}[TEST 2] newsletter_subscribers table${RESET}`);

const testEmail = `test-${Date.now()}@techvision.io`;

const { data: insertedNews, error: newsErr } = await supabase
  .from('newsletter_subscribers')
  .insert([{ email: testEmail, subscribed_at: new Date().toISOString() }])
  .select()
  .single();

if (newsErr) {
  fail(`Insert failed — ${newsErr.message} (code: ${newsErr.code})`);

  if (newsErr.code === '42P01' || newsErr.message?.includes('does not exist')) {
    console.log(`\n  ${YELLOW}⚠  Table "newsletter_subscribers" does not exist yet.`);
    console.log(`     → Go to Supabase Dashboard → SQL Editor and run supabase_schema.sql${RESET}\n`);
  }
} else {
  pass(`Row inserted — id: ${insertedNews.id}`);
  info(`  email: ${insertedNews.email}`);
  info(`  subscribed_at: ${insertedNews.subscribed_at}`);

  // Test duplicate check
  const { error: dupErr } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email: testEmail }]);

  if (dupErr && (dupErr.code === '23505' || dupErr.message?.includes('duplicate'))) {
    pass(`Duplicate email correctly rejected (unique constraint works)`);
  } else if (dupErr) {
    fail(`Unexpected error on duplicate test — ${dupErr.message}`);
  } else {
    fail(`Duplicate email was NOT rejected — unique constraint may be missing`);
  }

  // Clean up
  const { error: deleteErr } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', insertedNews.id);

  if (!deleteErr) info(`  Test row cleaned up (deleted)`);
}

// ── SUMMARY ─────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
console.log(`${BOLD}  Done${RESET}`);
console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
