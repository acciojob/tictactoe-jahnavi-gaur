// --- Game State Variables ---
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let currentPlayer = 'X'; // X starts first
let gameActive = false;
let board = Array(9).fill(''); // Represents the 9 cells
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- DOM Elements ---
const setupDiv = document.querySelector('#player-setup');
const gameBoardDiv = document.querySelector('#game-board');
const messageDiv = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.querySelector('#restart-btn');

// --- Functions ---

/**
 * Initializes the game state and displays the board.
 */
function startGame() {
    // Get and sanitize player names using the CORRECTED IDs: #player1 and #player2
    player1Name = document.querySelector('#player1').value.trim() || 'Player 1';
    player2Name = document.querySelector('#player2').value.trim() || 'Player 2';
    
    // Switch views
    setupDiv.style.display = 'none';
    gameBoardDiv.style.display = 'block';

    // Reset game state
    board.fill('');
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; // Reset classes (removes x-mark, o-mark, and winner)
    });
    restartBtn.style.display = 'none';

    updateMessage(`${player1Name}, you're up`);
}

/**
 * Updates the turn/win message displayed above the board.
 * @param {string} text The message to display.
 */
function updateMessage(text) {
    messageDiv.textContent = text;
}

/**
 * Handles a cell click event.
 * @param {Event} e The click event.
 */
function handleCellClick(e) {
    const cell = e.target;
    // The ID is 1-indexed, convert to 0-indexed array index
    const clickedCellIndex = parseInt(cell.id) - 1;

    // Check if the cell is already played or if the game is over
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update game state
    board[clickedCellIndex] = currentPlayer;

    // Update UI
    cell.textContent = currentPlayer === 'X' ? 'X' : 'O';
    cell.classList.add(currentPlayer === 'X' ? 'x-mark' : 'o-mark');
    
    // Check for win or draw
    if (checkForWin()) {
        const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
        updateMessage(`${winnerName}, congratulations you won!`);
        gameActive = false;
        restartBtn.style.display = 'block';
    } else if (checkForDraw()) {
        updateMessage("It's a Draw!");
        gameActive = false;
        restartBtn.style.display = 'block';
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        const nextPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
        updateMessage(`${nextPlayerName}, you're up`);
    }
}

/**
 * Checks all winning combinations against the current board state.
 * @returns {boolean} True if a winner is found.
 */
function checkForWin() {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight the winning cells
            document.getElementById(String(a + 1)).classList.add('winner');
            document.getElementById(String(b + 1)).classList.add('winner');
            document.getElementById(String(c + 1)).classList.add('winner');
            return true;
        }
    }
    return false;
}

/**
 * Checks if the board is full without a winner.
 * @returns {boolean} True if the game is a draw.
 */
function checkForDraw() {
    return board.every(cell => cell !== '');
}

/**
 * Resets the game to allow players to play again without renaming.
 */
function restartGame() {
    startGame(); // Re-use startGame to reset everything except names
    // Ensure the message reflects the starting player (X/Player 1)
    updateMessage(`${player1Name}, you're up`);
}


// --- Event Listeners ---

// 1. Start Game button click
document.querySelector('#submit').addEventListener('click', startGame);

// 2. Cell clicks (using event delegation on the cells)
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// 3. Restart button click
restartBtn.addEventListener('click', restartGame);

// Set initial message when the page loads (for the input view)
document.addEventListener('DOMContentLoaded', () => {
    // Hide the game board initially
    gameBoardDiv.style.display = 'none';
});