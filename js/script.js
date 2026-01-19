// Modern Wisdom Without Borders

// State
let currentQuote = null;

// Init
document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initLanguageSelector();
    initTranslation();
    initExplanation();
    initReactions();
    loadQuote();
    loadGallery();
});

// ===== MENU =====
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidePanel = document.getElementById('sidePanel');
    const closePanel = document.getElementById('closePanel');
    const panelItems = document.querySelectorAll('.panel-item');

    menuToggle?.addEventListener('click', () => {
        sidePanel.classList.add('active');
    });

    closePanel?.addEventListener('click', () => {
        sidePanel.classList.remove('active');
    });

    panelItems.forEach(item => {
        item.addEventListener('click', () => {
            panelItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            sidePanel.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.side-panel') && !e.target.closest('.menu-toggle')) {
            sidePanel.classList.remove('active');
        }
    });
}

// ===== LANGUAGE SELECTOR =====
function initLanguageSelector() {
    const flags = document.querySelectorAll('.lang-flag');

    flags.forEach(flag => {
        flag.addEventListener('click', () => {
            flags.forEach(f => f.classList.remove('active'));
            flag.classList.add('active');

            const langCode = flag.getAttribute('data-lang');
            selectedQuoteLanguage = langCode;

            loadQuote();
            loadGallery();
        });
    });
}

// ===== LOAD QUOTE =====
function loadQuote() {
    currentQuote = getQuoteOfTheDay();

    if (!currentQuote) return;

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const quoteLang = document.getElementById('quoteLang');
    const quoteTranslation = document.getElementById('quoteTranslation');
    const explanationContent = document.getElementById('explanationContent');

    if (quoteText) quoteText.textContent = `"${currentQuote.text}"`;
    if (quoteAuthor) quoteAuthor.textContent = `— ${currentQuote.author}`;
    if (quoteLang) quoteLang.textContent = `${currentQuote.flag} ${currentQuote.language}`;
    if (quoteTranslation) quoteTranslation.textContent = `"${currentQuote.translation}"`;
    if (explanationContent) explanationContent.textContent = currentQuote.explanation;

    // Reset translation and explanation
    if (quoteTranslation) quoteTranslation.style.display = 'none';
    if (explanationContent) explanationContent.style.display = 'none';

    const translateBtn = document.getElementById('translateBtn');
    if (translateBtn) {
        translateBtn.innerHTML = '<i class="fas fa-language"></i> Show translation';
    }

    const explanationBtn = document.getElementById('explanationBtn');
    if (explanationBtn) explanationBtn.classList.remove('active');

    updateReactionCounts();
}

// ===== TRANSLATION =====
function initTranslation() {
    const translateBtn = document.getElementById('translateBtn');
    const quoteTranslation = document.getElementById('quoteTranslation');

    translateBtn?.addEventListener('click', () => {
        if (quoteTranslation.style.display === 'none') {
            quoteTranslation.style.display = 'block';
            translateBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide translation';
        } else {
            quoteTranslation.style.display = 'none';
            translateBtn.innerHTML = '<i class="fas fa-language"></i> Show translation';
        }
    });
}

// ===== EXPLANATION =====
function initExplanation() {
    const explanationBtn = document.getElementById('explanationBtn');
    const explanationContent = document.getElementById('explanationContent');

    explanationBtn?.addEventListener('click', () => {
        if (explanationContent.style.display === 'none') {
            explanationContent.style.display = 'block';
            explanationBtn.classList.add('active');
        } else {
            explanationContent.style.display = 'none';
            explanationBtn.classList.remove('active');
        }
    });
}

// ===== REACTIONS =====
function initReactions() {
    const reactions = document.querySelectorAll('.reaction');

    reactions.forEach(reaction => {
        reaction.addEventListener('click', () => {
            handleReaction(reaction);
        });
    });
}

