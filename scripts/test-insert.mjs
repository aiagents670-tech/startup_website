import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wzmhfjewixqunsauelpr.supabase.co';
const supabaseKey = 'sb_publishable_CnjF_Or-EFohRkFc1W4oKw_xqYyhEbg';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n🔍 Testing contact_submissions insert...\n');

const { data, error } = await supabase.from('contact_submissions').insert([
  {
    name: 'Test User',
    email: 'test@example.com',
    business_type: 'Startup / Early Stage',
    phone: '+91 9999999999',
    service: 'Website Development',
    budget: '₹10K',
    message: 'This is a test message from the debug script.',
    created_at: new Date().toISOString(),
  },
]).select();

if (error) {
  console.log('❌ INSERT FAILED!');
  console.log('   Error Code    :', error.code);
  console.log('   Error Message :', error.message);
  console.log('   Error Details :', error.details);
  console.log('   Error Hint    :', error.hint);

  if (error.code === '42P01') {
    console.log('\n💡 FIX: Table "contact_submissions" does not exist.');
    console.log('   → Go to Supabase Dashboard → SQL Editor');
    console.log('   → Run the contents of supabase_schema.sql');
  } else if (error.code === '42501' || error.message?.includes('policy')) {
    console.log('\n💡 FIX: Row Level Security (RLS) is blocking the insert.');
    console.log('   → Go to Supabase Dashboard → Authentication → Policies');
    console.log('   → Add INSERT policy for anon role on contact_submissions');
  } else if (error.code === 'PGRST301') {
    console.log('\n💡 FIX: JWT / API Key issue. Check your ANON KEY.');
  }
} else {
  console.log('✅ INSERT SUCCESSFUL! Data stored in Supabase:');
  console.log(JSON.stringify(data, null, 2));
}
