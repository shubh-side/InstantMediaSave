// optimized-translate-client.js - with error handling
document.addEventListener('DOMContentLoaded', function() {
    // Language selector elements
    const langButton = document.getElementById('langButton');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangDisplay = document.querySelector('.current-lang');
    
    // Define supported languages with their codes and names
    const LANGUAGES = {
        'en': { name: 'English', flag: '🇺🇸' },
        'es': { name: 'Español', flag: '🇪🇸' },
        'fr': { name: 'Français', flag: '🇫🇷' },
        'hi': { name: 'हिन्दी', flag: '🇮🇳' },
        'de': { name: 'Deutsch', flag: '🇩🇪' },
        'it': { name: 'Italiano', flag: '🇮🇹' },
        'pt': { name: 'Português', flag: '🇧🇷' },
        'ru': { name: 'Русский', flag: '🇷🇺' },
        'ja': { name: '日本語', flag: '🇯🇵' },
        'zh-CN': { name: '中文 (简体)', flag: '🇨🇳' },
        'zh-TW': { name: '中文 (繁體)', flag: '🇹🇼' },
        'ko': { name: '한국어', flag: '🇰🇷' },
        'ar': { name: 'العربية', flag: '🇸🇦' }
    };
    
    // Store original text content of elements to translate back to English
    const originalContent = new Map();
    
    // Cache for translated content to minimize API calls
    const translationCache = new Map();
    
    // Current language
    let currentLanguage = 'en';
    
    // Initialize language dropdown
    initLanguageDropdown();
    
    // Restore language preference if saved
    restoreLanguagePreference();
    
    // Toggle dropdown when clicking the language button
    langButton.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!langButton.contains(event.target) && !langDropdown.contains(event.target)) {
            langDropdown.classList.add('hidden');
        }
    });
    
    // Function to initialize language dropdown
    function initLanguageDropdown() {
        // Clear existing options
        langDropdown.innerHTML = '';
        
        // Create language options
        Object.entries(LANGUAGES).forEach(([code, data]) => {
            const option = document.createElement('div');
            option.className = 'lang-option';
            option.setAttribute('data-lang', code);
            option.innerHTML = `${data.flag} ${data.name}`;
            
            // Highlight current language
            if (code === currentLanguage) {
                option.classList.add('active');
            }
            
            // Add click event
            option.addEventListener('click', function() {
                changeLanguage(code);
            });
            
            langDropdown.appendChild(option);
        });
    }
    
    /* Restore language preference
    function restoreLanguagePreference() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && LANGUAGES[savedLang]) {
            changeLanguage(savedLang, false); // Don't force translation if it's first load
        }
    }
    */
    // Change language function
    function changeLanguage(languageCode, forceTranslate = true) {
        // Skip if same language is selected
        if (languageCode === currentLanguage && !forceTranslate) {
            return;
        }
        
        // Show loading indicator
        const loadingIndicator = showLoadingIndicator();
        
        try {
            // Handle English (original) language
            if (languageCode === 'en') {
                // Restore original content
                restoreOriginalContent();
                currentLanguage = 'en';
                updateUI(languageCode);
                hideLoadingIndicator(loadingIndicator);
                return;
            }
            
            // If switching from a non-English language
            if (currentLanguage !== 'en' && forceTranslate) {
                // First restore to English
                restoreOriginalContent();
            }
            
            // Get all text elements to translate
            const elements = getTranslatableElements();
            
            // Only store original content if not already stored and not English
            if (originalContent.size === 0 && languageCode !== 'en') {
                storeOriginalContent(elements);
            }
            
            // Get texts to translate
            const textItems = [];
            
            // Process elements for translation
            elements.forEach(el => {
                try {
                    // Skip null or undefined elements
                    if (!el) return;
                    
                    // Check if this is a special element like a link
                    if (el.tagName && el.tagName.toLowerCase() === 'a') {
                        // Handle links specially to preserve href attributes
                        const text = el.textContent ? el.textContent.trim() : '';
                        if (text) {
                            textItems.push({
                                element: el,
                                text: text,
                                type: 'link',
                                href: el.getAttribute('href') || ''
                            });
                        }
                    } else if (el.textContent) {
                        // Regular elements with text
                        const text = el.textContent.trim();
                        if (text) {
                            textItems.push({
                                element: el,
                                text: text,
                                type: 'text'
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error processing element for translation:', err);
                }
            });
            
            // Add placeholders to translate
            document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
                try {
                    const placeholder = el.getAttribute('placeholder');
                    if (placeholder && placeholder.trim().length > 0) {
                        textItems.push({
                            element: el,
                            text: placeholder.trim(),
                            type: 'placeholder'
                        });
                    }
                } catch (err) {
                    console.error('Error processing placeholder for translation:', err);
                }
            });
            
            // Only proceed if there's text to translate
            if (textItems.length > 0) {
                // OPTIMIZATION: Group texts by content to reduce duplicates
                const uniqueTexts = new Map();
                
                textItems.forEach(item => {
                    if (!uniqueTexts.has(item.text)) {
                        uniqueTexts.set(item.text, []);
                    }
                    uniqueTexts.get(item.text).push(item);
                });
                
                // Convert to batch translation format
                const textsToTranslate = Array.from(uniqueTexts.keys());
                
                // OPTIMIZATION: Check cache first
                const uncachedTexts = [];
                const cacheResults = new Map();
                
                textsToTranslate.forEach(text => {
                    const cacheKey = `${text}|${languageCode}`;
                    if (translationCache.has(cacheKey)) {
                        cacheResults.set(text, translationCache.get(cacheKey));
                    } else {
                        uncachedTexts.push(text);
                    }
                });
                
                // Apply cached translations immediately
                cacheResults.forEach((translation, originalText) => {
                    const items = uniqueTexts.get(originalText) || [];
                    items.forEach(item => applyTranslation(item, translation));
                });
                
                // Only translate texts that aren't cached
                if (uncachedTexts.length > 0) {
                    // OPTIMIZATION: Send in larger batches instead of individual requests
                    translateBatchedTexts(uncachedTexts, 'en', languageCode)
                        .then(translatedTexts => {
                            // Apply translations and update cache
                            uncachedTexts.forEach((text, index) => {
                                if (translatedTexts[index]) {
                                    const translation = translatedTexts[index];
                                    const cacheKey = `${text}|${languageCode}`;
                                    
                                    // Store in cache
                                    translationCache.set(cacheKey, translation);
                                    
                                    // Apply to all matching elements
                                    const items = uniqueTexts.get(text) || [];
                                    items.forEach(item => applyTranslation(item, translation));
                                }
                            });
                            
                            // Update current language and UI
                            currentLanguage = languageCode;
                            updateUI(languageCode);
                            
                            // Hide loading indicator
                            hideLoadingIndicator(loadingIndicator);
                        })
                        .catch(error => {
                            console.error('Translation error:', error);
                            alert('Translation failed. Please try again later.');
                            
                            // Hide loading indicator
                            hideLoadingIndicator(loadingIndicator);
                            
                            // If error occurs, revert to English
                            if (currentLanguage !== 'en') {
                                restoreOriginalContent();
                                currentLanguage = 'en';
                                updateUI('en');
                            }
                        });
                } else {
                    // All translations were cached
                    currentLanguage = languageCode;
                    updateUI(languageCode);
                    hideLoadingIndicator(loadingIndicator);
                }
            } else {
                // No text to translate
                currentLanguage = languageCode;
                updateUI(languageCode);
                hideLoadingIndicator(loadingIndicator);
            }
        } catch (error) {
            console.error('Error in changeLanguage:', error);
            hideLoadingIndicator(loadingIndicator);
            alert('An error occurred during translation. Please try again.');
        }
    }
    
    // OPTIMIZATION: New function to translate texts in a single batch request
    async function translateBatchedTexts(texts, sourceLang, targetLang) {
        try {
            // Make a single API call with all texts
            const response = await fetch('/.netlify/functions/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    texts: texts,
                    source: sourceLang,
                    target: targetLang
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Translation API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
            }
            
            const data = await response.json();
            return data.translatedTexts || [];
        } catch (error) {
            console.error('Batch translation error:', error);
            throw error;
        }
    }
    
    // Apply translation to an element
    function applyTranslation(item, translation) {
        try {
            if (!item || !item.element) return;
            
            if (item.type === 'placeholder') {
                // Update placeholder
                item.element.setAttribute('placeholder', translation);
            } else if (item.type === 'link') {
                // Special handling for links - preserve href
                item.element.textContent = translation;
                // Ensure the href value is maintained
                if (item.href) {
                    item.element.setAttribute('href', item.href);
                }
            } else {
                // Update text content for regular elements
                item.element.textContent = translation;
            }
        } catch (err) {
            console.error('Error applying translation:', err);
        }
    }
    
    // Get all elements that should be translated
    function getTranslatableElements() {
        const elements = [];
        
        // Define selectors for text elements
        const textSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
            'p', 'button', 'label', 'span:not(.globe-icon):not(.current-lang)', 
            'li', 'th', 'td', 'input[type="submit"]', 'input[type="button"]',
            '.subtitle', '.disclaimer'
        ];
        
        // Process text elements
        textSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    if (
                        !el.closest('.lang-dropdown') && 
                        !el.closest('.language-selector') && 
                        !el.classList.contains('no-translate') && 
                        !el.hasAttribute('data-no-translate')
                    ) {
                        elements.push(el);
                    }
                });
            } catch (e) {
                console.error(`Error with selector ${selector}:`, e);
            }
        });
        
        // Get all links separately to handle them specially
        try {
            document.querySelectorAll('a').forEach(link => {
                if (
                    !link.closest('.lang-dropdown') && 
                    !link.closest('.language-selector') && 
                    !link.classList.contains('no-translate') && 
                    !link.hasAttribute('data-no-translate')
                ) {
                    elements.push(link);
                }
            });
        } catch (e) {
            console.error('Error getting links:', e);
        }
        
        return elements;
    }
    
    // Store original content for reverting to English
    function storeOriginalContent(elements) {
        // Clear any previous original content
        originalContent.clear();
        
        elements.forEach(el => {
            try {
                // Skip null or undefined elements
                if (!el) return;
                
                // Check if it's a link
                if (el.tagName && el.tagName.toLowerCase() === 'a') {
                    // Store original text and href for links
                    if (el.textContent) {
                        originalContent.set(el, {
                            text: el.textContent.trim(),
                            type: 'link',
                            href: el.getAttribute('href') || ''
                        });
                    }
                }
                // Normal elements with text content
                else if (el.textContent && el.textContent.trim()) {
                    originalContent.set(el, el.textContent);
                }
            } catch (err) {
                console.error('Error storing original content:', err);
            }
        });
        
        // Store placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            try {
                const placeholder = el.getAttribute('placeholder');
                if (placeholder) {
                    originalContent.set(`placeholder-${el.id || Math.random().toString(36).substring(2)}`, {
                        element: el,
                        type: 'placeholder',
                        text: placeholder
                    });
                }
            } catch (err) {
                console.error('Error storing placeholder:', err);
            }
        });
    }
    
    // Restore original content (English)
    function restoreOriginalContent() {
        originalContent.forEach((content, key) => {
            try {
                if (typeof content === 'string') {
                    // Simple text content
                    if (key && key.textContent !== undefined) {
                        key.textContent = content;
                    }
                } else if (content && content.type) {
                    // Complex content with type
                    if (content.type === 'placeholder' && content.element) {
                        content.element.setAttribute('placeholder', content.text);
                    } else if (content.type === 'link' && key) {
                        key.textContent = content.text;
                        if (content.href) {
                            key.setAttribute('href', content.href);
                        }
                    }
                }
            } catch (err) {
                console.error('Error restoring original content:', err);
            }
        });
    }
    
    // Update UI to reflect current language
    function updateUI(languageCode) {
        // Update current language display
        if (currentLangDisplay) {
            currentLangDisplay.textContent = languageCode.toUpperCase();
        }
        
        // Update active class in dropdown
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === languageCode) {
                option.classList.add('active');
            }
        });
        
        // Save preference
        localStorage.setItem('preferredLanguage', languageCode);
        
        // Close dropdown
        langDropdown.classList.add('hidden');
        
        // Handle RTL languages
        if (['ar', 'he', 'fa', 'ur'].includes(languageCode)) {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
        
        // Update document language attribute
        document.documentElement.lang = languageCode;
    }
    
    // Show loading indicator
    function showLoadingIndicator() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'translation-loading';
        
        loadingEl.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">Translating...</div>
            </div>
        `;
        document.body.appendChild(loadingEl);
        return loadingEl;
    }
    
    // Hide loading indicator
    function hideLoadingIndicator(element) {
        if (element && element.parentNode) {
            element.classList.add('fade-out');
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }
    }
    
    function restoreLanguagePreference() {
    // First check localStorage for a saved preference
    const savedLang = localStorage.getItem('preferredLanguage');
    
    if (savedLang && LANGUAGES[savedLang]) {
        // If a saved preference exists and is supported, use it
        changeLanguage(savedLang, false); // Don't force translation if it's first load
        return true;
    } else {
        // If no saved preference, try to detect browser language
        const detectedLang = detectBrowserLanguage();
        if (detectedLang && detectedLang !== 'en') {
            // If we detected a non-English language that we support, use it
            changeLanguage(detectedLang, false);
            return true;
        }
    }
    
    // Default to English if no preference or detection
    return false;
}

// Add this new function to detect the browser language
function detectBrowserLanguage() {
    try {
        // Get browser language(s)
        const browserLangs = navigator.languages || 
                           [navigator.language || 
                            navigator.userLanguage];
        
        // Try to find a matching language
        for (const browserLang of browserLangs) {
            // Normalize the language code (e.g., 'en-US' -> 'en')
            const simpleLang = browserLang.split('-')[0].toLowerCase();
            
            // Check if we support this language directly
            if (LANGUAGES[browserLang]) {
                return browserLang; // Exact match including region
            }
            
            // Check for base language match
            if (LANGUAGES[simpleLang]) {
                return simpleLang; // Base language match
            }
            
            // Handle special cases
            if (simpleLang === 'zh') {
                // For Chinese, check the region to determine simplified vs traditional
                const region = browserLang.split('-')[1];
                if (region && (region.toUpperCase() === 'CN' || region.toUpperCase() === 'SG')) {
                    return 'zh-CN'; // Simplified Chinese
                } else if (region && (region.toUpperCase() === 'TW' || region.toUpperCase() === 'HK')) {
                    return 'zh-TW'; // Traditional Chinese
                } else {
                    return 'zh-CN'; // Default to Simplified Chinese
                }
            }
        }
        
        // No matching language found
        return null;
    } catch (error) {
        console.error('Error detecting browser language:', error);
        return null;
    }
}

// Optional: Add a function to show a language notification
/* Call this after restoreLanguagePreference() if it returns true
function showLanguageNotification(langCode) {
    if (!langCode || langCode === 'en') return;
    
    const langData = LANGUAGES[langCode];
    if (!langData) return;
    
    const notification = document.createElement('div');
    notification.className = 'language-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <p>${langData.flag} We've set the language to ${langData.name} based on your preferences.</p>
            <div class="notification-actions">
                <button class="keep-language">Keep</button>
                <button class="switch-to-english">Switch to English</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listeners
    notification.querySelector('.keep-language').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
    
    notification.querySelector('.switch-to-english').addEventListener('click', function() {
        changeLanguage('en');
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 8000);
}
*/

    // Expose translation functions to global scope for other scripts
    window.translationManager = {
        translateTo: changeLanguage,
        getCurrentLanguage: () => currentLanguage,
        getSupportedLanguages: () => LANGUAGES
    };
});