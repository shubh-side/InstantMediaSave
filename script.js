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
            // Show loading status with different messages based on content type
            if (window.lastUrlType === 'story') {
                showStatus('<div class="loading"></div> Downloading story... This may take a moment. Stories may require multiple attempts.', 'loading');
            } else {
                showStatus('<div class="loading"></div> Downloading content... This may take a moment.', 'loading');
            }
            
            // Reset display elements and clear ALL previous content
            resetDisplay();
            
            // Check if it's a post URL that might contain multiple items
            if (window.lastUrlType === 'post') {
                // Show the "Download All" button for potential carousel posts
                downloadAllContainer.classList.remove('hidden');
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
            showDetailedError(error.message || 'An error occurred while downloading the content');
        }
    });

    // Function to process API response and normalize it
    function processAPIResponse(data) {
        // Handle single content
        if (!data.medias || data.medias.length === 0) {
            const mediaType = data.type === 'video' ? 'video' : 'image';
            const mediaUrl = data.download_url;
            
            if (!mediaUrl) {
                throw new Error('No media URL found');
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
            img.src = data.mediaUrl;
            img.className = 'preview-media';
            mediaContainer.appendChild(img);
        }
        
        // Create download button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-button';
        downloadButton.textContent = `Download ${capitalizeFirstLetter(contentType)}`;
        downloadButton.addEventListener('click', () => {
            handleMediaDownload(data.mediaUrl, data.filename);
        });
        
        // Add to download area
        downloadArea.appendChild(mediaContainer);
        downloadArea.appendChild(downloadButton);
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
        
        // Create main item container
        const mainItemContainer = document.createElement('div');
        mainItemContainer.className = 'main-item';
        
        const mainHeader = document.createElement('h3');
        mainHeader.textContent = `Downloaded Item 1 of ${data.carouselCount}`;
        mainItemContainer.appendChild(mainHeader);
        
        // Create media container for first item
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'media-container';
        
        if (data.mediaType === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.src = data.mediaUrl;
            video.className = 'media-preview';
            mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = data.mediaUrl;
            img.className = 'media-preview';
            mediaContainer.appendChild(img);
        }
        mainItemContainer.appendChild(mediaContainer);
        
        // Create download button for first item
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', () => {
            handleMediaDownload(data.mediaUrl, data.filename);
        });
        mainItemContainer.appendChild(downloadBtn);
        
        downloadArea.appendChild(mainItemContainer);
        
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
            
            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-item-btn';
            downloadBtn.setAttribute('data-index', item.index);
            downloadBtn.setAttribute('data-id', item.uniqueId);
            downloadBtn.setAttribute('data-url', item.downloadUrl);
            downloadBtn.textContent = `Download Item ${item.index}`;
            itemElement.appendChild(downloadBtn);
            
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

    // Handle "Download All" button for carousel posts
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', async () => {
            const url = downloadAllBtn.getAttribute('data-url');
            
            if (!url) {
                showStatus('Invalid URL for carousel download', 'error');
                return;
            }
            
            try {
                // Show loading status
                showStatus('<div class="loading"></div> Downloading all content... This may take a moment.', 'loading');
                
                // Download all items in the carousel using Netlify function
                const response = await fetch('/.netlify/functions/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url })
                });
                
                const data = await response.json();
                
                if (data.error === true) {
                    throw new Error(data.message || 'Failed to download carousel content');
                }
                
                const mediaInfo = processAPIResponse(data);
                
                if (mediaInfo.isCarousel && mediaInfo.carouselItems && mediaInfo.carouselItems.length > 0) {
                    // Create a carousel container
                    const carouselContainer = document.createElement('div');
                    carouselContainer.className = 'carousel-container';
                    
                    // Add each media item to the carousel
                    mediaInfo.carouselItems.forEach((item, index) => {
                        const itemContainer = document.createElement('div');
                        itemContainer.className = 'carousel-item';
                        
                        if (item.type === 'video') {
                            const video = document.createElement('video');
                            video.className = 'preview-media';
                            video.controls = true;
                            video.src = item.downloadUrl;
                            itemContainer.appendChild(video);
                        } else {
                            const img = document.createElement('img');
                            img.className = 'preview-media';
                            img.src = item.downloadUrl;
                            itemContainer.appendChild(img);
                        }
                        
                        const downloadBtn = document.createElement('button');
                        downloadBtn.className = 'download-button';
                        downloadBtn.textContent = `Download ${capitalizeFirstLetter(item.type)} ${index + 1}`;
                        downloadBtn.addEventListener('click', () => {
                            const filename = `instagram-content-${Date.now()}-${index + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
                            handleMediaDownload(item.downloadUrl, filename);
                        });
                        itemContainer.appendChild(downloadBtn);
                        
                        carouselContainer.appendChild(itemContainer);
                    });
                    
                    // Add the carousel to the download area
                    downloadArea.innerHTML = '';
                    downloadArea.appendChild(carouselContainer);
                    downloadArea.classList.remove('hidden');
                    
                    showStatus(`Downloaded ${mediaInfo.carouselItems.length} items successfully!`, 'success');
                } else {
                    throw new Error('No carousel items found');
                }
                
            } catch (error) {
                showDetailedError(error.message || 'An error occurred while downloading carousel content');
            }
        });
    }

    // Function to handle media download through Netlify function
    async function handleMediaDownload(url, filename) {
        try {
            console.log(`Downloading: ${filename}`);
            
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
            
        } catch (error) {
            console.error('Download error:', error);
            showStatus('Failed to download file. Please try again.', 'error');
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
});