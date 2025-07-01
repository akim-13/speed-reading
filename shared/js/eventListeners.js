import { setFontSize } from "./domUtils.js"

export function setupFontSizeSlider(sliderElement) {
    sliderElement.addEventListener('input', () => {
        const size = parseInt(sliderElement.value);
        setFontSize(size);
    });
}

export function setupStartKeybind(startFunction, context) {
    document.addEventListener('keydown', event => {
    if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            startFunction(context);
        }
    });
}

export function setupStartButton(startButton, startFunction, context) {
    startButton.addEventListener('click', () => {
        startFunction(context);
    });
}

export function bindFloatInput(inputElement, callback) {
    inputElement.addEventListener('input', () => {
        const value = parseFloat(inputElement.value);
        // This instead of `return` because addEventListener is 
        // an anonymous function that doesn't return anything.
        callback(value);
    });
}

export function bindCheckboxInput(checkbox, callback) {
    checkbox.addEventListener('change', () => {
        callback(checkbox.checked)
    })
}

export function setupInputBox(inputBox, isAnimationRunning) {
    inputBox.addEventListener('input', () => {
        if (isAnimationRunning) {
            inputBox.disabled = true;
            inputBox.placeholder = 'Идёт проигрыш анимации...';
        }
    });
}