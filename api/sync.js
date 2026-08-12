// Vercel Serverless API for Zero-CORS Cross-Device Sync

let globalMemoryCache = null;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      items: globalMemoryCache || [],
      lastUpdated: new Date().toISOString()
    });
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body && Array.isArray(body.items)) {
        globalMemoryCache = body.items;
      }
      return res.status(200).json({ 
        success: true, 
        count: globalMemoryCache ? globalMemoryCache.length : 0 
      });
    } catch (err) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
