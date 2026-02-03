// Main JavaScript for both pages

document.addEventListener('DOMContentLoaded', function () {
    // Check which page we're on
    const isSuccessPage = document.querySelector('.success-page') !== null;

    if (isSuccessPage) {
        initSuccessPage();
    } else {
        initProposalPage();
    }
});

// Variables for smooth movement
let isNoButtonMoving = false;

// Functions for the proposal page
function initProposalPage() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const optionsContainer = document.querySelector('.options');

    // Store original button text
    const originalNoBtnText = noBtn.innerHTML;

    // Array of funny messages for the No button
    const noButtonMessages = [
        '<i class="fas fa-times-circle"></i> Are you sure?',
        '<i class="fas fa-times-circle"></i> Think again!',
        '<i class="fas fa-times-circle"></i> Please?',
        '<i class="fas fa-times-circle"></i> Really?',
        '<i class="fas fa-times-circle"></i> Give it another thought',
        '<i class="fas fa-times-circle"></i> You might regret this',
        '<i class="fas fa-times-circle"></i> Don\'t be shy!',
        '<i class="fas fa-times-circle"></i> Try clicking Yes instead',
        '<i class="fas fa-times-circle"></i> I\'ll be sad...',
        '<i class="fas fa-times-circle"></i> Pretty please?',
        '<i class="fas fa-times-circle"></i> Just say yes!',
        '<i class="fas fa-times-circle"></i> You know you want to!',
        '<i class="fas fa-times-circle"></i> Give me a chance!',
        '<i class="fas fa-times-circle"></i> My heart is breaking...',
        '<i class="fas fa-times-circle"></i> Please reconsider!',
        '<i class="fas fa-times-circle"></i> I\'ll make it worth it!'
    ];

    let noClickCount = 0;

    // Set initial position for the No button - place it next to Yes button
    // Set initial position for the No button - place it next to Yes button
    setTimeout(() => {
        positionNoButtonNextToYes(noBtn, yesBtn, optionsContainer);
    }, 300);

    // Yes button - redirect to success page
    yesBtn.addEventListener('click', function () {
        // Create a celebration effect before redirecting
        createConfettiEffect();

        // Play a sound (optional)
        playClickSound();

        // Change button text to show excitement
        yesBtn.innerHTML = '<i class="fas fa-heart"></i> Yay! You made me so happy!';
        yesBtn.disabled = true;

        // Add a heart explosion effect
        createHeartExplosion(yesBtn);

        // Redirect after a short delay to show the effect
        setTimeout(() => {
            window.location.href = 'success.html';
        }, 1800);
    });

    // No button - move smoothly when clicked
    noBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (isNoButtonMoving) return;

        // Increment click counter
        noClickCount++;

        // Change the button text to a random funny message
        const randomMessageIndex = Math.floor(Math.random() * noButtonMessages.length);
        noBtn.innerHTML = noButtonMessages[randomMessageIndex];

        // Move the button smoothly to a new position
        moveNoButtonSmoothly(noBtn, yesBtn, optionsContainer);

        // Play sound
        playNoSound();

        // Make the Yes button more appealing every few clicks
        if (noClickCount % 3 === 0) {
            makeYesButtonMoreAppealing(yesBtn, noClickCount);
        }

        // After many clicks, show a special message
        if (noClickCount >= 8) {
            showPersuasiveMessage(noClickCount);
        }

        // If clicked too many times, make Yes button irresistible
        if (noClickCount >= 12) {
            makeYesButtonIrresistible(yesBtn);
        }
    });

    // Also make the No button move when hovered (with reduced chance)
    noBtn.addEventListener('mouseover', function (event) {
        if (isNoButtonMoving) return;

        // Only move sometimes on hover (10% chance)
        if (Math.random() < 0.1) {
            const randomMessageIndex = Math.floor(Math.random() * noButtonMessages.length);
            noBtn.innerHTML = noButtonMessages[randomMessageIndex];
            moveNoButtonSmoothly(noBtn, yesBtn, optionsContainer);
        }
    });

    // Make sure No button stays within bounds when window is resized
    window.addEventListener('resize', function () {
        positionNoButtonNextToYes(noBtn, yesBtn, optionsContainer);
    });

    // Add some floating animation to hearts in background
    animateBackgroundHearts();
}

