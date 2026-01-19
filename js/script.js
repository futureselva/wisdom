// Main JavaScript for Wisdom Without Borders

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSelector();
    initializeFlagSelector();
    loadHeroQuote();
    loadQuoteOfTheDay();
    initializeGallery();
    initializeForms();
    initializeScrollAnimation();
    initializeTranslationButtons();
    initializeExplanation();
    initializeReactions();
    translatePage();
});

// ===== LANGUAGE SELECTOR =====
function initializeLanguageSelector() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    if (!langBtn || !langDropdown) return;

    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });

    // Handle language selection
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = option.getAttribute('data-lang');
            setCurrentLanguage(selectedLang);
            translatePage(selectedLang);
            langDropdown.classList.remove('active');

            // Reload quote of the day with new language context
            loadQuoteOfTheDay();
        });
    });
}

// ===== FLAG SELECTOR FOR QUOTE LANGUAGE =====
function initializeFlagSelector() {
    const flagButtons = document.querySelectorAll('.flag-btn');

    flagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            flagButtons.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Update selected language
            const langCode = btn.getAttribute('data-lang-code');
            selectedQuoteLanguage = langCode;

            // Reload all quotes with new language
            loadHeroQuote();
            loadQuoteOfTheDay();
            initializeGallery();
        });
    });
}

// ===== HERO QUOTE =====
let currentHeroQuote = null;

function loadHeroQuote() {
    currentHeroQuote = getRandomQuote();
    const heroQuoteText = document.getElementById('heroQuoteText');
    const heroQuoteAuthor = document.getElementById('heroQuoteAuthor');
    const heroQuoteTranslation = document.getElementById('heroQuoteTranslation');

    if (heroQuoteText && heroQuoteAuthor && heroQuoteTranslation) {
        heroQuoteText.textContent = `"${currentHeroQuote.text}"`;
        heroQuoteAuthor.textContent = `— ${currentHeroQuote.author} ${currentHeroQuote.flag}`;
        heroQuoteTranslation.textContent = `"${currentHeroQuote.translation}"`;
        heroQuoteTranslation.style.display = 'none';
    }
}

// ===== QUOTE OF THE DAY =====
let currentQuoteOfDay = null;

function loadQuoteOfTheDay() {
    currentQuoteOfDay = getQuoteOfTheDay();
    displayQuote(currentQuoteOfDay);
}

function displayQuote(quote) {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const quoteLanguage = document.getElementById('quoteLanguage');
    const quoteCountry = document.getElementById('quoteCountry');
    const quoteTranslation = document.getElementById('quoteTranslation');

    if (!quoteText || !quoteAuthor || !quoteLanguage || !quoteCountry) return;

    // Store current quote
    currentQuoteOfDay = quote;

    // Add fade-out animation
    const quoteCard = document.getElementById('quoteCard');
    quoteCard.style.opacity = '0.5';

    // Hide translation when changing quotes
    if (quoteTranslation) {
        quoteTranslation.style.display = 'none';
    }

    setTimeout(() => {
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `— ${quote.author}`;
        quoteLanguage.innerHTML = `<i class="fas fa-language"></i> ${quote.language}`;
        quoteCountry.textContent = `${quote.flag} ${quote.country}`;

        // Update translation text
        if (quoteTranslation) {
            quoteTranslation.textContent = `"${quote.translation}"`;
        }

        // Update explanation
        const quoteExplanation = document.getElementById('quoteExplanation');
        if (quoteExplanation && quote.explanation) {
            quoteExplanation.textContent = quote.explanation;
        }

        // Hide explanation by default when quote changes
        const explanationToggle = document.getElementById('explanationToggle');
        if (explanationToggle) {
            explanationToggle.classList.remove('active');
        }
        if (quoteExplanation) {
            quoteExplanation.style.display = 'none';
        }

        // Update reactions
        updateReactionCounts();

        // Fade back in
        quoteCard.style.opacity = '1';
    }, 300);
}

