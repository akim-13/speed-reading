const inputBox = document.querySelector('#input-value');
const startButton = document.querySelector('#start-button');
const gameArea = document.querySelector('.game-area');
const gameTextDiv = document.querySelector('#gametext-div');

const fontSizeDiv = document.querySelector('#fontsize');
const speedDiv = document.querySelector('#speed');
const splitIntoWordsCheckbox = document.querySelector('#splitIntoWords');

const initialFontSize = parseInt(fontSizeDiv.value) + 'px';
document.documentElement.style.setProperty('--word-font-size', initialFontSize);

let duration = -speedDiv.value;

// As oppposed to splitting into characters.
let splitIntoWords = splitIntoWordsCheckbox.checked;

splitIntoWordsCheckbox.addEventListener('change', () => {
    splitIntoWords = splitIntoWordsCheckbox.checked;
});

startButton.addEventListener('click', start);

let isAnimationRunning = false;

async function start() {
    if (isAnimationRunning) return;

    isAnimationRunning = true;

    const text = inputBox.value;
    const lines = text.split('\n');

    for (const line of lines) {
        await animatePhrase(line);
    }
    
    isAnimationRunning = false;
}

function animatePhrase(phrase) {
    let offscreenWords = []

    gameTextDiv.textContent = '';
    gameTextDiv.style.opacity = 0;

    const splitPhrase = splitIntoWords ? phrase.split(' ') : phrase.split('');

    splitPhrase.forEach(textUnit => {
        const span = document.createElement('span');
        span.textContent = textUnit;
        span.className = 'offscreen word';
        document.body.appendChild(span);
        gameTextDiv.innerHTML += `<span>${textUnit}${splitIntoWords ? ' ' : ''}</span>`;
        offscreenWords.push(span);
    });

    offscreenWords.forEach(word => {
        spawnOffscreen(word);
    });

    const transparentWords = gameTextDiv.children
    // These should always be equal, but just in case.
    const numOfWords = Math.min(offscreenWords.length, transparentWords.length)
    const timeline = gsap.timeline({ paused: true });

    for (let i = 0; i < numOfWords; i++) {
        const from = offscreenWords[i].getBoundingClientRect();
        const to = transparentWords[i].getBoundingClientRect();

        const dx = to.left - from.left;
        const dy = to.top - from.top;

        // Smooth continuous motion over `duration` seconds.
        timeline.to(offscreenWords[i], {
            x: `+=${dx * 1.5}`,
            y: `+=${dy * 1.5}`,
            duration: duration,
            ease: "power2.outIn",
        }, 0); // Start the animation for every word simultaneously.

        // Fade out only in the second half.
        timeline.to(offscreenWords[i], {
            opacity: 0,
            duration: duration/3,
            ease: "power1.out",
        }, duration/2); // Start `duration/2` seconds after motion begins.

    }

    timeline.play();
    
    return new Promise(resolve => {
        timeline.eventCallback('onComplete', () => {
            // Clean-up.
            offscreenWords.forEach(word => document.body.removeChild(word));
            // Resolve the promise to start the next animation.
            resolve();
        });
    });
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnOffscreen(word) {
    const rect = word.getBoundingClientRect();
    const wordWidth = rect.width;
    const wordHeight = rect.height;
    const gameAreaWidth = gameArea.getBoundingClientRect().width;
    const gameAreaHeight = gameArea.getBoundingClientRect().height;

    const edge = randInt(0, 3);
    const top = 0;
    const right = 1;
    const bottom = 2;
    const left = 3;
    const offset = 50;
    let x,y;

    switch (edge) {
        case top:
            x = randInt(-wordWidth, gameAreaWidth+offset);
            y = -wordHeight;
            break;
        case bottom:
            x = randInt(-wordWidth, gameAreaWidth+offset);
            y = gameAreaHeight;
            break;
        case right:
            x = gameAreaWidth;
            y = randInt(-wordHeight, gameAreaHeight+offset);
            break;
        case left:
            x = -wordWidth;
            y = randInt(-wordHeight, gameAreaHeight+offset);
            break;
    }
    
    word.style.left = x + 'px';
    word.style.top = y + 'px';

    return;
}

fontSizeDiv.addEventListener('input', () => {
  const newSize = parseInt(fontSizeDiv.value) + 'px';
  document.documentElement.style.setProperty('--word-font-size', newSize);
});

speedDiv.addEventListener('input', () => {
    duration = parseInt(-speedDiv.value);
});