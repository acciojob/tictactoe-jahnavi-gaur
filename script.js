// --- Game State Variables ---
let player1 = { name: 'Player 1', marker: 'x' };
let player2 = { name: 'Player 2', marker: 'o' };
let currentPlayer = player1;
// Array to represent the board state, null for empty, 'x' or 'o' for filled
let boardState = Array(9).fill(null);
let gameActive = false;

// Winning combinations (indices of the board array: 0 to 8)
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- DOM Elements ---
const setupScreen = document.getElementById('player-setup');
const gameBoardScreen = document.getElementById('game-board-screen');
const player1Input = document.getElementById('player-1');
const player2Input = document.getElementById('player-2');
const submitButton = document.getElementById('submit');
const messageElement = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-game');

// --- Functions ---

/**
 * Updates the turn/game over message.
 */
function updateMessage(msg) {
    messageElement.textContent = msg;
}

/**
 * Initializes and starts the game after player names are submitted.
 */
function startGame() {
    // 1. Get and sanitize player names (use defaults if empty)
    const p1Name = player1Input.value.trim() || 'Player 1';
    const p2Name = player2Input.value.trim() || 'Player 2';

    player1.name = p1Name;
    player2.name = p2Name;

    // 2. Switch from setup screen to game board screen
    setupScreen.classList.remove('active');
    gameBoardScreen.classList.add('active');
    gameBoardScreen.classList.remove('hidden');

    // 3. Reset game state and set initial turn
    resetGame();
    gameActive = true;
    updateMessage(`${currentPlayer.name}, you're up!`);
}

/**
 * Handles a click on any of the 9 cells.
 */
function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    // Cell IDs are 1-9, convert to 0-8 index for boardState array
    const cellIndex = parseInt(cell.id) - 1; 

    // Check if the cell is already taken
    if (boardState[cellIndex] !== null) {
        return; 
    }

    // 1. Update board state and cell content
    boardState[cellIndex] = currentPlayer.marker;
    cell.textContent = currentPlayer.marker.toUpperCase(); // Display X or O
    cell.classList.add(currentPlayer.marker); // Add class for styling

    // 2. Check for win
    if (checkWin()) {
        // Winning message: {username} congratulations you won!
        updateMessage(`${currentPlayer.name}, congratulations you won! 🎉`);
        gameActive = false;
        restartButton.classList.remove('hidden');
        return;
    }

    // 3. Check for draw (only if no win)
    if (checkDraw()) {
        updateMessage("It's a draw! 🤝");
        gameActive = false;
        restartButton.classList.remove('hidden');
        return;
    }

    // 4. Switch turns
    switchTurn();
}

/**
 * Switches the current player and updates the message.
 */
function switchTurn() {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    updateMessage(`${currentPlayer.name}, you're up`);
}

/**
 * Checks all win patterns against the current board state.
 */
function checkWin() {
    const marker = currentPlayer.marker;
    return winPatterns.some(pattern => {
        // Check if all three cells in the pattern match the current player's marker
        return pattern.every(index => boardState[index] === marker);
    });
}

/**
 * Checks if the board is full.
 */
function checkDraw() {
    // Check if every cell is filled (not null)
    return boardState.every(cell => cell !== null);
}

/**
 * Resets the game board and state for a new round.
 */
function resetGame() {
    boardState = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    // Player 1 (X) always starts
    currentPlayer = player1;
    updateMessage(`${currentPlayer.name}, you're up!`);
    gameActive = true;
    restartButton.classList.add('hidden');
}


// --- Event Listeners ---

// 1. Start Game Button
submitButton.addEventListener('click', startGame);

// 2. Cell Clicks (to make a move)
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// 3. Restart Button (Optional but useful)
restartButton.addEventListener('click', resetGame);