// Position No button next to Yes button initially
// Position No button next to Yes button initially
function positionNoButtonNextToYes(noBtn, yesBtn, container) {
    if (!yesBtn || !noBtn || !container) return;
    
    // Reset to normal flow positioning when needed (on resize)
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.style.transform = 'none';
    noBtn.style.transition = 'all 0.3s ease';
}   

// Move the No button smoothly within the options container
function moveNoButtonSmoothly(noBtn, yesBtn, container) {
    if (isNoButtonMoving) return;
    isNoButtonMoving = true;

    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();

    // Define safe zones: corners and edges far from center
    // Each zone is [minX, maxX, minY, maxY] relative to container
    const padding = 30;
    const quarterWidth = containerRect.width / 4;
    const quarterHeight = containerRect.height / 4;

    const safeZones = [
        // Top-left corner
        { x: [padding, quarterWidth], y: [padding, quarterHeight] },
        // Top-right corner
        { x: [containerRect.width - quarterWidth, containerRect.width - padding - noBtnRect.width], y: [padding, quarterHeight] },
        // Bottom-left corner
        { x: [padding, quarterWidth], y: [containerRect.height - quarterHeight, containerRect.height - padding - noBtnRect.height] },
        // Bottom-right corner
        { x: [containerRect.width - quarterWidth, containerRect.width - padding - noBtnRect.width], y: [containerRect.height - quarterHeight, containerRect.height - padding - noBtnRect.height] },
        // Far left
        { x: [padding, quarterWidth], y: [quarterHeight, containerRect.height - quarterHeight - noBtnRect.height] },
        // Far right
        { x: [containerRect.width - quarterWidth, containerRect.width - padding - noBtnRect.width], y: [quarterHeight, containerRect.height - quarterHeight - noBtnRect.height] }
    ];

    // Pick a random safe zone
    const zone = safeZones[Math.floor(Math.random() * safeZones.length)];
    
    // Pick random position within that zone
    const newX = Math.random() * (zone.x[1] - zone.x[0]) + zone.x[0];
    const newY = Math.random() * (zone.y[1] - zone.y[0]) + zone.y[0];

    // Add a little rotation for fun
    const rotation = Math.floor(Math.random() * 30) - 15; // -15 to 15 degrees

    // Change button color temporarily
    const colors = [
        'linear-gradient(to right, #f44336, #ef5350)',
        'linear-gradient(to right, #9C27B0, #BA68C8)',
        'linear-gradient(to right, #2196F3, #42A5F5)',
        'linear-gradient(to right, #FF9800, #FFB74D)',
        'linear-gradient(to right, #4CAF50, #66BB6A)',
        'linear-gradient(to right, #FF5722, #FF8A65)'
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const originalBackground = noBtn.style.background;

    // Apply smooth transition
    noBtn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease';
    noBtn.style.position = 'absolute';
    noBtn.style.zIndex = '10';

    // Apply the new position and styles
    setTimeout(() => {
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
        noBtn.style.transform = `rotate(${rotation}deg)`;
        noBtn.style.background = randomColor;

        // Add a bounce effect
        setTimeout(() => {
            noBtn.style.transform = `rotate(${rotation}deg) scale(1.05)`;
            setTimeout(() => {
                noBtn.style.transform = `rotate(${rotation}deg) scale(1)`;
            }, 150);
        }, 300);
    }, 10);

    // Reset color after animation
    setTimeout(() => {
        noBtn.style.background = originalBackground;
    }, 500);

    // Allow movement again after animation completes
    setTimeout(() => {
        isNoButtonMoving = false;
        noBtn.style.transition = 'all 0.3s ease';
    }, 500);
}

// Make the Yes button more appealing when No is clicked many times
function makeYesButtonMoreAppealing(yesBtn, clickCount) {
    const originalTransform = yesBtn.style.transform;
    const originalText = yesBtn.innerHTML;

    // Make it pulse with intensity based on click count
    const scale = 1.1 + (clickCount * 0.02);
    yesBtn.style.transform = `scale(${scale})`;
    yesBtn.style.transition = 'all 0.5s ease';
    yesBtn.style.boxShadow = `0 10px 30px rgba(76, 175, 80, ${0.4 + clickCount * 0.05})`;

    // Add a glow effect
    yesBtn.style.animation = `pulse ${1 - clickCount * 0.05}s infinite`;

    // Change text temporarily
    const messages = [
        '<i class="fas fa-heart"></i> Click me instead!',
        '<i class="fas fa-heart"></i> I\'m the right choice!',
        '<i class="fas fa-heart"></i> Pick me!',
        '<i class="fas fa-heart"></i> This way to happiness!',
        '<i class="fas fa-heart"></i> Your best option!'
    ];

    const messageIndex = Math.min(clickCount - 1, messages.length - 1);
    yesBtn.innerHTML = messages[messageIndex % messages.length];

    // Create floating hearts around Yes button
    createFloatingHeartsAroundButton(yesBtn, 3);

    // Reset after a while
    setTimeout(() => {
        yesBtn.style.transform = originalTransform;
        yesBtn.style.boxShadow = '';
        yesBtn.style.animation = '';
        yesBtn.innerHTML = '<i class="fas fa-check-circle"></i> Yes, Absolutely!';
    }, 2000);
}

// Make Yes button irresistible after many No clicks
function makeYesButtonIrresistible(yesBtn) {
    yesBtn.style.animation = 'heartbeat 0.8s infinite';
    yesBtn.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.8), 0 0 60px rgba(76, 175, 80, 0.4)';
    yesBtn.style.transform = 'scale(1.15)';

    // Create lots of hearts around it
    createFloatingHeartsAroundButton(yesBtn, 10);
}

