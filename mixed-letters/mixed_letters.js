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

    let phraseWithMixedLettersArr = [];

    phrase.split(' ').forEach(word => {
        phraseWithMixedLettersArr.push(mixLetters(word));
    });

    const phraseWithMixedLettersStr = phraseWithMixedLettersArr.join(' ');

    gameTextDiv.textContent = phraseWithMixedLettersStr;

    return new Promise(resolve => {
        setTimeout(() => {
            gameTextDiv.textContent = '';
            resolve();
        }, delay * 1000);
    });
}


function mixLetters(word) {
    const isLastCharLetter = /\p{L}/u.test(word.slice(-1));
    const isWordShufflable = (word.length >= 5) || 
        (word.length >= 4 && isLastCharLetter);
    
    if (!isWordShufflable) {
        return word;
    }
    
    const shuffleToIndex = isLastCharLetter ? 
        word.length - 1 :
        word.length - 2;
    
    const shuffledWord = shuffleFromTo(word.split(''), 1, shuffleToIndex)
    
    return shuffledWord.join('');
}

function shuffleFromTo(arr, start, end) {
    const before = arr.slice(0, start);
    const middle = arr.slice(start, end);
    const after = arr.slice(end);

    // Shuffle middle
    for (let i = middle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [middle[i], middle[j]] = [middle[j], middle[i]];
    }

    return before.concat(middle, after);
}


// Set up event listeners.
setupFontSizeSlider(fontSizeSlider);


bindFloatInput(delaySlider, value => {
    delay = value;
});


// Start the game on Shift+Enter.
setupStartKeybind(startAnimation, context);
setupStartButton(startButton, startAnimation, context);
