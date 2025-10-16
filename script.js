// --- Game State Variables ---
let player1 = { name: 'Player 1', marker: 'x' };
let player2 = { name: 'Player 2', marker: 'o' };
let currentPlayer = player1;
// Array to represent the board state, null for empty, 'x' or 'o' for filled
let boardState = Array(9).fill(null);
let gameActive = false;

// Winning combinations (indices of the board array: 0 to 8)
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows (Horizontal wins)
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns (Vertical wins)
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- DOM Elements ---
const setupScreen = document.getElementById('player-setup');
const gameBoardScreen = document.getElementById('game-board-screen');
// Corrected IDs for inputs: player1 and player2
const player1Input = document.getElementById('player1'); 
const player2Input = document.getElementById('player2');
const submitButton = document.getElementById('submit');
const messageElement = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-game');

// --- Functions ---

function updateMessage(msg) {
    messageElement.textContent = msg;
}

function startGame() {
    // 1. Get and sanitize player names
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

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
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
        updateMessage(`${currentPlayer.name} congratulations you won!`);
        gameActive = false;
        restartButton.classList.remove('hidden');
        return;
    }

    // 3. Check for draw (if no win and board is full)
    if (checkDraw()) {
        updateMessage("It's a draw!");
        gameActive = false;
        restartButton.classList.remove('hidden');
        return;
    }

    // 4. Switch turns
    switchTurn();
}

function switchTurn() {
    // Switch to the other player
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    // Update message to match the required format: "PlayerName, you're up"
    updateMessage(`${currentPlayer.name}, you're up`);
}

function checkWin() {
    const marker = currentPlayer.marker;
    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === marker);
    });
}

function checkDraw() {
    return boardState.every(cell => cell !== null);
}

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
submitButton.addEventListener('click', startGame);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', resetGame);