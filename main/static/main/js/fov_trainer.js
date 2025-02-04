const leftNumberDiv = document.querySelector('#left-num');
const rightNumberDiv = document.querySelector('#right-num');
const inputBox = document.querySelector('#input-value');
const checkButton = document.querySelector('#apply-button');
const gameArea = document.querySelector('.game-area');
const scoreDiv = document.querySelector('#score');
const fontSizeDiv = document.querySelector('#fontsize');

const maxInt = 99;

function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}


function assignRandomNumbers(maxInt) {
    leftNumberDiv.innerText = getRandomInt(maxInt);
    rightNumberDiv.innerText = getRandomInt(maxInt);
}


function colourNumbers(colour) {
    leftNumberDiv.style.color = colour;
    rightNumberDiv.style.color = colour;
}


window.addEventListener('load', function () {
    assignRandomNumbers(maxInt);
})


fontSizeDiv.addEventListener('input', function () {
    leftNumberDiv.style.fontSize = parseInt(fontSizeDiv.value) + 'px';
    rightNumberDiv.style.fontSize = parseInt(fontSizeDiv.value) + 'px';
    if (parseInt(scoreDiv.innerText) === 0) {
        return;
    }

    const currentGap = parseInt(getComputedStyle(gameArea).getPropertyValue('gap'));
    const distanceModifier = parseFloat(document.querySelector('#distance').value);
    scoreDiv.innerText = currentGap + 5*distanceModifier;
    console.log(scoreDiv.innerText);
})

checkButton.addEventListener('click', function () {
    const input = inputBox.value.trimEnd().split(' ');
    const leftNumber = parseInt(leftNumberDiv.innerText);
    const rightNumber = parseInt(rightNumberDiv.innerText);

    if (input.length !== 2) {
        alert('Введите два числа, разделенные пробелом.');
        return;
    }

    colourNumbers('black');

    const leftInput = parseInt(input[0]);
    const rightInput = parseInt(input[1]);

    if (leftInput === leftNumber && rightInput === rightNumber) {
        const currentGap = parseInt(getComputedStyle(gameArea).getPropertyValue('gap'));
        const distanceModifier = parseFloat(document.querySelector('#distance').value);
        const delayInMs = parseFloat(document.querySelector('#delay').value);

        gameArea.style.gap = currentGap + 5*distanceModifier + 'px';
        assignRandomNumbers(maxInt);
        inputBox.value = '';
        inputBox.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
        scoreDiv.innerText = currentGap + 5*distanceModifier;
        setTimeout(() => {colourNumbers('white')}, delayInMs);
    } else {
        inputBox.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    }
})


inputBox.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkButton.click();
    }
})
