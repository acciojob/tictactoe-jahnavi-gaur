let player1Name = '';
let player2Name = '';
let currentPlayer = 'x';
let gameActive = false;
let board = Array(9).fill('');
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// DOM Elements
const setupDiv = document.querySelector('#player-setup');
const gameBoardDiv = document.querySelector('#game-board');
const messageDiv = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.querySelector('#restart-btn');

// ✅ Start Game — updates message immediately
function startGame() {
  player1Name = document.querySelector('#player1').value.trim() || 'Player1';
  player2Name = document.querySelector('#player2').value.trim() || 'Player2';

  // Make sure message is visible instantly for Cypress
  setupDiv.style.display = 'block';
  gameBoardDiv.style.display = 'block';

  board.fill('');
  currentPlayer = 'x';
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  restartBtn.style.display = 'none';

  // ✅ Cypress waits for this text — must happen synchronously
  messageDiv.textContent = `${player1Name}, you're up`;
}

// Update Message
function updateMessage(text) {
  messageDiv.textContent = text;
}

// Handle Clicks
function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.id) - 1;
  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkForWin()) {
    const winner = currentPlayer === 'x' ? player1Name : player2Name;
    updateMessage(`${winner} congratulations you won!`);
    gameActive = false;
    restartBtn.style.display = 'block';
  } else if (board.every(c => c !== '')) {
    updateMessage("It's a Draw!");
    gameActive = false;
    restartBtn.style.display = 'block';
  } else {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    const next = currentPlayer === 'x' ? player1Name : player2Name;
    updateMessage(`${next}, you're up`);
  }
}

// Win Check
function checkForWin() {
  return WINNING_COMBINATIONS.some(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}

// Restart Game
function restartGame() {
  startGame();
  updateMessage(`${player1Name}, you're up`);
}

// Event Listeners
document.getElementById('submit').addEventListener('click', startGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
