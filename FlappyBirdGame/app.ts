const bird = document.getElementById('bird') as HTMLElement;
const pipesContainer = document.getElementById('pipes-container') as HTMLElement;
const scoreDisplay = document.getElementById('score') as HTMLElement;
const gameOverText = document.getElementById('gameOver') as HTMLElement;

let gravity = 0.5;
let birdVelocity = 0;
let score = 0;
let gameInterval: number | undefined;
let isGameOver = false;

// Initialize bird position and jump on key press
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (isGameOver) {
            resetGame();
        } else {
            birdVelocity = -8; // Jump
        }
    }
});

// Start game loop
function startGame() {
    gameInterval = window.setInterval(gameLoop, 20);
}

// Game loop: moves bird, generates pipes, checks for collision
function gameLoop() {
    birdVelocity += gravity;
    let birdTop = bird.offsetTop + birdVelocity;
    
    if (birdTop <= 0) birdTop = 0;
    if (birdTop >= 560) endGame(); // Bird hits the bottom

    bird.style.top = birdTop + 'px';

    generatePipes();
    movePipes();
    detectCollision();
}

// Generate random pipes
function generatePipes() {
    if (Math.random() < 0.03) { // 3% chance per frame
        const pipeTop = document.createElement('div');
        const pipeBottom = document.createElement('div');

        const pipeHeight = Math.floor(Math.random() * 200) + 100;

        pipeTop.className = 'pipe pipe-top';
        pipeTop.style.height = pipeHeight + 'px';
        pipeTop.style.left = '400px';

        pipeBottom.className = 'pipe pipe-bottom';
        pipeBottom.style.height = (400 - pipeHeight - 150) + 'px'; // 150px gap
        pipeBottom.style.left = '400px';

        pipesContainer.appendChild(pipeTop);
        pipesContainer.appendChild(pipeBottom);
    }
}

// Move pipes and increase score when pipes pass
function movePipes() {
    const pipes = Array.from(document.getElementsByClassName('pipe')) as HTMLElement[];
    
    pipes.forEach((pipe) => {
        let pipeLeft = parseInt(pipe.style.left);
        pipeLeft -= 2; // Pipe movement speed

        if (pipeLeft < -50) { // Remove pipes out of view
            pipe.remove();
            score += 0.5; // Increment score
            scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
        } else {
            pipe.style.left = pipeLeft + 'px';
        }
    });
}

// Detect collision between bird and pipes
function detectCollision() {
    const pipes = Array.from(document.getElementsByClassName('pipe')) as HTMLElement[];
    
    pipes.forEach((pipe) => {
        const birdRect = bird.getBoundingClientRect();
        const pipeRect = pipe.getBoundingClientRect();

        if (
            birdRect.right > pipeRect.left &&
            birdRect.left < pipeRect.right &&
            birdRect.bottom > pipeRect.top &&
            birdRect.top < pipeRect.bottom
        ) {
            endGame();
        }
    });
}

// End game and display game over text
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    gameOverText.style.display = 'block';
}

// Reset the game after game over
function resetGame() {
    isGameOver = false;
    bird.style.top = '250px';
    birdVelocity = 0;
    score = 0;
    scoreDisplay.textContent = `Score: 0`;
    pipesContainer.innerHTML = '';
    gameOverText.style.display = 'none';
    startGame();
}

startGame(); // Initialize game
