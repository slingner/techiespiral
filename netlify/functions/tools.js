// netlify/functions/tools.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const response = await fetch(`${process.env.NOCODB_API_URL}/api/v1/db/data/noco/${process.env.NOCODB_PROJECT_ID}/Tools`, {
      headers: {
        'xc-token': process.env.NOCODB_API_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tools');
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch tools' })
    };
  }
};