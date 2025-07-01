import { setFontSize } from "../shared/js/domUtils.js"
import { startAnimation } from "../shared/js/gameCommon.js"
import {
    generateRandomIntInRange,
    generateRandomFloatInRange
} from "../shared/js/randomUtils.js";
import { 
    setupFontSizeSlider,
    setupStartKeybind,
    setupStartButton,
    bindFloatInput,
    bindCheckboxInput,
} from "../shared/js/eventListeners.js";


const inputBox = document.querySelector('#input-value');
const speedDiv = document.querySelector('#speed');
const delayDiv = document.querySelector('#delay');
const gameTextDiv = document.querySelector('#gametext-div');
const fontSizeDiv = document.querySelector('#fontsize');
const startButton = document.querySelector('#start-button');
const splitIntoWordsCheckbox = document.querySelector('#splitIntoWords');


// Set defaults.
let duration = -parseFloat(speedDiv.value);
let delay = parseFloat(delayDiv.value);
let splitIntoWords = splitIntoWordsCheckbox.checked;
setFontSize(parseInt(fontSizeDiv.value));


const context = {
    inputElement: inputBox,
    gameAreaElement: gameTextDiv,
    isAnimationRunning: false,
    animationFunction: animatePhrase
};

startAnimation(context);


function defineAnimationTimeline(textUnitSpans) {
    const timeline = gsap.timeline({ paused: true });
    
    textUnitSpans.forEach(span => {
        timeline.set(span, {
            rotation: generateRandomIntInRange(0, 360)
        });
        
        timeline.to(span, {
            rotation: generateRandomIntInRange(0, 1) ? "+=360" : "-=360",
            duration: generateRandomFloatInRange(0.3, 0.9) * duration,
            ease: "linear",
            repeat: 9999,  // -1 causes visual glitches for some reason.
        }, 0);

    });

    return timeline;
}


function animatePhrase(phrase) {
    gameTextDiv.textContent = '';

    let textUnitSpans = splitPhraseIntoSpans(phrase);
    
    const timeline = defineAnimationTimeline(textUnitSpans);
    timeline.play();
    
    gsap.delayedCall(delay, () => {
        timeline.progress(1);
    })
    
    return new Promise(resolve => {
        timeline.eventCallback('onComplete', () => {
            // Clean-up.
            gameTextDiv.textContent = "";
            // Resolve the promise to start the next animation.
            resolve();
        });
    });
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


// Set up event listeners.
setupFontSizeSlider(fontSizeDiv);

bindFloatInput(speedDiv, value => {
    duration = -value;
});

bindFloatInput(delayDiv, value => {
    delay = value;
});

bindCheckboxInput(splitIntoWordsCheckbox, isChecked => {
    splitIntoWords = isChecked;
});


// Start the game on Shift+Enter.
setupStartKeybind(startAnimation, context);
setupStartButton(startButton, startAnimation, context);