// Show persuasive message after many No clicks
function showPersuasiveMessage(clickCount) {
    // Remove any existing message
    const existingMessage = document.querySelector('.persuasive-message');
    if (existingMessage) existingMessage.remove();

    // Create a message element
    const message = document.createElement('div');
    message.className = 'persuasive-message';

    const messages = [
        '<i class="fas fa-heart-broken"></i> Okay, I see how it is... but I\'m not giving up!',
        '<i class="fas fa-heart-broken"></i> You\'re making this difficult! Just click Yes!',
        '<i class="fas fa-heart-broken"></i> My heart can\'t take much more of this!',
        '<i class="fas fa-heart-broken"></i> You\'ve clicked No ' + clickCount + ' times! Give Yes a chance!',
        '<i class="fas fa-heart-broken"></i> I\'ll keep asking until you say Yes!'
    ];

    const messageIndex = Math.min(Math.floor(clickCount / 3), messages.length - 1);

    message.innerHTML = `
        <p>${messages[messageIndex]}</p>
        <p>Just give the "Yes" button a chance!</p>
    `;

    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = 'rgba(255, 107, 107, 0.95)';
    message.style.color = 'white';
    message.style.padding = '15px 25px';
    message.style.borderRadius = '15px';
    message.style.zIndex = '1000';
    message.style.textAlign = 'center';
    message.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    message.style.animation = 'fadeIn 0.5s ease';
    message.style.fontWeight = '500';
    message.style.maxWidth = '90%';
    message.style.width = 'auto';

    document.body.appendChild(message);

    // Remove after 5 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (message.parentNode) {
                document.body.removeChild(message);
            }
        }, 500);
    }, 5000);
}

// Create floating hearts around a button
function createFloatingHeartsAroundButton(button, count) {
    const buttonRect = button.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            heart.style.position = 'fixed';
            heart.style.color = '#ff6b6b';
            heart.style.fontSize = `${Math.random() * 16 + 12}px`;
            heart.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
            heart.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
            heart.style.opacity = '0.8';
            heart.style.zIndex = '999';
            heart.style.pointerEvents = 'none';
            heart.style.transform = 'translate(-50%, -50%) scale(0)';

            document.body.appendChild(heart);

            // Animation - float outward
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80 + 40;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            const animation = heart.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8, offset: 0.2 },
                { transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 1200,
                easing: 'ease-out'
            });

            animation.onfinish = () => {
                if (heart.parentNode) {
                    document.body.removeChild(heart);
                }
            };
        }, i * 150);
    }
}

