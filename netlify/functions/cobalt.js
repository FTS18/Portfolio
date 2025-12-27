exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { url, quality = '720', format = 'mp4' } = event.httpMethod === 'POST' 
      ? JSON.parse(event.body) 
      : event.queryStringParameters;
    
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    
    if (!videoId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ status: 'error', text: 'Invalid YouTube URL' })
      };
    }

    // Use multiple APIs as fallback
    const apis = [
      `https://api.savetubeapp.com/v1/download?url=${encodeURIComponent(url)}`,
      `https://api.y2mate.com/v1/analyze?url=${encodeURIComponent(url)}`,
      `https://api.loader.to/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}`
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.url || data.download_url || data.link) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'redirect',
              url: data.url || data.download_url || data.link,
              quality: quality
            })
          };
        }
      } catch (e) {
        continue;
      }
    }

    // Final fallback - direct YouTube stream
    const streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'redirect',
        url: `https://loader.to/api/button/?f=${format}&k=${videoId}`,
        quality: quality
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', text: 'Service unavailable' })
    };
  }
};