function handleReaction(button) {
    if (!currentQuote || !currentQuote.id) return;

    const reactionType = button.getAttribute('data-reaction');
    const quoteId = currentQuote.id;

    // Get user reactions
    const userReactions = getUserReactions();
    const previousReaction = userReactions[quoteId];

    // Remove active from all
    document.querySelectorAll('.reaction').forEach(r => r.classList.remove('active'));

    // If same reaction, remove it
    if (previousReaction === reactionType) {
        delete userReactions[quoteId];
        saveUserReactions(userReactions);
        decrementReaction(quoteId, reactionType);
        hideUserReaction();
        updateReactionCounts();
        return;
    }

    // If different reaction, update
    if (previousReaction) {
        decrementReaction(quoteId, previousReaction);
    }

    userReactions[quoteId] = reactionType;
    saveUserReactions(userReactions);
    incrementReaction(quoteId, reactionType);

    button.classList.add('active');
    showUserReaction(reactionType);
    updateReactionCounts();
}

function getUserReactions() {
    const stored = localStorage.getItem('quoteReactions');
    return stored ? JSON.parse(stored) : {};
}

function saveUserReactions(reactions) {
    localStorage.setItem('quoteReactions', JSON.stringify(reactions));
}

function getAllReactions() {
    const stored = localStorage.getItem('allReactions');
    return stored ? JSON.parse(stored) : {};
}

function saveAllReactions(reactions) {
    localStorage.setItem('allReactions', JSON.stringify(reactions));
}

function incrementReaction(quoteId, reactionType) {
    const allReactions = getAllReactions();
    if (!allReactions[quoteId]) {
        allReactions[quoteId] = { enlightened: 0, moved: 0, empowered: 0, saved: 0, facts: 0 };
    }
    allReactions[quoteId][reactionType]++;
    saveAllReactions(allReactions);
}

function decrementReaction(quoteId, reactionType) {
    const allReactions = getAllReactions();
    if (allReactions[quoteId] && allReactions[quoteId][reactionType] > 0) {
        allReactions[quoteId][reactionType]--;
        saveAllReactions(allReactions);
    }
}

function updateReactionCounts() {
    if (!currentQuote || !currentQuote.id) return;

    const allReactions = getAllReactions();
    const quoteReactions = allReactions[currentQuote.id] || { enlightened: 0, moved: 0, empowered: 0, saved: 0, facts: 0 };

    Object.keys(quoteReactions).forEach(type => {
        const countElement = document.getElementById(`count-${type}`);
        if (countElement) {
            countElement.textContent = quoteReactions[type];
        }
    });

    // Highlight user's reaction
    const userReactions = getUserReactions();
    const userReaction = userReactions[currentQuote.id];

    if (userReaction) {
        const activeBtn = document.querySelector(`.reaction[data-reaction="${userReaction}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        showUserReaction(userReaction);
    }
}

function showUserReaction(reactionType) {
    const userReaction = document.getElementById('userReaction');
    if (userReaction) {
        const names = {
            enlightened: 'Enlightened',
            moved: 'Moved',
            empowered: 'Empowered',
            saved: 'Saved',
            facts: 'Facts'
        };
        userReaction.textContent = `You reacted: ${names[reactionType]}`;
        userReaction.style.display = 'block';
    }
}

function hideUserReaction() {
    const userReaction = document.getElementById('userReaction');
    if (userReaction) {
        userReaction.style.display = 'none';
    }
}

// ===== GALLERY =====
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    const quotes = getQuotesByLanguage(selectedQuoteLanguage);
    const shuffled = [...quotes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    galleryGrid.innerHTML = '';

    selected.forEach(quote => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <div class="gallery-quote">"${quote.text}"</div>
            <div class="gallery-author">— ${quote.author}</div>
            <div class="gallery-tags">
                <span class="gallery-tag">${quote.flag} ${quote.language}</span>
            </div>
        `;

        item.addEventListener('click', () => {
            currentQuote = quote;
            loadQuote();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        galleryGrid.appendChild(item);
    });
}
