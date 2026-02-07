import ytdl from '@distube/ytdl-core';
import { checkRateLimit } from './utils/rateLimit.js';

export const handler = async function (event, context) {
    // Rate limiting
    const clientIP = event.headers['x-forwarded-for'] ||
        event.headers['client-ip'] ||
        'unknown';

    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
        return {
            statusCode: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': rateCheck.retryAfter.toString()
            },
            body: JSON.stringify({
                error: 'Too many requests',
                retryAfter: rateCheck.retryAfter
            })
        };
    }

    const { url, quality } = event.queryStringParameters;

    if (!url || !ytdl.validateURL(url)) {
        return {
            statusCode: 400,
            body: 'Invalid URL'
        };
    }

    try {
        const info = await ytdl.getBasicInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        // For Netlify Functions, standard streaming isn't natively supported in the same way as Express `res.pipe()`.
        // However, we can use the `serverless-http` wrapper or just return a redirect if we had a direct link.
        // BUT, ytdl-core gives us a stream.
        // AWS Lambda (Netlify) supports Response Streaming now, but it's complex to set up in raw functions without adapters.

        // ALTERNATIVE STRATEGY FOR SERVERLESS:
        // 1. Get the direct video URL from ytdl.chooseFormat()
        // 2. Redirect the user to that URL (302)
        // This offloads the bandwidth from our function and avoids timeout limits.

        const format = ytdl.chooseFormat(info.formats, {
            quality: quality || 'highest',
            filter: quality === 'highestaudio' ? 'audioonly' : 'audioandvideo'
        });

        if (format && format.url) {
            return {
                statusCode: 302,
                headers: {
                    'Location': format.url,
                    'Content-Type': 'text/html'
                },
                body: `Redirecting to stream...`
            };
        } else {
            // Fallback: If no direct URL format is found (rare), we might fail.
            return {
                statusCode: 500,
                body: 'Could not resolve direct stream URL.'
            };
        }

    } catch (error) {
        console.error('Download error:', error);
        return {
            statusCode: 500,
            body: 'Download failed: ' + error.message
        };
    }
};
