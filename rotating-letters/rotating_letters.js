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
const speedSlider = document.querySelector('#speed');
const delaySlider = document.querySelector('#delay');
const gameTextDiv = document.querySelector('#gametext-div');
const startButton = document.querySelector('#start-button');
const fontSizeSlider = document.querySelector('#fontsize');
const splitIntoWordsCheckbox = document.querySelector('#splitIntoWords');


// Set defaults.
let duration = -parseFloat(speedSlider.value);
let delay = parseFloat(delaySlider.value);
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


function splitPhraseIntoSpans(phrase) {
    let spans = [];

    const splitPhrase = splitIntoWords ? phrase.split(' ') : phrase.split('');

    splitPhrase.forEach(textUnit => {
        if (textUnit === ' ') {
            return;
        }
        const span = createSpan(textUnit);
        gameTextDiv.appendChild(span);
        spans.push(span);
    });

    return spans;
}


function createSpan(textUnit) {
    const span = document.createElement('span');
    span.textContent = textUnit;
    span.style.marginRight = "0.2em";
    span.className = 'separate unit';

    return span
}


// Set up event listeners.
setupFontSizeSlider(fontSizeSlider);

bindFloatInput(speedSlider, value => {
    duration = -value;
});

bindFloatInput(delaySlider, value => {
    delay = value;
});

bindCheckboxInput(splitIntoWordsCheckbox, isChecked => {
    splitIntoWords = isChecked;
});


// Start the game on Shift+Enter.
setupStartKeybind(startAnimation, context);
setupStartButton(startButton, startAnimation, context);
