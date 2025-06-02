import { createClient } from '@supabase/supabase-js';

// Retention Harbor Supabase Configuration
const supabase = createClient(
  'https://xajedwcurzdgzrlnrcqi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhamVkd2N1cnpkZ3pybG5yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODYwMTgsImV4cCI6MjA2MjU2MjAxOH0.lXFmMWHLpwGVZo2VWbtmAZFaiPnLAm1sZkBXpik2mpY'
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
    // First try to get data without ordering to test basic access
    const { data, error } = await supabase
      .from('retention_harbor')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Sort in JavaScript if we got data
    const sortedData = data ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];

    return res.status(200).json({
      client: 'retention-harbor',
      leads: sortedData,
      count: sortedData.length,
      lastUpdated: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Retention Harbor API Error:', error);
    return res.status(500).json({ 
      client: 'retention-harbor',
      error: 'Failed to fetch leads',
      message: error.message,
      status: 'error'
    });
  }
}
