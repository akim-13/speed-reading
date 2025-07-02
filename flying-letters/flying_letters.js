import { setFontSize } from "../shared/js/domUtils.js";
import { startAnimation } from "../shared/js/gameCommon.js";
import {
    generateRandomIntInRange,
} from "../shared/js/randomUtils.js";
import {
    setupFontSizeSlider,
    setupStartKeybind,
    setupStartButton,
    bindFloatInput,
    bindCheckboxInput,
} from "../shared/js/eventListeners.js";


const gameArea = document.querySelector('.game-area');
const inputBox = document.querySelector('#input-value');
const startButton = document.querySelector('#start-button');
const gameTextDiv = document.querySelector('#gametext-div');
const fontSizeSlider = document.querySelector('#fontsize');
const speedSlider = document.querySelector('#speed');
const splitIntoWordsCheckbox = document.querySelector('#splitIntoWords');


// Set defaults.
let duration = -parseFloat(speedSlider.value);
let splitIntoWords = splitIntoWordsCheckbox.checked;
setFontSize(parseInt(fontSizeSlider.value));


const context = {
    inputElement: inputBox,
    gameAreaElement: gameTextDiv,
    isAnimationRunning: false,
    animationFunction: animatePhrase
};

startAnimation(context);


function animatePhrase(phrase) {
    gameTextDiv.textContent = '';
    gameTextDiv.style.opacity = 0;

    let offscreenWords = splitPhraseIntoSpans(phrase);

    offscreenWords.forEach(word => {
        spawnSpansOffscreen(word);
    });

    const transparentWords = gameTextDiv.children;

    const timeline = defineAnimationTimeline(offscreenWords, transparentWords);
    timeline.play();

    return new Promise(resolve => {
        timeline.eventCallback('onComplete', () => {
            offscreenWords.forEach(word => document.body.removeChild(word));
            resolve();
        });
    });
}


function splitPhraseIntoSpans(phrase) {
    let offscreenWords = [];

    const splitPhrase = splitIntoWords ? phrase.split(' ') : phrase.split('');

    splitPhrase.forEach(textUnit => {
        const span = document.createElement('span');
        span.textContent = textUnit;
        span.className = 'offscreen word';
        document.body.appendChild(span);
        gameTextDiv.innerHTML += `<span>${textUnit}${splitIntoWords ? ' ' : ''}</span>`;
        offscreenWords.push(span);
    });

    return offscreenWords;
}


function spawnSpansOffscreen(word) {
    const rect = word.getBoundingClientRect();
    const wordWidth = rect.width;
    const wordHeight = rect.height;
    const gameAreaWidth = gameArea.getBoundingClientRect().width;
    const gameAreaHeight = gameArea.getBoundingClientRect().height;

    const edge = generateRandomIntInRange(0, 3);
    const offset = 50;
    let x, y;

    switch (edge) {
        case 0:
            x = generateRandomIntInRange(-wordWidth, gameAreaWidth + offset);
            y = -wordHeight;
            break;
        case 2:
            x = generateRandomIntInRange(-wordWidth, gameAreaWidth + offset);
            y = gameAreaHeight;
            break;
        case 1:
            x = gameAreaWidth;
            y = generateRandomIntInRange(-wordHeight, gameAreaHeight + offset);
            break;
        case 3:
            x = -wordWidth;
            y = generateRandomIntInRange(-wordHeight, gameAreaHeight + offset);
            break;
    }

    word.style.left = `${x}px`;
    word.style.top = `${y}px`;
}


function defineAnimationTimeline(offscreenWords, transparentWords) {
    const timeline = gsap.timeline({ paused: true });

    const numOfWords = Math.min(offscreenWords.length, transparentWords.length);

    for (let i = 0; i < numOfWords; i++) {
        const from = offscreenWords[i].getBoundingClientRect();
        const to = transparentWords[i].getBoundingClientRect();

        const dx = to.left - from.left;
        const dy = to.top - from.top;

        timeline.to(offscreenWords[i], {
            x: `+=${dx * 1.5}`,
            y: `+=${dy * 1.5}`,
            duration: duration,
            ease: "power2.outIn",
        }, 0);

        timeline.to(offscreenWords[i], {
            opacity: 0,
            duration: duration / 3,
            ease: "power1.out",
        }, duration / 2);
    }

    return timeline;
}


// Set up event listeners.
setupFontSizeSlider(fontSizeSlider);

bindFloatInput(speedSlider, value => {
    duration = -value;
});

bindCheckboxInput(splitIntoWordsCheckbox, isChecked => {
    splitIntoWords = isChecked;
});

setupStartKeybind(startAnimation, context);
setupStartButton(startButton, startAnimation, context);
