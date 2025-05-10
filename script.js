document.addEventListener('DOMContentLoaded', () => {
    const reelUrlInput = document.getElementById('reelUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const status = document.getElementById('status');
    const downloadArea = document.getElementById('downloadArea');
    const videoPreview = document.getElementById('videoPreview');
    const imagePreview = document.getElementById('imagePreview');
    const downloadLink = document.getElementById('downloadLink');
    const downloadAllContainer = document.getElementById('downloadAllContainer');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    
    // Keep track of current URL for carousel downloads
    let currentUrl = '';

    // Store the last URL type to provide better error messages
    window.lastUrlType = null;
    
    // Store video URLs for audio extraction
    window.videoUrls = {};

    window.pageType = window.pageType || getPageTypeFromPath();
    
    function getPageTypeFromPath() {
        const path = window.location.pathname;
        if (path.includes('reels-download')) return 'reels';
        if (path.includes('photos-download')) return 'photos';
        if (path.includes('stories-download')) return 'stories';
        if (path.includes('igtv-download')) return 'igtv';
        if (path.includes('carousel-download')) return 'carousel';
        if (path.includes('videos-download')) return 'videos';
        if (path.includes('audio-download')) return 'audio';
        if (path.includes('about')) return 'about';
        if (path.includes('privacy')) return 'privacy';
        return 'home';
    }

    // Handle Enter key press
    reelUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });

    // Handle download button click
    downloadBtn.addEventListener('click', async () => {
        const url = reelUrlInput.value.trim();
        currentUrl = url; // Store for later use
        
        if (!validateAndDetectUrlType(url)) {
            return;
        }

        try {
            // Disable the download button and change text to show loading
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Fetching...';
            // Show loading status with different messages based on content type
            if (window.lastUrlType === 'story') {
                showStatus('<div class="loading"></div> Downloading story... This may take a moment. Stories may require multiple attempts.', 'loading');
            } else {
                showStatus('<div class="loading"></div> Downloading content... This may take a moment.', 'loading');
            }
            
            // Reset display elements and clear ALL previous content
            resetDisplay();
            
            // Reset video URLs for audio extraction
            window.videoUrls = {};
            
            // Check if it's a post URL that might contain multiple items
            if (window.lastUrlType === 'post') {
                // Show the "Download All" button for potential carousel posts
               // downloadAllContainer.classList.remove('hidden');
                downloadAllBtn.setAttribute('data-url', url);
            } else {
                downloadAllContainer.classList.add('hidden');
            }

            // Send request using Netlify function
            const response = await fetch('/.netlify/functions/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });
            
            const data = await response.json();
            // Reset the download button
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download';
            if (data.error === true) {
                throw new Error(data.message || 'Failed to download the content');
            }
            
            const mediaInfo = processAPIResponse(data);
            
            // Check if the result is a carousel
            if (mediaInfo.isCarousel && mediaInfo.carouselItems && mediaInfo.carouselItems.length > 1) {
                // Handle carousel response differently
                handleMultipleItemsResponse(mediaInfo);
            } else {
                // Handle single item response
                handleSingleItemResponse(mediaInfo);
            }
            
        } catch (error) {
            // Reset the download button state in case of error
            downloadBtn.disabled = false;
            downloadBtn.textContent = getDownloadButtonText();
        
            showDetailedError(error.message || 'An error occurred while downloading the content');
        }
    });

    // Function to get appropriate download button text based on page
    function getDownloadButtonText() {
        const pageType = window.pageType;
        const texts = {
            'reels': 'Download Reel',
            'photos': 'Download Photo',
            'videos': 'Download Video',
            'stories': 'Download Story',
            'igtv': 'Download IGTV',
            'carousel': 'Download Carousel',
            'audio': 'Extract Audio'
        };
        return texts[pageType] || 'Download';
    }
    
    // Function to process API response and normalize it
    function processAPIResponse(data) {
        // Handle single content
        if (!data.medias || data.medias.length === 0) {
            const mediaType = data.type === 'video' ? 'video' : 'image';
            const mediaUrl = data.download_url;
            
            if (!mediaUrl) {
                throw new Error('No media URL found');
            }
            
            // Store video URL for audio extraction if it's a video
            if (mediaType === 'video') {
                window.videoUrls['main'] = mediaUrl;
            }
            
            return {
                success: true,
                mediaUrl: mediaUrl,
                mediaType: mediaType,
                filename: `instagram-content-${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`
            };
        }
        
        // Handle carousel/album
        if (data.type === 'album' && data.medias && data.medias.length > 0) {
            const carouselItems = data.medias.map((item, index) => {
                const mediaType = item.type === 'video' ? 'video' : 'image';
                let thumbnailUrl;
                
                // Store video URL for audio extraction if it's a video
                if (mediaType === 'video' && item.download_url) {
                    window.videoUrls[`item-${index + 1}`] = item.download_url;
                }
                
                // Use thumbnail proxy for all external URLs
                if (item.thumb && item.thumb !== item.download_url) {
                    thumbnailUrl = `/.netlify/functions/proxy-thumbnail?url=${encodeURIComponent(item.thumb)}`;
                } else if (mediaType === 'image' && item.download_url) {
                    thumbnailUrl = `/.netlify/functions/proxy-thumbnail?url=${encodeURIComponent(item.download_url)}`;
                } else if (mediaType === 'video' && item.download_url) {
                    // For videos, we still try to get a thumbnail through the proxy
                    thumbnailUrl = `/.netlify/functions/proxy-thumbnail?url=${encodeURIComponent(item.download_url)}`;
                } else {
                    // Last resort: use placeholder
                    thumbnailUrl = `https://via.placeholder.com/300x300/0095f6/ffffff?text=${mediaType.toUpperCase()}`;
                }
                
                return {
                    index: index + 1,
                    type: mediaType,
                    thumbnailUrl: thumbnailUrl,
                    uniqueId: `carousel-${Date.now()}-${index + 1}`,
                    downloadUrl: item.download_url
                };
            });
            
            // Store first video URL as main if it's a video
            if (data.medias[0].type === 'video') {
                window.videoUrls['main'] = data.medias[0].download_url;
            }
            
            return {
                success: true,
                mediaUrl: data.medias[0].download_url,
                mediaType: data.medias[0].type === 'video' ? 'video' : 'image',
                filename: `instagram-content-${Date.now()}.${data.medias[0].type === 'video' ? 'mp4' : 'jpg'}`,
                isCarousel: true,
                carouselCount: data.medias.length,
                carouselItems: carouselItems
            };
        }
        
        return {
            success: false,
            message: 'No content found'
        };
    }

    // Function to handle single item response (video or image)
    function handleSingleItemResponse(data) {
        // Show success status with content type indication
        const contentType = data.mediaType === 'video' ? 'video' : 'image';
        showStatus(`${capitalizeFirstLetter(contentType)} downloaded successfully!`, 'success');
        
        // Clear download area and show it
        downloadArea.innerHTML = '';
        downloadArea.classList.remove('hidden');
        
        // Create a container div for media
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'preview-container';
        
        // Show the appropriate preview
        if (data.mediaType === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.src = data.mediaUrl;
            video.className = 'preview-media';
            mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = `/.netlify/functions/proxy-thumbnail?url=${encodeURIComponent(data.mediaUrl)}`;
            img.className = 'preview-media';
            img.onerror = function() {
            console.log('Image failed to load');
            this.src = `https://via.placeholder.com/300x300/0095f6/ffffff?text=IMAGE`;
        };
        mediaContainer.appendChild(img);
        }
        
        // Create download buttons container
        const downloadButtonsContainer = document.createElement('div');
        downloadButtonsContainer.className = 'download-buttons-container';
        
        // Create main download button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-button';
        downloadButton.textContent = `Download ${capitalizeFirstLetter(contentType)}`;
        downloadButton.addEventListener('click', () => {
            handleMediaDownload(data.mediaUrl, data.filename);
        });
        downloadButtonsContainer.appendChild(downloadButton);
        
        // Add audio extraction button for videos
        if (data.mediaType === 'video') {
            const extractAudioButton = document.createElement('button');
            extractAudioButton.className = 'extract-audio-button';
            extractAudioButton.textContent = 'Extract Audio';
            extractAudioButton.addEventListener('click', () => {
                extractAudio(data.mediaUrl, `instagram-audio-${Date.now()}.mp3`);
            });
            downloadButtonsContainer.appendChild(extractAudioButton);
        }
        
        // Add to download area
        downloadArea.appendChild(mediaContainer);
        downloadArea.appendChild(downloadButtonsContainer);
    }

    // Helper function to reset display elements
    function resetDisplay() {
        // Hide and clear the download area
        downloadArea.classList.add('hidden');
        downloadArea.innerHTML = '';
        
        // Hide the download all container
        downloadAllContainer.classList.add('hidden');
        
        // Reset status
        status.innerHTML = '';
        status.className = 'status';
    }

    // Function to handle multiple items response (carousel or story)
    function handleMultipleItemsResponse(data) {
        // Show success status
        showStatus(`Found ${data.carouselCount} items in this post!`, 'success');
        
        // Clear download area and make it visible
        downloadArea.innerHTML = '';
        downloadArea.classList.remove('hidden');
        
        // Add carousel items section
        const carouselSection = document.createElement('div');
        carouselSection.className = 'carousel-section';
        
        // Add header
        const header = document.createElement('h3');
        header.textContent = 'All Items in This Post';
        carouselSection.appendChild(header);
        
        // Create grid for carousel items
        const grid = document.createElement('div');
        grid.className = 'carousel-grid';
        
        // Add each item
        data.carouselItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carousel-item';
            
            // Create the thumbnail container with fixed aspect ratio
            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.className = 'thumbnail-container';
            
            // Add thumbnail image 
            const thumbnail = document.createElement('img');
            thumbnail.className = 'thumbnail';
            
            // Set thumbnail source using our proxy
            thumbnail.src = item.thumbnailUrl;
            
            // Handle thumbnail loading errors
            thumbnail.onerror = function() {
                console.log(`Thumbnail failed to load for item ${item.index}`);
                // Use placeholder as last resort
                this.src = `https://via.placeholder.com/300x300/0095f6/ffffff?text=${item.type.toUpperCase()}`;
            };
            
            thumbnailContainer.appendChild(thumbnail);
            
            // Add type badge (VIDEO or IMAGE)
            const typeSpan = document.createElement('span');
            typeSpan.className = 'item-type';
            typeSpan.textContent = item.type.toUpperCase();
            thumbnailContainer.appendChild(typeSpan);
            
            itemElement.appendChild(thumbnailContainer);
            
            // Create buttons container
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'item-buttons';
            
            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-item-btn';
            downloadBtn.setAttribute('data-index', item.index);
            downloadBtn.setAttribute('data-id', item.uniqueId);
            downloadBtn.setAttribute('data-url', item.downloadUrl);
            downloadBtn.textContent = `Download Item ${item.index}`;
            buttonsDiv.appendChild(downloadBtn);
            
            // Add audio extraction button for videos
            if (item.type === 'video') {
                const audioBtn = document.createElement('button');
                audioBtn.className = 'extract-audio-item-btn';
                audioBtn.setAttribute('data-index', item.index);
                audioBtn.setAttribute('data-id', item.uniqueId);
                audioBtn.setAttribute('data-url', item.downloadUrl);
                audioBtn.textContent = 'Extract Audio';
                buttonsDiv.appendChild(audioBtn);
            }
            
            itemElement.appendChild(buttonsDiv);
            grid.appendChild(itemElement);
        });
        
        carouselSection.appendChild(grid);
        downloadArea.appendChild(carouselSection);
        
        // Add event listeners to download buttons
        document.querySelectorAll('.download-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const uniqueId = this.getAttribute('data-id');
                const downloadUrl = this.getAttribute('data-url');
                downloadCarouselItem(downloadUrl, index);
            });
        });
        
        // Add event listeners to audio extraction buttons
        document.querySelectorAll('.extract-audio-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const uniqueId = this.getAttribute('data-id');
                const downloadUrl = this.getAttribute('data-url');
                extractAudio(downloadUrl, `instagram-audio-item${index}-${Date.now()}.mp3`);
            });
        });
    }

    // Function to download a specific carousel item
    async function downloadCarouselItem(downloadUrl, itemIndex) {
        try {
            // Show loading state
            const button = document.querySelector(`[data-index="${itemIndex}"]`);
            const originalText = button.textContent;
            button.textContent = 'Downloading...';
            button.disabled = true;
            
            // Determine filename
            const filename = `instagram-content-${Date.now()}-item${itemIndex}.${downloadUrl.includes('.mp4') ? 'mp4' : 'jpg'}`;
            
            // Use the download function
            await handleMediaDownload(downloadUrl, filename);
            
            // Update button state
            button.textContent = 'Downloaded!';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Error downloading item:', error);
            showStatus('Failed to download item', 'error');
        }
    }


    // Function to handle media download through Netlify function
    async function handleMediaDownload(url, filename) {
        try {
            console.log(`Downloading: ${filename}`);
            const downloadBtn = document.querySelector('.download-button, .download-btn');
            const originalText = downloadBtn ? downloadBtn.textContent : '';
            if (downloadBtn) {
                downloadBtn.textContent = 'Downloading...';
                downloadBtn.disabled = true;
            }
            showStatus('<div class="loading"></div> Downloading content... This may take a moment.', 'loading');
        
            // Call the Netlify function to download the media
            const response = await fetch('/.netlify/functions/download-media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url, filename: filename })
            });
            
            if (!response.ok) {
                throw new Error('Failed to download media');
            }
            
            // Get the blob from the response
            const blob = await response.blob();
            
            // Create a download link and trigger download
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the object URL
            setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
            }, 100);
            // Show success status
            showStatus('Content downloaded successfully!', 'success');
            
            // Restore button state
            if (downloadBtn) {
                setTimeout(() => {
                    downloadBtn.textContent = 'Downloaded!';
                    setTimeout(() => {
                        downloadBtn.textContent = originalText;
                        downloadBtn.disabled = false;
                    }, 2000);
                }, 500);
            }
        } catch (error) {
            console.error('Download error:', error);
            showStatus('Failed to download file. Please try again.', 'error');
            // Restore any disabled button
            const downloadBtn = document.querySelector('.download-button[disabled], .download-btn[disabled]');
            if (downloadBtn) {
                downloadBtn.textContent = 'Try Again';
                downloadBtn.disabled = false;
            }
        }
    }

    // Enhanced error handling and user feedback for story downloads
    function showDetailedError(message) {
        const errorMessages = {
            'Could not extract media from the provided URL': 'Unable to download this content. It might be private or expired.',
            'No download method succeeded': 'Download failed. This content might require login or is no longer available.',
            'All download methods failed': 'Content download failed after multiple attempts.',
            'All story download methods failed': 'Story download failed. Stories may have expired or might be from a private account.',
            'Failed to fetch from FastSaverAPI': 'External API service failed to download this content.',
            'Story not available or expired': 'This story is no longer available or has expired.',
            'No file was downloaded': 'No media could be downloaded from this URL.',
            'Invalid Instagram URL': 'Please enter a valid Instagram URL (reel, post, or story).'
        };

        // Find a matching error message or use the original
        let detailedMessage = message;
        for (const [errorKey, errorValue] of Object.entries(errorMessages)) {
            if (message.includes(errorKey)) {
                detailedMessage = errorValue;
                break;
            }
        }

        // Special case for stories
        if ((message.toLowerCase().includes('story') || window.lastUrlType === 'story') && 
            !message.includes('specific error')) {
            detailedMessage += '<div class="error-tips">' +
                '<p><strong>Tips for downloading stories:</strong></p>' +
                '<ul>' +
                '<li>Make sure the story is still available (stories expire after 24 hours)</li>' +
                '<li>Only public stories can be downloaded without login</li>' +
                '<li>Try refreshing the page and attempting again</li>' +
                '</ul>' +
                '</div>';
        }

        showStatus(detailedMessage, 'error');
    }

    // Enhanced URL validation with type detection
    function validateAndDetectUrlType(url) {
        // Basic validation
        if (!url) {
            showStatus('Please enter an Instagram URL', 'error');
            return false;
        }
        
        if (!isValidInstagramUrl(url)) {
            showStatus('Please enter a valid Instagram URL (reel, post, or story)', 'error');
            return false;
        }
        
        // Detect and store URL type
        window.lastUrlType = getContentTypeFromUrl(url);
        
        // Special warning for stories
        if (window.lastUrlType === 'story') {
            showStatus('Attempting to download story... Note that stories must be public and not expired.', 'info');
        }
        
        return true;
    }

    // Helper function to determine content type from URL
    function getContentTypeFromUrl(url) {
        if (url.includes('/reel/') || url.includes('/tv/')) {
            return 'reel';
        } else if (url.includes('/stories/') || url.includes('/highlights/') || url.includes('instagram.com/s/')) {
            return 'story';
        } else if (url.includes('/p/')) {
            return 'post';
        } else {
            return 'unknown';
        }
    }

    // Helper function to show status messages
    function showStatus(message, type = 'info') {
        status.innerHTML = message;
        status.className = 'status';
        status.classList.add(type);
    }

    // Validate Instagram URL
    function isValidInstagramUrl(url) {
        // Basic Instagram URL validation
        const basicRegex = /^https?:\/\/(www\.)?instagram\.com\//;
        if (!basicRegex.test(url)) {
            return false;
        }
        
        // Check for different content types
        const reelRegex = /instagram\.com\/reel\/([^\/\?]+)/;
        const postRegex = /instagram\.com\/p\/([^\/\?]+)/;
        const tvRegex = /instagram\.com\/tv\/([^\/\?]+)/;
        const highlightRegex = /instagram\.com\/stories\/highlights\/([^\/\?]+)/;
        
        // Multiple story URL formats
        const storyRegex1 = /instagram\.com\/stories\/([^\/]+)\/([^\/\?]+)/; // Standard format
        const storyRegex2 = /instagram\.com\/stories\/([^\/\?]+)/; // Username only format
        const storyRegex3 = /instagram\.com\/s\/([^\/\?]+)/; // Short URL format
        
        return (
            reelRegex.test(url) ||
            postRegex.test(url) ||
            tvRegex.test(url) ||
            highlightRegex.test(url) ||
            storyRegex1.test(url) ||
            storyRegex2.test(url) ||
            storyRegex3.test(url)
        );
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

// Function to extract audio from video URL using client-side processing
async function extractAudioClientSide(videoUrl, filename) {
    try {
        const audioBtn = document.querySelector('.extract-audio-button, .extract-audio-btn, .extract-audio-item-btn');
        const originalText = audioBtn ? audioBtn.textContent : '';

        // Update button state if found
        if (audioBtn) {
            audioBtn.textContent = 'Extracting...';
            audioBtn.disabled = true;
        }
      // Show loading status
      showStatus('<div class="loading"></div> Extracting audio... This may take a moment.', 'loading');
      
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Fetch the video file
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch video file');
      }
      
      // Get the video data as an array buffer
      const videoData = await response.arrayBuffer();
      
      // Decode the audio from the video
      const audioBuffer = await audioContext.decodeAudioData(videoData);
      
      // Create an offline audio context for rendering
      const offlineAudioContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      // Create a buffer source
      const source = offlineAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineAudioContext.destination);
      source.start(0);
      
      // Render the audio
      const renderedBuffer = await offlineAudioContext.startRendering();
      
      // Convert the rendered buffer to WAV format
      const wavBuffer = bufferToWav(renderedBuffer);
      
      // Create a blob from the WAV buffer
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'audio-extract.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Show success status
      showStatus('Audio extracted and downloaded successfully!', 'success');
      // Restore button state
        if (audioBtn) {
            setTimeout(() => {
                audioBtn.textContent = 'Extracted!';
                setTimeout(() => {
                    audioBtn.textContent = originalText;
                    audioBtn.disabled = false;
                }, 2000);
            }, 500);
        }
      
    } catch (error) {
      console.error('Client-side audio extraction error:', error);
      showStatus('Failed to extract audio. The video format may not be supported by your browser.', 'error');
      // Restore any disabled button
      const audioBtn = document.querySelector('.extract-audio-button[disabled], .extract-audio-btn[disabled], .extract-audio-item-btn[disabled]');
      if (audioBtn) {
          audioBtn.textContent = 'Try Again';
          audioBtn.disabled = false;
      }
    }
  }
  
  // Helper function to convert an AudioBuffer to a WAV file
  function bufferToWav(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2; // 2 bytes per sample
    const sampleRate = audioBuffer.sampleRate;
    
    // Create the buffer for the WAV file
    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);
    
    // Write the WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (1 for PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true); // byte rate
    view.setUint16(32, numberOfChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);
    
    // Write the audio data
    const channelData = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        // Convert float audio data (-1 to 1) to 16-bit PCM
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, value, true);
        offset += 2;
      }
    }
    
    return buffer;
  }
  
  // Helper function to write a string to a DataView
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  
  // Replace your existing extractAudio function with this one that uses client-side processing
  function extractAudio(videoUrl, filename) {
    // Use client-side processing instead of server
    extractAudioClientSide(videoUrl, filename)
      .catch(error => {
        console.error('Audio extraction failed:', error);
        showStatus('Failed to extract audio. Please try downloading the video instead.', 'error');
      });
  }
});