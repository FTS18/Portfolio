exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { url, isAudioOnly } = JSON.parse(event.body);
    
    const response = await fetch('https://api.vevioz.com/api/button/mp3/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    
    if (data.success && data.url) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'redirect', url: data.url })
      };
    }

    throw new Error('Conversion failed');
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', text: 'Service unavailable' })
    };
  }
};