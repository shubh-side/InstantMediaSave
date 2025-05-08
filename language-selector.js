document.addEventListener('DOMContentLoaded', function() {
    // Language selector functionality
    const langButton = document.getElementById('langButton');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangDisplay = document.querySelector('.current-lang');
    
    // Get browser language or default to English
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0].toLowerCase();
    
    // Set initial language based on browser language if supported
    setInitialLanguage(shortLang);
    
    // Toggle dropdown when clicking the language button
    langButton.addEventListener('click', function() {
        langDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!langButton.contains(event.target) && !langDropdown.contains(event.target)) {
            langDropdown.classList.add('hidden');
        }
    });
    
    // Handle language selection
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const langCode = this.getAttribute('data-lang');
            const langName = this.textContent;
            setLanguage(langCode, langName);
            langDropdown.classList.add('hidden');
        });
    });
    
    // Function to set initial language
    function setInitialLanguage(browserLangCode) {
        // Check if browser language is in our supported languages
        let isSupported = false;
        let langName = 'English';
        
        langOptions.forEach(option => {
            if (option.getAttribute('data-lang') === browserLangCode) {
                isSupported = true;
                langName = option.textContent;
            }
        });
        
        // If supported, set to browser language, otherwise default to English
        const langCode = isSupported ? browserLangCode : 'en';
        
        // Only update display, don't change page language if it's already English
        if (langCode === 'en') {
            currentLangDisplay.textContent = 'EN';
        } else {
            setLanguage(langCode, langName);
        }
    }
    
    // Function to change language
    function setLanguage(langCode, langName) {
        // Set the current language display
        currentLangDisplay.textContent = langCode.toUpperCase();
        
        // Store language preference
        localStorage.setItem('preferredLanguage', langCode);
        localStorage.setItem('preferredLanguageName', langName);
        
        // Skip translation if English is selected
        if (langCode === 'en') {
            // If there's a translation already active, reload the page to get back to English
            if (document.documentElement.lang !== 'en') {
                window.location.reload();
            }
            return;
        }
        
        // Use simpler approach with direct URL modification for Google Translate
        const langPair = `en|${langCode}`;
        const currentUrl = window.location.href;
        const translateUrl = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(currentUrl)}`;
        
        // Show a loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'translation-loading';
        loadingMessage.innerHTML = `<div class="loading"></div> Translating to ${langName}...`;
        document.body.appendChild(loadingMessage);
        
        // Redirect to the translated version
        setTimeout(() => {
            window.location.href = translateUrl;
        }, 500);
    }
    
    // Check for stored language preference
    const storedLang = localStorage.getItem('preferredLanguage');
    const storedLangName = localStorage.getItem('preferredLanguageName');
    if (storedLang && storedLang !== 'en' && storedLangName) {
        // Don't auto-translate on page load to avoid errors
        // Just update the display
        currentLangDisplay.textContent = storedLang.toUpperCase();
    }
});