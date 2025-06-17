const inputBox = document.querySelector('#input-value');
const applyButton = document.querySelector('#apply-button');
const gameArea = document.querySelector('.game-area');
const gameTextDiv = document.querySelector('#gametext-div');

const phrase = 'Летающие буквы, но на самом деле слова!';
let offscreenWords = []

gameTextDiv.textContent = '';
gameTextDiv.style.opacity = 0;

phrase.split(' ').forEach(word => {
    const span = document.createElement('span');
    span.textContent = word;
    span.className = 'offscreen word';
    span.style.position = 'absolute';
    document.body.appendChild(span);
    gameTextDiv.innerHTML += '<span>' + word + ' </span>';
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

// These should always be equal, but just in case.
const numOfWords = Math.min(offscreenWords.length, gameTextDiv.children.length)
const transparentWords = gameTextDiv.children


for (let i = 0; i < numOfWords; i++) {
    const from = offscreenWords[i].getBoundingClientRect();
    const to = transparentWords[i].getBoundingClientRect();

    const dx = to.left - from.left;
    const dy = to.top - from.top;

    timeline.to(offscreenWords[i], {
        x: `+=${dx}`,
        y: `+=${dy}`,
        duration: 1,
    }, 0); // 0 means all animate simultaneously
}

timeline.play();