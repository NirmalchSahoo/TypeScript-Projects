"use strict";
// Grab elements from the DOM
const canvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
// Snake properties
const snake = [{ x: 200, y: 200 }];
let dx = 20;
let dy = 0;
let food = { x: 0, y: 0 };
let bigFood = { x: -1, y: -1 }; // Initially off-screen
let score = 0;
let gameSpeed = 250;
let isPaused = false;
let gameRunning = false; // Track if the game has started
let foodCount = 0; // Track how many times food is eaten
let bigFoodTimer = null; // Timer for big food
// Initialize event listeners for buttons
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
// Initialize game loop (but only start after the start button is clicked)
let gameInterval;
function startGame() {
    if (gameRunning)
        return; // Prevent restarting if already running
    gameRunning = true;
    isPaused = false;
    startBtn.disabled = true; // Disable start button when game is running
    resetGame();
    document.addEventListener('keydown', changeDirection);
    gameInterval = window.setInterval(gameLoop, gameSpeed);
}
// Game loop that runs on each interval
function gameLoop() {
    if (isPaused)
        return;
    if (checkCollision())
        return endGame();
    moveSnake();
    drawGame();
}
// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    // Check if snake eats the normal food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreElement.textContent = score.toString();
        placeFood();
        foodCount++; // Increment food counter
        checkForBigFood();
    }
    else if (snake[0].x === bigFood.x && snake[0].y === bigFood.y) {
        score += 50; // Higher score for big food
        scoreElement.textContent = score.toString();
        bigFood = { x: -1, y: -1 }; // Hide big food
    }
    else {
        snake.pop(); // Move by removing the tail
    }
}
// Draw the game (snake, food, and big food)
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#f9c74f' : '#90be6d';
        ctx.fillRect(segment.x, segment.y, 20, 20);
        ctx.strokeStyle = '#2a9d8f';
        ctx.strokeRect(segment.x, segment.y, 20, 20);
    });
    // Draw food
    ctx.fillStyle = '#e76f51';
    ctx.fillRect(food.x, food.y, 20, 20);
    // Draw big food if it exists
    if (bigFood.x !== -1 && bigFood.y !== -1) {
        ctx.fillStyle = '#f72585'; // Distinct color for big food
        ctx.fillRect(bigFood.x, bigFood.y, 30, 30); // Slightly larger size
    }
}
// Place food randomly
function placeFood() {
    const gridSize = 20;
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}
// Check and spawn big food after 5 normal food consumptions
function checkForBigFood() {
    if (foodCount === 5) {
        foodCount = 0; // Reset food count
        spawnBigFood();
        // Remove big food after 5 seconds
        bigFoodTimer = window.setTimeout(() => {
            bigFood = { x: -1, y: -1 }; // Hide big food
        }, 5000);
    }
}
// Spawn big food at a random location
function spawnBigFood() {
    const gridSize = 20;
    bigFood.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    bigFood.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}
// Change snake direction
function changeDirection(event) {
    if (isPaused || !gameRunning)
        return; // Don't move the snake while paused or before starting
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -20;
    }
    else if (keyPressed === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 20;
    }
    else if (keyPressed === 'ArrowLeft' && dx === 0) {
        dx = -20;
        dy = 0;
    }
    else if (keyPressed === 'ArrowRight' && dx === 0) {
        dx = 20;
        dy = 0;
    }
}
// Toggle the pause state of the game
function togglePause() {
    if (!gameRunning)
        return; // Can't pause if the game hasn't started
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}
// Reset the game to the initial state
function resetGame() {
    snake.length = 1;
    snake[0] = { x: 200, y: 200 };
    dx = 20;
    dy = 0;
    score = 0;
    scoreElement.textContent = score.toString();
    foodCount = 0;
    placeFood();
    bigFood = { x: -1, y: -1 }; // Hide big food initially
    if (bigFoodTimer)
        clearTimeout(bigFoodTimer); // Clear any previous big food timers
}
// Check for collisions (with walls or itself)
function checkCollision() {
    const head = snake[0];
    // Check wall collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    // Check self-collisions
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}
// End the game
function endGame() {
    alert('Game Over');
    clearInterval(gameInterval);
    gameRunning = false;
    startBtn.disabled = false; // Enable start button after the game ends
    pauseBtn.textContent = 'Pause'; // Reset pause button text
}
