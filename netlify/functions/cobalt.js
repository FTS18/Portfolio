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

    // Try direct stream extraction APIs
    const streamApis = [
      `https://api.streamtape.com/file/dlticket?file=${videoId}`,
      `https://api.cobalt.tools/api/json`,
      `https://api.alltubedownload.net/download?url=${encodeURIComponent(url)}`
    ];

    // Try Cobalt API first
    try {
      const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url,
          vQuality: quality,
          aFormat: format === 'mp3' ? 'mp3' : 'best',
          isAudioOnly: format === 'mp3'
        })
      });
      
      if (cobaltResponse.ok) {
        const data = await cobaltResponse.json();
        if (data.status === 'redirect' && data.url) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'redirect',
              url: data.url,
              quality: quality
            })
          };
        }
      }
    } catch (e) {}

    // Fallback to Y2Mate API
    try {
      const y2mateResponse = await fetch('https://www.y2mate.com/mates/analyzeV2/ajax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `url=${encodeURIComponent(url)}&q_auto=0&ajax=1`
      });
      
      const y2data = await y2mateResponse.json();
      if (y2data.status === 'ok' && y2data.links) {
        const formatKey = format === 'mp3' ? 'mp3' : 'mp4';
        const qualityLinks = y2data.links[formatKey];
        
        if (qualityLinks && Object.keys(qualityLinks).length > 0) {
          const bestQuality = Object.keys(qualityLinks)[0];
          const downloadKey = qualityLinks[bestQuality].k;
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: 'redirect',
              url: `https://www.y2mate.com/mates/convertV2/index?vid=${y2data.vid}&k=${downloadKey}`,
              quality: bestQuality
            })
          };
        }
      }
    } catch (e) {}

    // Last resort - return error instead of loader.to
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        status: 'error',
        text: 'All download services are currently unavailable. Please try again later.'
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