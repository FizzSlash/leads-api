import { createClient } from '@supabase/supabase-js';

// [CLIENT_NAME] Supabase Configuration
const supabase = createClient(
  'https://[CLIENT_PROJECT_URL].supabase.co',
  '[CLIENT_ANON_KEY]'
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('[TABLE_NAME]') // Usually 'lead_email_text' or 'leads'
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      client: '[CLIENT_SLUG]', // e.g., 'acme-corp'
      leads: data || [],
      count: data?.length || 0,
      lastUpdated: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('[CLIENT_NAME] API Error:', error);
    return res.status(500).json({ 
      client: '[CLIENT_SLUG]',
      error: 'Failed to fetch leads',
      message: error.message,
      status: 'error'
    });
  }
}

// INSTRUCTIONS FOR NEW CLIENT:
// 1. Copy this file to api/[client-name].js
// 2. Replace [CLIENT_PROJECT_URL] with their Supabase project URL
// 3. Replace [CLIENT_ANON_KEY] with their Supabase anon key  
// 4. Replace [TABLE_NAME] with their table name
// 5. Replace [CLIENT_SLUG] with URL-friendly name (e.g., 'acme-corp')
// 6. Replace [CLIENT_NAME] with their actual company name
// 7. Test at: yoursite.vercel.app/api/[client-name]
