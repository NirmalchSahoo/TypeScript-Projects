const words: string[] = ["developer", "typescript", "responsive", "framework", "backend"];
let selectedWord: string;
let guessedLetters: string[] = [];
let wrongGuesses: number = 0;
const maxGuesses = 6;

// Get elements
const wordContainer = document.getElementById('wordContainer')!;
const letterInput = document.getElementById('letterInput') as HTMLInputElement;
const guessBtn = document.getElementById('guessBtn')!;
const restartBtn = document.getElementById('restartBtn')!;
const message = document.getElementById('message')!;
const canvas = document.getElementById('hangmanCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Initialize canvas for drawing
canvas.width = 200;
canvas.height = 300;

// Function to start the game
function startGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    letterInput.value = "";
    message.textContent = "";
    restartBtn.style.display = "none";
    drawHangman(0);
    displayWord();
}

// Function to display the word with guessed letters
function displayWord() {
    wordContainer.innerHTML = selectedWord
        .split("")
        .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
}

// Function to handle guessing
function handleGuess() {
    const guess = letterInput.value.toLowerCase();
    if (guess && !guessedLetters.includes(guess)) {
        guessedLetters.push(guess);

        if (selectedWord.includes(guess)) {
            displayWord();
            checkWin();
        } else {
            wrongGuesses++;
            drawHangman(wrongGuesses);
            checkLoss();
        }
    }
    letterInput.value = "";
}

// Function to check if the player has won
function checkWin() {
    if (selectedWord.split("").every(letter => guessedLetters.includes(letter))) {
        message.textContent = "You won!";
        restartBtn.style.display = "block";
    }
}

// Function to check if the player has lost
function checkLoss() {
    if (wrongGuesses >= maxGuesses) {
        message.textContent = `You lost! The word was: ${selectedWord}`;
        restartBtn.style.display = "block";
    }
}

// Function to draw the hangman based on wrong guesses
function drawHangman(wrongGuesses: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#000";
    ctx.lineWidth = 5;

    // Draw base
    if (wrongGuesses > 0) {
        ctx.fillRect(20, 280, 150, 10);
        ctx.fillRect(45, 50, 10, 230);
        ctx.fillRect(45, 50, 100, 10);
    }

    // Draw rope and head
    if (wrongGuesses > 1) {
        ctx.fillRect(145, 50, 2, 30);
        ctx.beginPath();
        ctx.arc(146, 100, 15, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Draw body
    if (wrongGuesses > 2) {
        ctx.fillRect(145, 115, 2, 70);
    }

    // Draw arms
    if (wrongGuesses > 3) {
        ctx.moveTo(145, 140);
        ctx.lineTo(120, 110);
        ctx.stroke();
    }

    if (wrongGuesses > 4) {
        ctx.moveTo(145, 140);
        ctx.lineTo(170, 110);
        ctx.stroke();
    }

    // Draw legs
    if (wrongGuesses > 5) {
        ctx.moveTo(145, 180);
        ctx.lineTo(130, 220);
        ctx.stroke();
        ctx.moveTo(145, 180);
        ctx.lineTo(160, 220);
        ctx.stroke();
    }
}

// Event listeners
guessBtn.addEventListener("click", handleGuess);
restartBtn.addEventListener("click", startGame);

// Start game on load
startGame();
