const inputBox = document.querySelector('#input-value');
const applyButton = document.querySelector('#apply-button');
const gameArea = document.querySelector('.game-area');
const gameTextDiv = document.querySelector('#gametext-div');

const phrase = 'Летающие буквы, но на самом деле слова!';
let offscreenWords = []

gameTextDiv.textContent = '';
gameTextDiv.style.opacity = 0;

const splitByWords = true;
const splitPhrase = splitByWords ? phrase.split(' ') : phrase.split('');

splitPhrase.forEach(textUnit => {
    const span = document.createElement('span');
    span.textContent = textUnit;
    span.className = 'offscreen word';
    document.body.appendChild(span);
    gameTextDiv.innerHTML += `<span>${textUnit}${splitByWords ? ' ' : ''}</span>`;
    offscreenWords.push(span);
});


function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnOffscreen(word) {
    const rect = word.getBoundingClientRect();
    const wordWidth = rect.width;
    const wordHeight = rect.height;
    const gameAreaWidth = gameArea.getBoundingClientRect().width;
    const gameAreaHeight = gameArea.getBoundingClientRect().height;

    const edge = randInt(0, 3);
    const top = 0;
    const right = 1;
    const bottom = 2;
    const left = 3;
    const offset = 50;
    let x,y;

    switch (edge) {
        case top:
            x = randInt(-wordWidth, gameAreaWidth+offset);
            y = -wordHeight;
            break;
        case bottom:
            x = randInt(-wordWidth, gameAreaWidth+offset);
            y = gameAreaHeight;
            break;
        case right:
            x = gameAreaWidth;
            y = randInt(-wordHeight, gameAreaHeight+offset);
            break;
        case left:
            x = -wordWidth;
            y = randInt(-wordHeight, gameAreaHeight+offset);
            break;
    }
    
    word.style.left = x + 'px';
    word.style.top = y + 'px';

    return;
}

offscreenWords.forEach(word => {
    spawnOffscreen(word);
});

const timeline = gsap.timeline({ paused: true });
const timeline2 = gsap.timeline({ paused: true });

// These should always be equal, but just in case.
const numOfWords = Math.min(offscreenWords.length, gameTextDiv.children.length)
const transparentWords = gameTextDiv.children


for (let i = 0; i < numOfWords; i++) {
    const from = offscreenWords[i].getBoundingClientRect();
    const to = transparentWords[i].getBoundingClientRect();

    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const duration = 5;

    // Smooth continuous motion over `duration` seconds.
    timeline.to(offscreenWords[i], {
        x: `+=${dx * 1.5}`,
        y: `+=${dy * 1.5}`,
        duration: duration,
        ease: "power2.outIn",
    }, 0); // Start the animation for every word simultaneously.

    // Fade out only in the second half.
    timeline.to(offscreenWords[i], {
        opacity: 0,
        duration: duration/4,
        ease: "power1.out",
    }, duration/2); // Start `duration/2` seconds after motion begins.

}

timeline.play();