// Refresh quote button
const refreshBtn = document.getElementById('refreshQuote');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        const randomQuote = getRandomQuote();
        displayQuote(randomQuote);

        // Rotate button animation
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// ===== TRANSLATION BUTTONS =====
function initializeTranslationButtons() {
    // Hero quote translation button
    const heroTranslateBtn = document.getElementById('heroTranslateBtn');
    const heroTranslation = document.getElementById('heroQuoteTranslation');

    if (heroTranslateBtn && heroTranslation) {
        heroTranslateBtn.addEventListener('click', () => {
            if (heroTranslation.style.display === 'none') {
                heroTranslation.style.display = 'block';
                heroTranslateBtn.innerHTML = '<i class="fas fa-eye-slash"></i> <span data-translate="hide-translation">Hide Translation</span>';
            } else {
                heroTranslation.style.display = 'none';
                heroTranslateBtn.innerHTML = '<i class="fas fa-language"></i> <span data-translate="see-translation">See English Translation</span>';
            }
        });
    }

    // Quote of the day translation button
    const quoteTranslateBtn = document.getElementById('quoteTranslateBtn');
    const quoteTranslation = document.getElementById('quoteTranslation');

    if (quoteTranslateBtn && quoteTranslation) {
        quoteTranslateBtn.addEventListener('click', () => {
            if (quoteTranslation.style.display === 'none') {
                quoteTranslation.style.display = 'block';
                quoteTranslateBtn.innerHTML = '<i class="fas fa-eye-slash"></i> <span data-translate="hide-translation">Hide Translation</span>';
            } else {
                quoteTranslation.style.display = 'none';
                quoteTranslateBtn.innerHTML = '<i class="fas fa-language"></i> <span data-translate="see-translation">See English Translation</span>';
            }
        });
    }
}

// ===== EXPLANATION TOGGLE =====
function initializeExplanation() {
    const explanationToggle = document.getElementById('explanationToggle');
    const quoteExplanation = document.getElementById('quoteExplanation');

    if (explanationToggle && quoteExplanation) {
        explanationToggle.addEventListener('click', () => {
            if (quoteExplanation.style.display === 'none') {
                quoteExplanation.style.display = 'block';
                explanationToggle.classList.add('active');
            } else {
                quoteExplanation.style.display = 'none';
                explanationToggle.classList.remove('active');
            }
        });
    }
}

// ===== REACTIONS SYSTEM =====
function initializeReactions() {
    const reactionButtons = document.querySelectorAll('.reaction-btn');

    reactionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleReaction(btn);
        });
    });

    // Load reactions for current quote
    updateReactionCounts();
}

function handleReaction(button) {
    if (!currentQuoteOfDay || !currentQuoteOfDay.id) return;

    const reaction = button.getAttribute('data-reaction');
    const quoteId = currentQuoteOfDay.id;

    // Check if user already reacted
    const userReactions = getUserReactions();
    const previousReaction = userReactions[quoteId];

    // Remove previous reaction visual
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // If clicking same reaction, remove it
    if (previousReaction === reaction) {
        delete userReactions[quoteId];
        saveUserReactions(userReactions);
        decrementReaction(quoteId, reaction);
        hideUserReactionStatus();
        return;
    }

    // If had different reaction, decrement old one
    if (previousReaction) {
        decrementReaction(quoteId, previousReaction);
    }

    // Add new reaction
    userReactions[quoteId] = reaction;
    saveUserReactions(userReactions);
    incrementReaction(quoteId, reaction);

    // Visual feedback
    button.classList.add('active');
    showUserReactionStatus(reaction);

    // Update counts
    updateReactionCounts();
}

function getUserReactions() {
    const stored = localStorage.getItem('quoteReactions');
    return stored ? JSON.parse(stored) : {};
}

function saveUserReactions(reactions) {
    localStorage.setItem('quoteReactions', JSON.stringify(reactions));
}

function incrementReaction(quoteId, reaction) {
    const reactions = getAllReactionsData();
    if (!reactions[quoteId]) {
        reactions[quoteId] = { enlightened: 0, moved: 0, empowered: 0, saved: 0, facts: 0 };
    }
    reactions[quoteId][reaction]++;
    saveAllReactionsData(reactions);
}

function decrementReaction(quoteId, reaction) {
    const reactions = getAllReactionsData();
    if (reactions[quoteId] && reactions[quoteId][reaction] > 0) {
        reactions[quoteId][reaction]--;
        saveAllReactionsData(reactions);
    }
}

function getAllReactionsData() {
    const stored = localStorage.getItem('allReactions');
    return stored ? JSON.parse(stored) : {};
}

function saveAllReactionsData(reactions) {
    localStorage.setItem('allReactions', JSON.stringify(reactions));
}

