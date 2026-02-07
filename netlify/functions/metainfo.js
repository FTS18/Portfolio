import ytdl from '@distube/ytdl-core';

export const handler = async function (event, context) {
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
                'Access-Control-Allow-Origin': '*'
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
