import ytdl from '@distube/ytdl-core';
import { checkRateLimit, getRateLimitHeaders } from './utils/rateLimit.js';

export const handler = async function (event, context) {
    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for'] ||
        event.headers['client-ip'] ||
        'unknown';

    // Check rate limit
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
        return {
            statusCode: 429,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Retry-After': rateCheck.retryAfter.toString()
            },
            body: JSON.stringify({
                error: 'Too many requests',
                retryAfter: rateCheck.retryAfter
            })
        };
    }

    const { url } = event.queryStringParameters;

    if (!url || !ytdl.validateURL(url)) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Invalid YouTube URL' })
        };
    }

    try {
        const info = await ytdl.getBasicInfo(url);

        // Ensure video details exist
        if (!info || !info.videoDetails) {
            throw new Error('Video details not available');
        }

        // Choose format logic (simplified for metadata display)
        const formats = info.formats
            .filter(f => f.hasVideo && f.hasAudio)
            .map(f => ({
                quality: f.qualityLabel,
                itag: f.itag,
                container: f.container
            }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            },
            body: JSON.stringify({
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                author: info.videoDetails.author.name,
                duration: info.videoDetails.lengthSeconds,
                formats: formats
            })
        };
    } catch (error) {
        console.error('Meta info error:', error.message, error.stack);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to fetch video info',
                message: error.message
            })
        };
    }
};
