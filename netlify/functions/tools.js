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
    const allTools = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${process.env.NOCODB_API_URL}/api/v1/db/data/noco/${process.env.NOCODB_PROJECT_ID}/Tools?limit=100&offset=${(page-1)*100}`, {
        headers: {
          'xc-token': process.env.NOCODB_API_TOKEN
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      allTools.push(...data.list);
      
      hasMore = data.pageInfo && !data.pageInfo.isLastPage;
      page++;
    }

    console.log(`Fetched ${allTools.length} tools total`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ list: allTools })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch tools', details: error.message })
    };
  }
};