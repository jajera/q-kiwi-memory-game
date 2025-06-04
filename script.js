/**
 * Kiwi Memory Game
 * A New Zealand themed memory matching game
 */

// Game state variables
let attempts = 0;
let matches = 0;
let flippedCards = [];
let lockBoard = false;
let soundEnabled = false; // Default to sound off
let currentLanguage = 'en';

// NZ themed card items with distinct emojis
const cardItems = [
    { name: 'kiwi', emoji: '🥝', description: 'Kiwi' },
    { name: 'fern', emoji: '🌿', description: 'Silver Fern' },
    { name: 'pukeko', emoji: '🐤', description: 'Pūkeko' },
    { name: 'koru', emoji: '🌀', description: 'Koru' },
    { name: 'tui', emoji: '🐦', description: 'Tui Bird' },
    { name: 'pohutukawa', emoji: '🌺', description: 'Pohutukawa' },
    { name: 'flag', emoji: '🇳🇿', description: 'NZ Flag' },
    { name: 'carving', emoji: '🪆', description: 'Māori Pattern' }
];

// Language translations
const translations = {
    'en': {
        'title': 'Kiwi Memory Game',
        'theme': 'Theme:',
        'forest-green': 'Forest Green',
        'tui-blue': 'Tui Blue',
        'sunset-orange': 'Sunset Orange',
        'language': 'Language:',
        'english': 'English',
        'maori': 'Te Reo Māori',
        'attempts': 'Attempts',
        'matches': 'Matches',
        'restart': 'Restart Game',
        'win-heading': 'Ka pai! You matched them all!',
        'win-message': 'You found all matches in',
        'attempts-label': 'attempts',
        'play-again': 'Play Again',
        'footer': 'A New Zealand themed memory game',
        'card-flipped': 'Card flipped',
        'cards-match': 'Cards match!',
        'cards-no-match': 'Cards do not match',
        'game-won': 'Congratulations! You won the game!'
    },
    'mi': {
        'title': 'Kēmu Mahara Kiwi',
        'theme': 'Kaupapa:',
        'forest-green': 'Ngahere Kākāriki',
        'tui-blue': 'Tui Kikorangi',
        'sunset-orange': 'Tōrārangi Karaka',
        'language': 'Reo:',
        'english': 'Ingarihi',
        'maori': 'Te Reo Māori',
        'attempts': 'Ngana',
        'matches': 'Takitahi',
        'restart': 'Tīmata Anō',
        'win-heading': 'Ka pai! Kua kitea e koe katoa!',
        'win-message': 'Kua kitea e koe ngā takirua katoa i roto i',
        'attempts-label': 'ngana',
        'play-again': 'Tākaro Anō',
        'footer': 'He kēmu kaupapa Aotearoa',
        'card-flipped': 'Kua hurihia te kāri',
        'cards-match': 'Kua rite ngā kāri!',
        'cards-no-match': 'Kāore ngā kāri i te rite',
        'game-won': 'Kia ora! Kua toa koe!'
    }
};

// DOM elements - get references to HTML elements we'll need to manipulate
const gameBoard = document.querySelector('.game-board');
const attemptsCounter = document.getElementById('attempts');
const matchesCounter = document.getElementById('matches');
const restartButton = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');
const finalAttempts = document.getElementById('final-attempts');
const playAgainButton = document.getElementById('play-again-btn');
const themeSelector = document.getElementById('theme-selector');
const languageSelector = document.getElementById('language-selector');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const gameAnnouncements = document.getElementById('game-announcements');

// Sound elements
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

/**
 * Initialize the game
 * Sets up the game board with shuffled cards
 */
function initGame() {
    // Reset game state
    attempts = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;
    
    // Update UI counters
    attemptsCounter.textContent = attempts;
    matchesCounter.textContent = matches;
    
    // Hide win message if visible
    winMessage.classList.add('hidden');
    
    // Clear the game board
    gameBoard.innerHTML = '';
    
    // Create a deck with pairs of cards
    const deck = [...cardItems, ...cardItems];
    
    // Shuffle the deck
    shuffleDeck(deck);
    
    // Create cards and add to the game board
    deck.forEach((item, index) => {
        const card = createCard(item, index);
        gameBoard.appendChild(card);
    });
    
    // Announce game start for screen readers
    announceToScreenReader(translations[currentLanguage]['restart']);
}

