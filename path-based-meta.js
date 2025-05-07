// This script dynamically updates meta tags based on the current URL path
document.addEventListener('DOMContentLoaded', function() {
    // Get the current URL path
    const path = window.location.pathname;
    
    // Find the canonical link element
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    
    // Find the meta description and keywords
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    
    // Find Open Graph and Twitter tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    
    // Find JSON-LD schema
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    
    // Update page elements
    const h1 = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');
    const urlInput = document.querySelector('#reelUrl');
    const downloadBtn = document.querySelector('#downloadBtn');
    
    // Update based on the current path
    if (path.includes('/reels-download')) {
      // Update document title and meta tags
      document.title = 'Instagram Reels Downloader - Save Reels Videos in HD Quality';
      metaDescription.setAttribute('content', 'Download Instagram reels in HD quality. Free online Instagram reels downloader - save trending videos without watermark. Fast, easy, and no registration required.');
      metaKeywords.setAttribute('content', 'instagram reels downloader, download instagram reels, save reels, instagram reel saver, reels video downloader, download reels without watermark');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/reels-download');
      
      // Update Open Graph and Twitter tags
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram Reels Downloader - Save Reels Videos in HD Quality');
      if (ogDesc) ogDesc.setAttribute('content', 'Download Instagram reels in HD quality. Free online Instagram reels downloader - save trending videos without watermark.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/reels-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram Reels Downloader');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free Instagram reels downloader - save trending videos in HD quality');
      
      // Update schema data
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram Reels Downloader",
          "description": "Download Instagram reels in high quality without watermark",
          "url": "https://instantmediasave.com/reels-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      // Update page content
      if (h1) h1.textContent = 'Instagram Reels Downloader';
      if (subtitle) subtitle.textContent = 'Download reels from Instagram in HD quality without watermark';
      if (urlInput) urlInput.placeholder = 'Paste Instagram Reel URL here...';
      if (downloadBtn) downloadBtn.textContent = 'Download Reel';
    } 
    else if (path.includes('/photos-download')) {
      document.title = 'Instagram Photos Downloader - Save Instagram Images in Original Quality';
      metaDescription.setAttribute('content', 'Download Instagram photos and images in original quality. Free online Instagram photo downloader - save single pictures and carousel posts easily.');
      metaKeywords.setAttribute('content', 'instagram photo downloader, download instagram photos, save instagram images, instagram picture downloader, instagram image saver, download instagram carousel');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/photos-download');
      
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram Photos Downloader - Save Instagram Images in Original Quality');
      if (ogDesc) ogDesc.setAttribute('content', 'Download Instagram photos and images in original quality. Free online Instagram photo downloader - save single pictures and carousel posts easily.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/photos-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram Photos Downloader');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free Instagram photos downloader - save images in original quality');
      
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram Photos Downloader",
          "description": "Download Instagram photos and images in original quality",
          "url": "https://instantmediasave.com/photos-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      if (h1) h1.textContent = 'Instagram Photos Downloader';
      if (subtitle) subtitle.textContent = 'Download Instagram photos and images in original quality';
      if (urlInput) urlInput.placeholder = 'Paste Instagram Photo URL here...';
      if (downloadBtn) downloadBtn.textContent = 'Download Photo';
    }
    else if (path.includes('/stories-download')) {
      document.title = 'Instagram Stories Downloader - Save Instagram Stories Before They Disappear';
      metaDescription.setAttribute('content', 'Download Instagram stories before they disappear. Free online Instagram story downloader - save temporary content from public profiles quickly and easily.');
      metaKeywords.setAttribute('content', 'instagram stories downloader, download instagram stories, save instagram stories, instagram story saver, temporary content downloader, story video downloader');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/stories-download');
      
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram Stories Downloader - Save Instagram Stories Before They Disappear');
      if (ogDesc) ogDesc.setAttribute('content', 'Download Instagram stories before they disappear. Free online Instagram story downloader - save temporary content from public profiles quickly and easily.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/stories-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram Stories Downloader');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free Instagram stories downloader - save temporary content before it disappears');
      
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram Stories Downloader",
          "description": "Download Instagram stories before they disappear in 24 hours",
          "url": "https://instantmediasave.com/stories-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      if (h1) h1.textContent = 'Instagram Stories Downloader';
      if (subtitle) subtitle.textContent = 'Download Instagram stories before they disappear in 24 hours';
      if (urlInput) urlInput.placeholder = 'Paste Instagram Story URL here...';
      if (downloadBtn) downloadBtn.textContent = 'Download Story';
    }
    else if (path.includes('/igtv-download')) {
      document.title = 'Instagram IGTV Video Downloader - Save Long-Form Videos in HD';
      metaDescription.setAttribute('content', 'Download Instagram IGTV videos in high definition. Free online Instagram long-form video downloader - save IGTV content easily without registration.');
      metaKeywords.setAttribute('content', 'instagram igtv downloader, download igtv videos, save igtv content, instagram long video downloader, igtv video saver, instagram tv downloader');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/igtv-download');
      
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram IGTV Video Downloader - Save Long-Form Videos in HD');
      if (ogDesc) ogDesc.setAttribute('content', 'Download Instagram IGTV videos in high definition. Free online Instagram long-form video downloader - save IGTV content easily without registration.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/igtv-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram IGTV Video Downloader');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free Instagram IGTV downloader - save long-form videos in HD quality');
      
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram IGTV Video Downloader",
          "description": "Download Instagram IGTV videos in high definition quality",
          "url": "https://instantmediasave.com/igtv-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      if (h1) h1.textContent = 'Instagram IGTV Video Downloader';
      if (subtitle) subtitle.textContent = 'Download Instagram IGTV videos in high definition quality';
      if (urlInput) urlInput.placeholder = 'Paste Instagram IGTV URL here...';
      if (downloadBtn) downloadBtn.textContent = 'Download IGTV';
    }
    else if (path.includes('/carousel-download')) {
      document.title = 'Instagram Carousel Downloader - Save Multiple Photos & Videos from Posts';
      metaDescription.setAttribute('content', 'Download Instagram carousel posts with multiple photos and videos. Free Instagram slideshow downloader - save all images and videos from multi-content posts.');
      metaKeywords.setAttribute('content', 'instagram carousel downloader, download instagram slideshow, save instagram multiple photos, instagram multi-image downloader, carousel post saver, instagram album downloader');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/carousel-download');
      
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram Carousel Downloader - Save Multiple Photos & Videos from Posts');
      if (ogDesc) ogDesc.setAttribute('content', 'Download Instagram carousel posts with multiple photos and videos. Free Instagram slideshow downloader - save all images and videos from multi-content posts.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/carousel-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram Carousel Downloader');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free Instagram carousel downloader - save all photos and videos from slideshow posts');
      
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram Carousel Downloader",
          "description": "Download Instagram carousel posts with multiple photos and videos",
          "url": "https://instantmediasave.com/carousel-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      if (h1) h1.textContent = 'Instagram Carousel Downloader';
      if (subtitle) subtitle.textContent = 'Download all photos and videos from Instagram carousel posts';
      if (urlInput) urlInput.placeholder = 'Paste Instagram Carousel Post URL here...';
      if (downloadBtn) downloadBtn.textContent = 'Download Carousel';
    }
    else if (path.includes('/videos-download')) {
      document.title = 'Instagram Videos Downloader - Save Instagram Videos in HD Quality';
      metaDescription.setAttribute('content', 'Download Instagram videos in HD quality. Free online Instagram video downloader - save regular videos, clips and short content without watermark.');
      metaKeywords.setAttribute('content', 'instagram video downloader, download instagram videos, save instagram video, instagram clip downloader, instagram video saver, download instagram clip');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/videos-download');
      
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram Videos Downloader - Save Instagram Videos in HD Quality');
      if (ogDesc) ogDesc.setAttribute('content', 'Download Instagram videos in HD quality. Free online Instagram video downloader - save regular videos, clips and short content without watermark.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/videos-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram Videos Downloader');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free Instagram videos downloader - save videos in HD quality');
      
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram Videos Downloader",
          "description": "Download Instagram videos in HD quality without watermark",
          "url": "https://instantmediasave.com/videos-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      if (h1) h1.textContent = 'Instagram Videos Downloader';
      if (subtitle) subtitle.textContent = 'Download Instagram videos in HD quality without watermark';
      if (urlInput) urlInput.placeholder = 'Paste Instagram Video URL here...';
      if (downloadBtn) downloadBtn.textContent = 'Download Video';
    }
    else if (path.includes('/audio-download')) {
      // Update document title and meta tags
      document.title = 'Instagram Audio Extractor - Download Audio from Reels & Videos';
      metaDescription.setAttribute('content', 'Extract and download audio from Instagram reels and videos in MP3 format. Free online Instagram audio extractor with no limits. Works with reels, videos, and stories.');
      metaKeywords.setAttribute('content', 'instagram audio extractor, download instagram audio, instagram reel audio, extract audio from instagram, instagram music downloader, instagram sound download');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/audio-download');
      
      // Update Open Graph and Twitter tags
      if (ogTitle) ogTitle.setAttribute('content', 'Instagram Audio Extractor - Download Audio from Reels & Videos');
      if (ogDesc) ogDesc.setAttribute('content', 'Extract and download audio from Instagram reels and videos in MP3 format. Free online Instagram audio extractor with no limits.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/audio-download');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Instagram Audio Extractor');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Free tool to extract audio from Instagram reels and videos');
      
      // Update schema data
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InstantMediaSave - Instagram Audio Extractor",
          "description": "Extract and download audio from Instagram reels and videos",
          "url": "https://instantmediasave.com/audio-download",
          "applicationCategory": "MediaApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      // Update page content
      if (h1) h1.textContent = 'Instagram Audio Extractor';
      if (subtitle) subtitle.textContent = 'Download audio from Instagram reels, videos, and stories';
      if (urlInput) urlInput.placeholder = 'Paste Instagram URL to extract audio...';
      if (downloadBtn) downloadBtn.textContent = 'Extract Audio';
    }
    else if (path.includes('/about')) {
      document.title = 'About InstantMediaSave - Instagram Downloader Tool';
      metaDescription.setAttribute('content', 'Learn about InstantMediaSave, the free Instagram content downloader. Download reels, photos, stories, and extract audio without limits.');
      metaKeywords.setAttribute('content', 'about instantmediasave, instagram downloader info, instagram saver tool, about us, instagram video downloader');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/about');
      
      // Update Open Graph and Twitter tags
      if (ogTitle) ogTitle.setAttribute('content', 'About InstantMediaSave - Instagram Downloader Tool');
      if (ogDesc) ogDesc.setAttribute('content', 'Learn about InstantMediaSave, the free Instagram content downloader. Download reels, photos, stories, and extract audio without limits.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/about');
      if (twitterTitle) twitterTitle.setAttribute('content', 'About InstantMediaSave');
      if (twitterDesc) twitterDesc.setAttribute('content', 'Learn about our free Instagram downloader tool');
      
      // Update schema data
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "About InstantMediaSave",
          "description": "Learn about InstantMediaSave, the free Instagram content downloader",
          "url": "https://instantmediasave.com/about"
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      // Update page content
      if (h1) h1.textContent = 'About InstantMediaSave';
      if (subtitle) subtitle.textContent = 'Learn about our Instagram content downloader tool';
      
      // Hide the input container and show the about content
      const inputContainer = document.querySelector('.input-container');
      if (inputContainer) inputContainer.style.display = 'none';
      
      // Hide status area
      const statusArea = document.getElementById('status');
      if (statusArea) statusArea.style.display = 'none';
      
      // Hide download area
      const downloadArea = document.getElementById('downloadArea');
      if (downloadArea) downloadArea.style.display = 'none';
      
      // Hide download all container
      const downloadAllContainer = document.getElementById('downloadAllContainer');
      if (downloadAllContainer) downloadAllContainer.style.display = 'none';
      
      // Create and insert the about page content
      const infoSection = document.querySelector('.info-section');
      if (infoSection) {
        infoSection.innerHTML = `
          <h2>About Our Instagram Downloader</h2>
          <p>InstantMediaSave is a free online tool designed to help you download content from Instagram. Our service allows you to save photos, videos, reels, stories, and even extract audio from Instagram posts quickly and easily.</p>
          
          <h3>Our Mission</h3>
          <p>We created InstantMediaSave to provide a simple, efficient, and free solution for saving Instagram content. Our goal is to make the process as straightforward as possible, allowing you to enjoy your favorite Instagram content offline.</p>
          
          <h3>How It Works</h3>
          <p>InstantMediaSave uses advanced web technologies to extract media from Instagram URLs. When you paste a link, our system processes it to locate the media files and make them available for download. The entire process happens in your browser, ensuring fast performance and privacy.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li><strong>Fast Downloads</strong> - Get your content in seconds</li>
            <li><strong>No Registration</strong> - No account or sign-up required</li>
            <li><strong>Completely Free</strong> - No hidden fees or limitations</li>
            <li><strong>High Quality</strong> - Download media in the best available quality</li>
            <li><strong>Audio Extraction</strong> - Extract audio tracks from videos and reels</li>
            <li><strong>Multiple Formats</strong> - Support for all Instagram content types</li>
            <li><strong>Privacy Focused</strong> - We don't store your media or information</li>
          </ul>
          
          <h3>Contact Us</h3>
          <p>If you have any questions, suggestions, or feedback about our service, please don't hesitate to contact us at <a href="mailto:support@instantmediasave.com">support@instantmediasave.com</a>.</p>
          
          <p class="disclaimer">Note: InstantMediaSave is not affiliated with Instagram or Meta. We encourage responsible use of downloaded content in accordance with Instagram's Terms of Service.</p>
        `;
      }
    }
    else if (path.includes('/privacy')) {
      document.title = 'Privacy Policy - InstantMediaSave';
      metaDescription.setAttribute('content', 'Privacy Policy for InstantMediaSave. Learn how we handle your data when you use our Instagram content downloader tool.');
      metaKeywords.setAttribute('content', 'privacy policy, instagram downloader privacy, instantmediasave data policy, user privacy');
      canonicalLink.setAttribute('href', 'https://instantmediasave.com/privacy');
      
      // Update Open Graph and Twitter tags
      if (ogTitle) ogTitle.setAttribute('content', 'Privacy Policy - InstantMediaSave');
      if (ogDesc) ogDesc.setAttribute('content', 'Learn how we handle your data when you use our Instagram content downloader tool.');
      if (ogUrl) ogUrl.setAttribute('content', 'https://instantmediasave.com/privacy');
      if (twitterTitle) twitterTitle.setAttribute('content', 'Privacy Policy');
      if (twitterDesc) twitterDesc.setAttribute('content', 'InstantMediaSave privacy policy');
      
      // Update schema data
      if (jsonLdScript) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy - InstantMediaSave",
          "description": "Learn how we handle your data when you use our Instagram content downloader tool",
          "url": "https://instantmediasave.com/privacy"
        };
        jsonLdScript.textContent = JSON.stringify(schemaData);
      }
      
      // Update page content
      if (h1) h1.textContent = 'Privacy Policy';
      if (subtitle) subtitle.textContent = 'How we handle your data at InstantMediaSave';
      
      // Hide the input container and show the privacy content
      const inputContainer = document.querySelector('.input-container');
      if (inputContainer) inputContainer.style.display = 'none';
      
      // Hide status area
      const statusArea = document.getElementById('status');
      if (statusArea) statusArea.style.display = 'none';
      
      // Hide download area
      const downloadArea = document.getElementById('downloadArea');
      if (downloadArea) downloadArea.style.display = 'none';
      
      // Hide download all container
      const downloadAllContainer = document.getElementById('downloadAllContainer');
      if (downloadAllContainer) downloadAllContainer.style.display = 'none';
      
      // Create and insert the privacy page content
      const infoSection = document.querySelector('.info-section');
      if (infoSection) {
        infoSection.innerHTML = `
          <h2>Privacy Policy</h2>
          <p>Last Updated: May 7, 2025</p>
          
          <p>Welcome to InstantMediaSave. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This privacy policy outlines how we collect, use, and safeguard your information when you use our service.</p>
          
          <h3>Information We Collect</h3>
          <p>When you use InstantMediaSave, we collect minimal information necessary to provide our service:</p>
          <ul>
            <li><strong>Instagram URLs</strong> - The links you paste into our tool</li>
            <li><strong>Device Information</strong> - Type of device, operating system</li>
          </ul>
          
          <h3>How We Use Your Information</h3>
          <p>The information we collect is used for the following purposes:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To improve our website and user experience</li>
            <li>To monitor usage of our service</li>
          </ul>
          
          <h3>Content Processing</h3>
          <p>InstantMediaSave processes Instagram URLs to extract media content for download purposes. <b>We do not</b>:</p>
          <ul>
            <li>Store downloaded media on our servers</li>
            <li>Access private Instagram content</li>
            <li>Track which specific media you download</li>
            <li>Use your Instagram credentials</li>
          </ul>
          
          <h3>Cookies and Tracking</h3>
          <p>Our website uses essential cookies to ensure the proper functioning of our service. We do not use tracking cookies, advertising identifiers, or other tracking technologies.</p>
          
          <h3>Third-Party Services</h3>
          <p>We may use third-party services for hosting and analytics. These services may collect information sent by your browser as part of a web page request, such as cookies or your IP address.</p>
          
          <h3>Your Rights</h3>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access information we have about you</li>
            <li>The right to request deletion of your data</li>
            <li>The right to object to our processing of your data</li>
          </ul>
          
          <h3>Changes to This Privacy Policy</h3>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          
          <h3>Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@instantmediasave.com">privacy@instantmediasave.com</a>.</p>
        `;
      }
    }
  });