export async function startAnimation(context) {
    const {
        inputElement,
        gameAreaElement,
        animationFunction,
    } = context;

    const isInputEmpty = inputElement.value.trim() === '';

    if (context.isAnimationRunning || isInputEmpty) {
        return;
    }

    context.isAnimationRunning = true;

    const cleanedInput = inputElement.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    for (const line of cleanedInput) {
        await animationFunction(line);
    }

    context.isAnimationRunning = false;

    gameAreaElement.textContent = 'Введите текст и нажмите "Готово"';
    gameAreaElement.style.opacity = 1;
}
