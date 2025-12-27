const ytdl = require('@distube/ytdl-core');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
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

    if (!url || !ytdl.validateURL(url)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          status: 'error',
          text: 'Invalid YouTube URL' 
        })
      };
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    // Get formats
    const formats = ytdl.filterFormats(info.formats, isAudioOnly ? 'audioonly' : 'videoandaudio');
    
    if (formats.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          status: 'error',
          text: 'No suitable format found' 
        })
      };
    }

    // Select best quality format
    const format = formats.reduce((best, current) => {
      if (isAudioOnly) {
        return (current.audioBitrate || 0) > (best.audioBitrate || 0) ? current : best;
      } else {
        return (current.height || 0) > (best.height || 0) ? current : best;
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'redirect',
        url: format.url,
        filename: `${title.replace(/[^\w\s]/gi, '')}.${isAudioOnly ? 'mp3' : 'mp4'}`
      })
    };

  } catch (error) {
    console.error('YouTube download error:', error);
    
    let errorMessage = 'Failed to process video';
    if (error.message.includes('Video unavailable')) {
      errorMessage = 'Video is unavailable or private';
    } else if (error.message.includes('age-restricted')) {
      errorMessage = 'Age-restricted content not supported';
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: 'error',
        text: errorMessage
      })
    };
  }
};