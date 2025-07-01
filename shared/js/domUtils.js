export function setFontSize(valuePx) {
    document.documentElement.style.setProperty('--word-font-size', valuePx + 'px');
}

export function disableAndClearTextArea(textArea) {
    textArea.placeholder = 'Идёт проигрыш анимации...';
    textArea.disabled = true;
    textArea.value = '';
}

export function enableAndResetTextArea(textArea, currentInput) {
    textArea.placeholder = 'Введите текст и нажмите "Готово" или Shift+Enter';
    textArea.value = currentInput;
    textArea.disabled = false;
}
