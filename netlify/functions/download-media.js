// Netlify function to download media and force download in browser
exports.handler = async function(event, context) {
    try {
        const { url, filename } = JSON.parse(event.body || '{}');
        
        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: true, message: 'No URL provided' })
            };
        }
        
        console.log(`Downloading media from: ${url}`);
        
        // Make the request to get the media
        const fetch = require('node-fetch');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.statusText}`);
        }
        
        // Get the content type from the response
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        
        // Get the media data as a buffer
        const buffer = await response.buffer();
        
        // Convert buffer to base64 for proper transmission
        const base64Data = buffer.toString('base64');
        
        // Return the media with headers that force download
        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            },
            body: base64Data,
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Download media error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: true, message: 'Failed to download media' })
        };
    }
};