/**
 * Shuffle the deck using Fisher-Yates algorithm
 * @param {Array} deck - Array of card items to shuffle
 * @returns {Array} - Shuffled deck
 */
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

/**
 * Create a card element
 * @param {Object} item - Card item with name and emoji
 * @param {Number} index - Index of the card
 * @returns {HTMLElement} - Card element
 */
function createCard(item, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = item.name;
    card.dataset.index = index;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Card ${index + 1}, ${item.description}, face down`);
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');
    cardFront.innerHTML = `<span title="${item.description}">${item.emoji}</span>`;
    
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    card.appendChild(cardInner);
    
    // Add event listeners for both click and keyboard
    card.addEventListener('click', flipCard);
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard.call(this);
        }
    });
    
    return card;
}

/**
 * Handle card flip
 * Flips the card and checks for matches
 */
function flipCard() {
    // Prevent flipping if:
    // 1. Board is locked (during animation or checking)
    // 2. This card is already flipped
    // 3. This is the same card as the first flipped card
    if (
        lockBoard || 
        this.classList.contains('flipped') || 
        (flippedCards.length === 1 && this.dataset.index === flippedCards[0].dataset.index)
    ) {
        return;
    }
    
    // Play flip sound
    playSound('flip');
    
    // Flip the card
    this.classList.add('flipped');
    
    // Update aria attributes
    const cardName = this.dataset.name;
    const cardIndex = parseInt(this.dataset.index) + 1;
    this.setAttribute('aria-label', `Card ${cardIndex}, ${cardName}, face up`);
    
    // Announce card flip for screen readers
    announceToScreenReader(`${translations[currentLanguage]['card-flipped']}: ${cardName}`);
    
    // Add to flipped cards array
    flippedCards.push(this);
    
    // Check if we have a pair
    if (flippedCards.length === 2) {
        // Increment attempts
        attempts++;
        attemptsCounter.textContent = attempts;
        
        // Check for match
        checkForMatch();
    }
}

/**
 * Check if the two flipped cards match
 * Updates game state based on match result
 */
function checkForMatch() {
    // Lock the board while checking
    lockBoard = true;
    
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.name === card2.dataset.name;
    
    if (isMatch) {
        // Cards match
        setTimeout(() => {
            // Play match sound
            playSound('match');
            
            // Mark cards as matched
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            // Update aria attributes
            card1.setAttribute('aria-label', `${card1.dataset.name} matched`);
            card2.setAttribute('aria-label', `${card2.dataset.name} matched`);
            
            // Announce match for screen readers
            announceToScreenReader(translations[currentLanguage]['cards-match']);
            
            // Disable matched cards
            disableCards();
            
            // Update match counter
            matches++;
            matchesCounter.textContent = matches;
            
            // Check if game is complete
            if (matches === cardItems.length) {
                setTimeout(() => {
                    playSound('win');
                    showWinMessage();
                }, 500);
            }
        }, 300);
    } else {
        // Cards don't match, flip them back
        setTimeout(() => {
            // Announce no match for screen readers
            announceToScreenReader(translations[currentLanguage]['cards-no-match']);
            
            unflipCards();
        }, 1000);
    }
}

/**
 * Disable matched cards
 * Removes event listeners from matched cards
 */
function disableCards() {
    flippedCards[0].removeEventListener('click', flipCard);
    flippedCards[1].removeEventListener('click', flipCard);
    resetBoard();
}

/**
 * Unflip non-matching cards
 * Flips cards back and resets the board
 */
function unflipCards() {
    flippedCards[0].classList.remove('flipped');
    flippedCards[1].classList.remove('flipped');
    
    // Reset aria attributes
    const card1Index = parseInt(flippedCards[0].dataset.index) + 1;
    const card2Index = parseInt(flippedCards[1].dataset.index) + 1;
    flippedCards[0].setAttribute('aria-label', `Card ${card1Index}, face down`);
    flippedCards[1].setAttribute('aria-label', `Card ${card2Index}, face down`);
    
    resetBoard();
}

/**
 * Reset the board for the next turn
 * Clears flipped cards array and unlocks the board
 */
function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

/**
 * Show win message with confetti celebration
 * Displays the win message with final attempt count and adds confetti
 */
function showWinMessage() {
    finalAttempts.textContent = attempts;
    winMessage.classList.remove('hidden');
    
    // Announce win for screen readers
    announceToScreenReader(translations[currentLanguage]['game-won']);
    
    // Create confetti celebration
    createConfetti();
}

/**
 * Create confetti celebration effect
 * Adds animated confetti particles to celebrate the win
 */
function createConfetti() {
    // Create 50 confetti particles
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.setAttribute('aria-hidden', 'true');
        
        // Random position
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // Add to body
        document.body.appendChild(confetti);
        
        // Remove after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

/**
 * Play sound effect if sound is enabled
 * @param {String} type - Type of sound to play (flip, match, win)
 */
function playSound(type) {
    // Only play sound if enabled
    if (!soundEnabled) return;
    
    // In a real implementation, these would be actual sound files
    // Currently using placeholder audio elements
    try {
        let soundElement = null;
        
        switch(type) {
            case 'flip':
                soundElement = flipSound;
                break;
            case 'match':
                soundElement = matchSound;
                break;
            case 'win':
                soundElement = winSound;
                break;
        }
        
        if (soundElement) {
            soundElement.currentTime = 0;
            const playPromise = soundElement.play();
            
            // Handle the play promise to avoid uncaught promise errors
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play error:', error);
                });
            }
        }
    } catch (error) {
        console.log('Sound playback error:', error);
    }
}

/**
 * Toggle sound on/off
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Sound on. Click to mute' : 'Sound off. Click to unmute');
    soundToggle.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
    localStorage.setItem('kiwi-memory-sound', soundEnabled ? 'on' : 'off');
    
    // Announce sound state change for screen readers
    announceToScreenReader(soundEnabled ? 'Sound turned on' : 'Sound turned off');
}

/**
 * Change the theme
 * @param {String} theme - Theme name
 */
function changeTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('theme-forest-green', 'theme-tui-blue', 'theme-sunset-orange');
    
    // Add the selected theme class
    if (theme !== 'forest-green') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    // Save to localStorage
    localStorage.setItem('kiwi-memory-theme', theme);
}

/**
 * Change the language
 * @param {String} lang - Language code
 */
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update all text elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Save to localStorage
    localStorage.setItem('kiwi-memory-language', lang);
}

/**
 * Announce message to screen readers
 * @param {String} message - Message to announce
 */
function announceToScreenReader(message) {
    gameAnnouncements.textContent = message;
}

/**
 * Load saved preferences from localStorage
 */
function loadPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('kiwi-memory-theme');
    if (savedTheme) {
        themeSelector.value = savedTheme;
        changeTheme(savedTheme);
    }
    
    // Load language preference
    const savedLanguage = localStorage.getItem('kiwi-memory-language');
    if (savedLanguage) {
        languageSelector.value = savedLanguage;
        changeLanguage(savedLanguage);
    }
    
    // Load sound preference (default to OFF if not set)
    const savedSound = localStorage.getItem('kiwi-memory-sound');
    soundEnabled = savedSound === null ? false : savedSound === 'on';
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Sound on. Click to mute' : 'Sound off. Click to unmute');
    soundToggle.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved preferences
    loadPreferences();
    
    // Create game sounds
    createGameSounds();
    
    // Initialize the game
    initGame();
    
    // Add event listeners for buttons
    restartButton.addEventListener('click', initGame);
    
    // Make sure play again button works
    playAgainButton.addEventListener('click', function() {
        initGame();
    });
    
    // Theme selector
    themeSelector.addEventListener('change', function() {
        changeTheme(this.value);
    });
    
    // Language selector
    languageSelector.addEventListener('change', function() {
        changeLanguage(this.value);
    });
    
    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);
});
/**
 * Create simple audio tones for game sounds
 * This creates neutral, non-sensitive sounds using the Web Audio API
 */
function createGameSounds() {
    try {
        // Only create sounds if Web Audio API is supported
        if (window.AudioContext || window.webkitAudioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            // Create flip sound (short low tone)
            createTone(flipSound, audioContext, 200, 0.1, 'sine', 0.2);
            
            // Create match sound (medium high tone)
            createTone(matchSound, audioContext, 800, 0.2, 'sine', 0.3);
            
            // Create win sound (ascending tones)
            createWinSound(winSound, audioContext);
        }
    } catch (error) {
        console.log('Audio creation error:', error);
    }
}

/**
 * Create a simple tone and attach it to an audio element
 * @param {HTMLAudioElement} audioElement - The audio element to attach the tone to
 * @param {AudioContext} audioContext - The audio context
 * @param {Number} frequency - The frequency of the tone
 * @param {Number} duration - The duration of the tone in seconds
 * @param {String} type - The type of oscillator
 * @param {Number} volume - The volume of the tone (0-1)
 */
function createTone(audioElement, audioContext, frequency, duration, type, volume) {
    // Create an in-memory audio buffer
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill the buffer with a simple tone
    for (let i = 0; i < buffer.length; i++) {
        // Simple fade in/out to avoid clicks
        let amplitude = 1;
        if (i < sampleRate * 0.01) {
            amplitude = i / (sampleRate * 0.01);
        } else if (i > buffer.length - sampleRate * 0.01) {
            amplitude = (buffer.length - i) / (sampleRate * 0.01);
        }
        
        // Generate waveform
        if (type === 'sine') {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude * volume;
        } else {
            data[i] = ((i / sampleRate * frequency) % 1 < 0.5 ? 1 : -1) * amplitude * volume;
        }
    }
    
    // Convert buffer to blob URL
    const blob = bufferToWave(buffer, buffer.length);
    const url = URL.createObjectURL(blob);
    
    // Set as audio element source
    const source = document.createElement('source');
    source.src = url;
    source.type = 'audio/wav';
    
    // Clear existing sources and add new one
    while (audioElement.firstChild) {
        audioElement.removeChild(audioElement.firstChild);
    }
    audioElement.appendChild(source);
    audioElement.load();
}

/**
 * Create a win sound (ascending tones)
 * @param {HTMLAudioElement} audioElement - The audio element to attach the sound to
 * @param {AudioContext} audioContext - The audio context
 */
function createWinSound(audioElement, audioContext) {
    const duration = 0.6;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create ascending tones
    for (let i = 0; i < buffer.length; i++) {
        const time = i / sampleRate;
        const frequency = 300 + (time * 500);
        
        // Simple fade in/out
        let amplitude = 0.3;
        if (i < sampleRate * 0.01) {
            amplitude = i / (sampleRate * 0.01) * 0.3;
        } else if (i > buffer.length - sampleRate * 0.01) {
            amplitude = (buffer.length - i) / (sampleRate * 0.01) * 0.3;
        }
        
        data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude;
    }
    
    // Convert buffer to blob URL
    const blob = bufferToWave(buffer, buffer.length);
    const url = URL.createObjectURL(blob);
    
    // Set as audio element source
    const source = document.createElement('source');
    source.src = url;
    source.type = 'audio/wav';
    
    // Clear existing sources and add new one
    while (audioElement.firstChild) {
        audioElement.removeChild(audioElement.firstChild);
    }
    audioElement.appendChild(source);
    audioElement.load();
}

/**
 * Convert an audio buffer to a WAV file blob
 * @param {AudioBuffer} buffer - The audio buffer
 * @param {Number} length - The length of the buffer
 * @returns {Blob} - A WAV file blob
 */
function bufferToWave(buffer, length) {
    // Create WAV file header
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numOfChan * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    
    // Create buffer for the WAV file
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);
    
    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, totalSize - 8, true);
    writeString(view, 8, 'WAVE');
    
    // FMT sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // subchunk1size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    
    // Data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Write the PCM samples
    const data = buffer.getChannelData(0);
    let offset = headerSize;
    for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
    }
    
    return new Blob([view], { type: 'audio/wav' });
}

/**
 * Write a string to a DataView
 * @param {DataView} view - The DataView to write to
 * @param {Number} offset - The offset to write at
 * @param {String} string - The string to write
 */
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
