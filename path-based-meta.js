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
  });