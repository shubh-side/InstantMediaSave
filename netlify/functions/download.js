// Netlify function to handle API requests and avoid CORS issues
exports.handler = async function(event, context) {
    try {
        // Get the URL and API key from the request
        const { url } = JSON.parse(event.body || '{}');
        const API_KEY = process.env.FASTSAVER_API_KEY;
        
        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: true, message: 'URL is required' })
            };
        }
        
        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: true, message: 'API key not configured' })
            };
        }
        
        // Make the request to FastSaverAPI
        const fetch = require('node-fetch');
        const apiUrl = `https://fastsaverapi.com/get-info?url=${encodeURIComponent(url)}&token=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: true, message: 'Failed to fetch data' })
        };
    }
};