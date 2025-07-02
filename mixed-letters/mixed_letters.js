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
const delaySlider = document.querySelector('#delay');
const gameTextDiv = document.querySelector('#gametext-div');
const startButton = document.querySelector('#start-button');
const fontSizeSlider = document.querySelector('#fontsize');


// Set defaults.
let delay = parseFloat(delaySlider.value);
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
    
    phraseWithMixedLettersArr = [];

    phrase.split(' ').forEach(word => {
        phraseWithMixedLettersArr.push(mixLetters(word));
    });

    phraseWithMixedLettersStr = phraseWithMixedLettersArr.join(' ');

    
    return new Promise(resolve => {
        timeline.eventCallback('onComplete', () => {
            // Clean-up.
            gameTextDiv.textContent = "";
            // Resolve the promise to start the next animation.
            resolve();
        });
    });
}


function mixLetters(word) {
    const lettersOnly = word.match(/[a-z]/gi) || [];
    
    if (lettersOnly.length < 4) {
        return word;
    }
    
    word.split('').forEach((letter, index) => {
        console.log('TODO');
    });
    
    return word
}


// Set up event listeners.
setupFontSizeSlider(fontSizeSlider);


bindFloatInput(delaySlider, value => {
    delay = value;
});


// Start the game on Shift+Enter.
setupStartKeybind(startAnimation, context);
setupStartButton(startButton, startAnimation, context);