// Create heart explosion effect
function createHeartExplosion(button) {
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            heart.style.position = 'fixed';
            heart.style.color = '#ff6b6b';
            heart.style.fontSize = `${Math.random() * 20 + 12}px`;
            heart.style.left = `${centerX}px`;
            heart.style.top = `${centerY}px`;
            heart.style.opacity = '1';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            heart.style.transform = 'translate(-50%, -50%) scale(0)';

            document.body.appendChild(heart);

            // Animation - explode outward
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 80;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            const animation = heart.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1, offset: 0.2 },
                { transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            });

            animation.onfinish = () => {
                if (heart.parentNode) {
                    document.body.removeChild(heart);
                }
            };
        }, i * 50);
    }
}

// Functions for the success page
function initSuccessPage() {
    const backBtn = document.getElementById('back-btn');
    const celebrateBtn = document.getElementById('celebrate-btn');

    // Back button - return to proposal page
    backBtn.addEventListener('click', function () {
        playClickSound();
        window.location.href = 'index.html';
    });

    // Celebrate button - show celebration
    celebrateBtn.addEventListener('click', function () {
        createExtendedConfettiEffect();
        playCelebrationSound();

        // Show a message
        celebrateBtn.innerHTML = '<i class="fas fa-glass-cheers"></i> Celebrating!';
        celebrateBtn.disabled = true;

        setTimeout(() => {
            celebrateBtn.innerHTML = '<i class="fas fa-glass-cheers"></i> Let\'s Celebrate!';
            celebrateBtn.disabled = false;
        }, 2000);
    });

    // Initialize the countdown timer
    initCountdown();

    // Add continuous celebration effect
    setInterval(() => {
        createRandomHeart();
    }, 1500);
}

// Create confetti effect for celebrations
function createConfettiEffect() {
    const colors = ['#ff6b6b', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '0';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 12 + 5}px`;
            confetti.style.height = confetti.style.width;
            confetti.style.position = 'fixed';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';

            document.body.appendChild(confetti);

            // Animation
            const animation = confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.random() * 100 - 50}px, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1500 + 1000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }, i * 50);
    }
}

// Extended confetti effect for celebrations page
function createExtendedConfettiEffect() {
    const colors = ['#ff6b6b', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#FF5722', '#00BCD4'];

    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '0';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 16 + 5}px`;
            confetti.style.height = confetti.style.width;

            // Random shape
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            } else {
                confetti.style.borderRadius = '0';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            }

            confetti.style.position = 'fixed';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';

            document.body.appendChild(confetti);

            // Animation
            const animation = confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.random() * 150 - 75}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2500 + 1000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// Create random floating hearts on success page
function createRandomHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.position = 'fixed';
    heart.style.color = '#ff6b6b';
    heart.style.fontSize = `${Math.random() * 20 + 12}px`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = '100%';
    heart.style.opacity = '0.6';
    heart.style.zIndex = '-1';
    heart.style.pointerEvents = 'none';

    document.body.appendChild(heart);

    // Animation
    const animation = heart.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 0.6 },
        { transform: `translateY(-100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 6000 + 3000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });

    animation.onfinish = () => heart.remove();
}

// Initialize countdown timer on success page
function initCountdown() {
    // Set Valentine's Day date (February 14th of current year)
    const currentYear = new Date().getFullYear();
    const valentinesDay = new Date(currentYear, 1, 14); // February is month 1 (0-indexed)

    // If Valentine's Day has already passed this year, set for next year
    if (valentinesDay < new Date()) {
        valentinesDay.setFullYear(currentYear + 1);
    }

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = valentinesDay - now;

        if (timeRemaining <= 0) {
            // It's Valentine's Day!
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';

            // Update the message
            document.querySelector('.countdown h3').innerHTML = '<i class="fas fa-heart"></i> Happy Valentine\'s Day! <i class="fas fa-heart"></i>';
            return;
        }

        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Update the display
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Animate background hearts
function animateBackgroundHearts() {
    const hearts = document.querySelectorAll('.hearts-background .heart');

    hearts.forEach((heart, index) => {
        // Randomize animation duration and delay
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;

        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
    });
}

// Sound effects (using Web Audio API for simple sounds)
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio context not supported, fail silently
    }
}

function playNoSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 220; // A3
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio context not supported, fail silently
    }
}

function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Play a little arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'triangle';

                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 100);
        });
    } catch (e) {
        // Audio context not supported, fail silently
    }
}