"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const guessButton = document.getElementById('guessButton');
    const guessInput = document.getElementById('guessInput');
    const hintMessage = document.getElementById('hintMessage');
    const attemptsLeft = document.getElementById('attemptsLeft');
    const restartButton = document.getElementById('restartButton');
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    let randomNumber;
    let attempts;
    // Initialize confetti on canvas
    const confetti = window.confetti;
    const startNewGame = () => {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 10;
        hintMessage.textContent = '';
        attemptsLeft.textContent = `Attempts left: ${attempts}`;
        guessButton.disabled = false;
        restartButton.classList.add('hidden');
    };
    const showFireworks = () => {
        confetti({
            particleCount: 500,
            spread: 90,
            origin: { y: 0.6 }
        });
    };
    guessButton.addEventListener('click', () => {
        const userGuess = Number(guessInput.value);
        // Validate input
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            hintMessage.textContent = 'Please enter a number between 1 and 100.';
            return;
        }
        attempts--;
        if (userGuess === randomNumber) {
            hintMessage.textContent = `Congratulations! You guessed the number! ${userGuess}`;
            guessButton.disabled = true;
            restartButton.classList.remove('hidden');
            showFireworks();
        }
        else if (userGuess < randomNumber) {
            hintMessage.textContent = 'Too low!';
        }
        else {
            hintMessage.textContent = 'Too high!';
        }
        if (attempts > 0) {
            attemptsLeft.textContent = `Attempts left: ${attempts}`;
        }
        else {
            hintMessage.textContent = `Game over! The number was ${randomNumber}.`;
            guessButton.disabled = true;
            restartButton.classList.remove('hidden');
        }
        guessInput.value = '';
    });
    restartButton.addEventListener('click', () => {
        startNewGame();
    });
    // Initialize the game
    startNewGame();
});