function updateReactionCounts() {
    if (!currentQuoteOfDay || !currentQuoteOfDay.id) return;

    const quoteId = currentQuoteOfDay.id;
    const allReactions = getAllReactionsData();
    const quoteReactions = allReactions[quoteId] || { enlightened: 0, moved: 0, empowered: 0, saved: 0, facts: 0 };
    const userReactions = getUserReactions();
    const userReaction = userReactions[quoteId];

    // Update counts
    Object.keys(quoteReactions).forEach(reaction => {
        const countEl = document.getElementById(`count-${reaction}`);
        if (countEl) {
            countEl.textContent = quoteReactions[reaction];
        }
    });

    // Highlight user's reaction
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (userReaction) {
        const activeBtn = document.querySelector(`[data-reaction="${userReaction}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        showUserReactionStatus(userReaction);
    } else {
        hideUserReactionStatus();
    }
}

function showUserReactionStatus(reaction) {
    const status = document.getElementById('userReactionStatus');
    const emoji = document.getElementById('userReactionEmoji');

    const emojiMap = {
        enlightened: '💡',
        moved: '❤️',
        empowered: '💪',
        saved: '🙏',
        facts: '🔥'
    };

    if (status && emoji) {
        emoji.textContent = emojiMap[reaction];
        status.style.display = 'block';
    }
}

function hideUserReactionStatus() {
    const status = document.getElementById('userReactionStatus');
    if (status) {
        status.style.display = 'none';
    }
}

// ===== QUOTE GALLERY =====
function initializeGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    // Get 6 random quotes for the gallery
    const galleryQuotes = [];
    const usedIndices = new Set();

    while (galleryQuotes.length < Math.min(6, quotesDatabase.length)) {
        const randomIndex = Math.floor(Math.random() * quotesDatabase.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            galleryQuotes.push(quotesDatabase[randomIndex]);
        }
    }

    // Display gallery items
    galleryGrid.innerHTML = '';
    galleryQuotes.forEach(quote => {
        const galleryItem = createGalleryItem(quote);
        galleryGrid.appendChild(galleryItem);
    });
}

function createGalleryItem(quote) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
        <div class="gallery-quote">"${quote.text}"</div>
        <div class="gallery-author">— ${quote.author}</div>
        <div class="gallery-info">
            <span class="gallery-tag">${quote.flag} ${quote.language}</span>
            <span class="gallery-tag">${quote.country}</span>
        </div>
    `;

    // Add click event to display in main quote section
    div.addEventListener('click', () => {
        displayQuote(quote);
        // Smooth scroll to quote section
        document.querySelector('.quote-of-day').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });

    return div;
}

// ===== FORMS =====
function initializeForms() {
    initializeNewsletterForm();
    initializeContactForm();
}

// Newsletter Form
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('emailInput');
        const languageSelect = document.getElementById('languageSelect');
        const messageDiv = document.getElementById('formMessage');

        const email = emailInput.value;
        const language = languageSelect.value;

        // Basic validation
        if (!isValidEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Success
            showMessage(messageDiv, `🎉 Success! You'll receive daily quotes in ${getLanguageName(language)}.`, 'success');
            emailInput.value = '';

            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Track with analytics (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    'event_category': 'engagement',
                    'event_label': language
                });
            }
        }, 1500);

        // TODO: Replace with actual API call
        // fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, language })
        // })
    });
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('nameInput');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('messageInput');
        const messageDiv = document.getElementById('contactMessage');

        const name = nameInput.value;
        const email = emailInput.value;
        const message = messageInput.value;

        // Validation
        if (!name || !email || !message) {
            showMessage(messageDiv, 'Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Success
            showMessage(messageDiv, "✅ Thank you! We'll get back to you soon.", 'success');
            nameInput.value = '';
            emailInput.value = '';
            messageInput.value = '';

            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Track with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit', {
                    'event_category': 'engagement'
                });
            }
        }, 1500);

        // TODO: Replace with actual API call
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, message })
        // })
    });
}

// ===== HELPER FUNCTIONS =====
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function getLanguageName(code) {
    const names = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ja': 'Japanese',
        'zh': 'Chinese'
    };
    return names[code] || 'English';
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimation() {
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.quote-of-day').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ANALYTICS =====
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }
}

// Track initial page view
trackPageView();

// ===== PERFORMANCE =====
// Lazy load images if we add them later
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== CONSOLE MESSAGE =====
console.log('%c📜 Wisdom Without Borders', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cSpread wisdom across all nations! 🌍', 'font-size: 14px; color: #666;');
console.log('%cInterested in contributing? Contact us!', 'font-size: 12px; color: #999;');