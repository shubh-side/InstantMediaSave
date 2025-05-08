document.addEventListener('DOMContentLoaded', function() {
    // Language selector functionality
    const langButton = document.getElementById('langButton');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangDisplay = document.querySelector('.current-lang');
    
    // Default language
    let currentLang = 'en';
    
    // All translatable elements with their identifiers
    const translatableElements = {
        'header-title': document.querySelector('h1'),
        'header-subtitle': document.querySelector('.subtitle'),
        'input-placeholder': document.getElementById('reelUrl'),
        'download-button': document.getElementById('downloadBtn'),
        'download-all-text': document.querySelector('#downloadAllContainer p'),
        'download-all-button': document.getElementById('downloadAllBtn'),
        'download-link': document.getElementById('downloadLink'),
        'info-title': document.querySelector('.info-section h2'),
        'info-description': document.querySelector('.info-section > p'),
        'supported-title': document.querySelector('.info-section h3'),
        'faq-title': document.querySelectorAll('.info-section h3')[1],
        'disclaimer': document.querySelector('.disclaimer'),
        'related-tools-title': document.querySelector('.related-tools h3'),
        'footer-about': document.querySelector('.footer-links a[href="/about"]'),
        'footer-privacy': document.querySelector('.footer-links a[href="/privacy"]'),
        'footer-copyright': document.querySelector('.copyright'),
        'footer-tagline': document.querySelector('.made-with-love')
    };
    
    // Get browser language or default to English
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0].toLowerCase();
    
    // Set initial language based on browser language if supported or stored preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
        loadLanguage(storedLang);
    } else if (shortLang !== 'en') {
        // Check if browser language is supported before loading
        checkLanguageSupport(shortLang).then(isSupported => {
            if (isSupported) {
                loadLanguage(shortLang);
            }
        });
    }
    
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
            loadLanguage(langCode);
            langDropdown.classList.add('hidden');
        });
    });
    
    // Function to check if a language file exists
    async function checkLanguageSupport(langCode) {
        try {
            const response = await fetch(`/translations/${langCode}.json`);
            return response.ok;
        } catch (error) {
            console.error("Error checking language support:", error);
            return false;
        }
    }
    
    // Function to load language translations
    async function loadLanguage(langCode) {
        try {
            // Skip loading if it's English (default) or already current language
            if (langCode === 'en' && currentLang === 'en') {
                return;
            }
            
            // If switching to English from another language
            if (langCode === 'en' && currentLang !== 'en') {
                window.location.reload();
                return;
            }
            
            const response = await fetch(`/translations/${langCode}.json`);
            
            if (!response.ok) {
                throw new Error(`Language file for ${langCode} not found`);
            }
            
            const translations = await response.json();
            
            // Apply translations to elements
            for (const [key, element] of Object.entries(translatableElements)) {
                if (element && translations[key]) {
                    if (key === 'input-placeholder') {
                        element.placeholder = translations[key];
                    } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                        element.textContent = translations[key];
                    } else {
                        element.innerHTML = translations[key];
                    }
                }
            }
            
            // Apply translations to list items
            if (translations['supported-items']) {
                const supportedList = document.querySelector('.info-section ul');
                if (supportedList) {
                    const listItems = supportedList.querySelectorAll('li');
                    translations['supported-items'].forEach((text, index) => {
                        if (listItems[index]) {
                            listItems[index].innerHTML = text;
                        }
                    });
                }
            }
            
            // Apply translations to FAQ questions and answers
            if (translations['faq-questions'] && translations['faq-answers']) {
                const faqSection = document.querySelector('.faq-section');
                if (faqSection) {
                    const questions = faqSection.querySelectorAll('h4');
                    const answers = faqSection.querySelectorAll('p');
                    
                    translations['faq-questions'].forEach((text, index) => {
                        if (questions[index]) {
                            questions[index].textContent = text;
                        }
                    });
                    
                    translations['faq-answers'].forEach((text, index) => {
                        if (answers[index]) {
                            answers[index].innerHTML = text;
                        }
                    });
                }
            }
            
            // Apply translations to related tools links
            if (translations['related-tools-links']) {
                const toolsList = document.querySelector('.related-tools ul');
                if (toolsList) {
                    const toolLinks = toolsList.querySelectorAll('a');
                    translations['related-tools-links'].forEach((text, index) => {
                        if (toolLinks[index]) {
                            toolLinks[index].textContent = text;
                        }
                    });
                }
            }
            
            // Update document language
            document.documentElement.lang = langCode;
            
            // Update language display
            currentLangDisplay.textContent = langCode.toUpperCase();
            
            // Store the current language
            currentLang = langCode;
            localStorage.setItem('preferredLanguage', langCode);
            
        } catch (error) {
            console.error("Error loading language:", error);
            // If error, fallback to English
            if (langCode !== 'en') {
                alert(`Translation for ${langCode} is not available yet. Fallback to English.`);
                currentLangDisplay.textContent = 'EN';
                localStorage.setItem('preferredLanguage', 'en');
            }
        }
    }
});