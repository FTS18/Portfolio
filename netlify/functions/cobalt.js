exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url, isAudioOnly } = JSON.parse(event.body);
    
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ status: 'error', text: 'URL required' })
      };
    }

    // Use multiple fallback APIs
    const apis = [
      'https://api.cobalt.tools/api/json',
      'https://co.wuk.sh/api/json',
      'https://api.cobalt.best/api/json'
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url,
            vQuality: '1080',
            aFormat: isAudioOnly ? 'mp3' : 'best',
            isAudioOnly: isAudioOnly
          })
        });

        if (response.ok) {
          const data = await response.json();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
          };
        }
      } catch (e) {
        continue;
      }
    }

    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ 
        status: 'error', 
        text: 'All download services unavailable' 
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: 'error', 
        text: 'Server error' 
      })
    };
  }
};