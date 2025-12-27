const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

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
    const { url, quality = '720', format = 'mp4' } = JSON.parse(event.body);
    
    // Use yt-dlp via subprocess
    const cmd = `yt-dlp --get-url --format "best[height<=${quality}]" "${url}"`;
    const { stdout } = await exec(cmd, { timeout: 30000 });
    
    const downloadUrl = stdout.trim();
    
    if (downloadUrl && downloadUrl.startsWith('http')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'redirect',
          url: downloadUrl,
          quality: quality
        })
      };
    }
    
    throw new Error('No download URL found');
    
  } catch (error) {
    // Fallback to RapidAPI
    try {
      const { url } = JSON.parse(event.body);
      const response = await fetch('https://youtube-mp36.p.rapidapi.com/dl', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo-key',
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        },
        params: { id: url }
      });
      
      const data = await response.json();
      
      if (data.link) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: 'redirect', url: data.link })
        };
      }
    } catch (e) {}
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', text: 'Service unavailable' })
    };
  }
};