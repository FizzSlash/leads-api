import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xajedwcurzdgzrlnrcqi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhamVkd2N1cnpkZ3pybG5yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODYwMTgsImV4cCI6MjA2MjU2MjAxOH0.lXFmMWHLpwGVZo2VWbtmAZFaiPnLAm1sZkBXpik2mpY'
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('lead_email_text')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      leads: data || [],
      count: data?.length || 0,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch leads',
      message: error.message 
    });
  }
}
