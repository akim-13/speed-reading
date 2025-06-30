const gameArea = document.querySelector('.game-area');
const inputBox = document.querySelector('#input-value');
const startButton = document.querySelector('#start-button');
const gameTextDiv = document.querySelector('#gametext-div');
const fontSizeDiv = document.querySelector('#fontsize');
const speedDiv = document.querySelector('#speed');
const splitIntoWordsCheckbox = document.querySelector('#splitIntoWords');


// Set defatuls.
const initialFontSize = parseInt(fontSizeDiv.value) + 'px';
document.documentElement.style.setProperty('--word-font-size', initialFontSize);
// As oppposed to splitting into characters.
let splitIntoWords = splitIntoWordsCheckbox.checked;
let duration = -speedDiv.value;

let isAnimationRunning = false;

async function start() {
    const isInputEmpty = inputBox.value.trim() === '';

    if (isAnimationRunning || isInputEmpty) {
        return;
    }

    isAnimationRunning = true;

    const cleanedInput = inputBox.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')

    for (const line of cleanedInput) {
        await animatePhrase(line);
    }
    
    isAnimationRunning = false;
    
    gameTextDiv.textContent = 'Введите текст и нажмите "Готово"';
    gameTextDiv.style.opacity = 1;
}


function animatePhrase(phrase) {
    gameTextDiv.textContent = '';

    let textUnitSpans = splitPhraseIntoSpans(phrase);
    
    timeline = defineAnimationTimeline(textUnitSpans);
    timeline.play();
    
    return new Promise(resolve => {
        timeline.eventCallback('onComplete', () => {
            // Clean-up.
            gameTextDiv.forEach(word => document.body.removeChild(word));
            // Resolve the promise to start the next animation.
            resolve();
        });
    });
}


function defineAnimationTimeline(textUnitSpans) {
    const timeline = gsap.timeline({ paused: true });
    
    textUnitSpans.forEach(span => {
        timeline.set(span, {
            rotation: generateRandomInt(0, 360)
        });
        
        timeline.to(span, {
            rotation: generateRandomInt(0, 1) ? "+=360" : "-=360",
            duration: Math.random() * duration,
            ease: "linear",
            repeat: 3
        }, 0);

    });

    return timeline;
}


function splitPhraseIntoSpans(phrase) {
    let spans = [];

    const splitPhrase = splitIntoWords ? phrase.split(' ') : phrase.split('');

    splitPhrase.forEach(textUnit => {
        if (textUnit === ' ') {
            return;
        }
        const span = document.createElement('span');
        span.textContent = textUnit;
        span.style.marginRight = "0.2em";
        span.className = 'separate unit';
        gameTextDiv.appendChild(span);
        spans.push(span);
    });

    return spans;
}



function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


fontSizeDiv.addEventListener('input', () => {
  const newSize = parseInt(fontSizeDiv.value) + 'px';
  document.documentElement.style.setProperty('--word-font-size', newSize);
});


speedDiv.addEventListener('input', () => {
    duration = parseInt(-speedDiv.value);
});


splitIntoWordsCheckbox.addEventListener('change', () => {
    splitIntoWords = splitIntoWordsCheckbox.checked;
});


// Start game on shift+enter.
document.addEventListener('keydown', event => {
    if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        start();
    }
});

startButton.addEventListener('click', start);
