"use strict";
const boardSize = 4; // Board is 4x4
let board = [];
let score = 0;
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
// Initialize the game board
function initializeBoard() {
    board = Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0));
    // Add two initial tiles
    addRandomTile();
    addRandomTile();
    updateBoard();
}
// Function to add a random tile (2 or 4) to an empty spot
function addRandomTile() {
    const emptyTiles = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0)
                emptyTiles.push({ r, c });
        }
    }
    if (emptyTiles.length > 0) {
        const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}
// Update the DOM to reflect the current state of the board
function updateBoard() {
    gameBoard.innerHTML = "";
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (board[r][c] !== 0) {
                tile.textContent = board[r][c].toString();
                tile.setAttribute("data-value", board[r][c].toString());
            }
            gameBoard.appendChild(tile);
        }
    }
    scoreDisplay.textContent = score.toString();
}
// Handle tile movement and merging in the specific direction
function slide(row) {
    const newRow = row.filter(value => value !== 0); // Remove zeroes
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
        }
    }
    return newRow.filter(value => value !== 0).concat(Array(boardSize - newRow.length).fill(0));
}
function rotateBoard() {
    board = board[0].map((_, i) => board.map(row => row[i]).reverse());
}
// Slide and merge in the specific direction
function move(direction) {
    let moved = false;
    if (direction === "right" || direction === "left") {
        for (let r = 0; r < boardSize; r++) {
            const original = [...board[r]];
            board[r] = direction === "left" ? slide(board[r]) : slide(board[r].reverse()).reverse();
            if (original.toString() !== board[r].toString())
                moved = true;
        }
    }
    else {
        // Handle up and down movement by rotating the board
        rotateBoard();
        moved = move("left"); // Recur for "left" movement after rotating the board
        rotateBoard(); // Undo the rotation
        rotateBoard();
        rotateBoard();
    }
    if (moved) {
        addRandomTile();
        updateBoard();
    }
    return moved; // Return true if tiles were moved
}
// Check for win (reaching 2048 tile)
function checkWin() {
    return board.some(row => row.includes(2048));
}
// Event listener for keypress (arrow keys)
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            move("up");
            break;
        case "ArrowDown":
            move("down");
            break;
        case "ArrowLeft":
            move("left");
            break;
        case "ArrowRight":
            move("right");
            break;
    }
    if (checkWin()) {
        alert("You win!");
    }
});
// Start the game
initializeBoard();
