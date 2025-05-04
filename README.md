# Social Media Content Downloader

A serverless web application to download content from Instagram (with YouTube and TikTok support coming soon). This application uses third-party APIs instead of a server to avoid CORS issues.

## Features

- Download Instagram reels, posts, stories, and carousel content
- No server required - fully client-side using third-party APIs
- Easy deployment to Netlify with custom domain support
- Responsive design for mobile and desktop

## Prerequisites

Before deploying, you'll need:

1. A [FastSaverAPI](https://fastsaverapi.com) account and API key
2. A Netlify account
3. A custom domain (if you want to use your own domain)

## Setup Instructions

### 1. Configure API Key

1. Sign up for an API key at [FastSaverAPI](https://fastsaverapi.com)
2. Open `script.js` and replace `your-api-key-here` with your actual API key:
   ```javascript
   const FASTSAVER_API_KEY = 'your-actual-api-key-here';
   ```

### 2. Deploy to Netlify

#### Option A: Deploy from GitHub

1. Push your code to a GitHub repository
2. Log in to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Use these build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy the site:
   ```bash
   netlify deploy
   ```

### 3. Configure Custom Domain

1. In Netlify dashboard, go to "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS configuration instructions for your domain provider (Hostinger)

For Hostinger DNS configuration:
1. Log in to your Hostinger account
2. Go to domain management
3. Add these DNS records:
   - Type: CNAME
   - Name: www
   - Value: your-netlify-subdomain.netlify.app
   
   OR
   
   - Type: A
   - Name: @
   - Value: 75.2.60.5 (Netlify's IP)

4. Wait for DNS propagation (may take up to 24 hours)

## Project Structure

```
.
├── index.html          # Main HTML file
├── script.js           # JavaScript logic (serverless)
├── style.css           # Styling
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## Future Improvements

- Add support for YouTube downloads
- Add support for TikTok downloads
- Improve error handling
- Add download progress indicators
- Add support for batch downloads

## License

MIT License

## Support

For issues or feature requests, please open an issue on the GitHub repository.

## Disclaimer

This tool is for personal use only. Please respect copyright laws and the terms of service of the platforms you download content from.