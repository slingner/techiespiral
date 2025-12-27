export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Get env vars
    const { LISTMONK_URL, LISTMONK_USER, LISTMONK_PASSWORD, LISTMONK_LIST_IDS } = process.env;

    if (!LISTMONK_URL || !LISTMONK_USER || !LISTMONK_PASSWORD) {
      throw new Error('Missing Listmonk configuration');
    }

    // Create subscriber in Listmonk
    const auth = Buffer.from(`${LISTMONK_USER}:${LISTMONK_PASSWORD}`).toString('base64');
    const listIds = LISTMONK_LIST_IDS.split(',').map(Number);

    const response = await fetch(`${LISTMONK_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name: name || email.split('@')[0],
        status: 'enabled',
        lists: listIds,
        preconfirm_subscriptions: true
      })
    });

    // Handle duplicate subscribers gracefully
    if (response.status === 409) {
      return res.status(200).json({ message: 'Already subscribed!' });
    }

    if (!response.ok) {
      throw new Error(`Listmonk API error: ${response.status}`);
    }

    return res.status(200).json({ message: 'Successfully subscribed!' });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
}
