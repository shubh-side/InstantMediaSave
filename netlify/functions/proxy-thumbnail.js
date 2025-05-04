// Netlify function to proxy thumbnail images to avoid CORS issues
exports.handler = async function(event, context) {
    try {
        const { url } = event.queryStringParameters;
        
        if (!url) {
            return {
                statusCode: 400,
                body: 'No URL provided'
            };
        }
        
        // Make the request to get the thumbnail
        const fetch = require('node-fetch');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch thumbnail: ${response.statusText}`);
        }
        
        // Get the content type from the response
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // Get the image data as a buffer
        const buffer = await response.buffer();
        
        // Convert buffer to base64 for proper transmission
        const base64Image = buffer.toString('base64');
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*'
            },
            body: base64Image,
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Thumbnail proxy error:', error);
        return {
            statusCode: 500,
            body: 'Error proxying thumbnail'
        };
    }
};