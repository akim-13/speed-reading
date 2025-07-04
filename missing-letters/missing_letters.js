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
const chanceOfDeletionSlider = document.querySelector('#chanceOfDeletion');


// Set defaults.
let delay = parseFloat(delaySlider.value);
let chanceOfDeletion = parseFloat(chanceOfDeletionSlider.value);
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

    let phraseWithMissingLettersArr = [];

    phrase.split(' ').forEach(word => {
        phraseWithMissingLettersArr.push(removeLetters(word, chanceOfDeletion));
    });

    const phraseWithMissingLettersStr = phraseWithMissingLettersArr.join(' ');

    gameTextDiv.textContent = phraseWithMissingLettersStr;

    return new Promise(resolve => {
        setTimeout(() => {
            gameTextDiv.textContent = '';
            resolve();
        }, delay * 1000);
    });
}


function removeLetters(word, chanceOfDeletion) {
    const isLastCharLetter = /\p{L}/u.test(word.slice(-1));
    const isWordLongEnough = (word.length >= 5) || 
        (word.length >= 4 && isLastCharLetter);
    
    if (!isWordLongEnough) {
        return word;
    }
    
    const removeUntilIndex = isLastCharLetter ? 
        word.length - 1 :
        word.length - 2;
    
    // const shuffledWord = shuffleFromTo(word.split(''), 1, shuffleToIndex)
    const wordWithMissingLetters = deleteFromTo(word.split(''), 1, removeUntilIndex, chanceOfDeletion)
    
    return wordWithMissingLetters.join('');
}


function deleteFromTo(arr, start, end, chanceOfDeletion) {
    const before = arr.slice(0, start);
    const middle = arr.slice(start, end);
    const after = arr.slice(end);

    for (let i = 0; i < middle.length; i++) {
        if (Math.random() < chanceOfDeletion) {
            middle[i] = '_';
        }
    }

    return before.concat(middle, after);
}



// Set up event listeners.
setupFontSizeSlider(fontSizeSlider);


bindFloatInput(delaySlider, value => {
    delay = value;
});


bindFloatInput(chanceOfDeletionSlider, value => {
    chanceOfDeletion = value;
});


// Start the game on Shift+Enter.
setupStartKeybind(startAnimation, context);
setupStartButton(startButton, startAnimation, context);
