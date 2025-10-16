const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const board = document.getElementById('game-board');
const cells = Array.from(document.querySelectorAll('.cell'));
const playAgainBtn = document.getElementById('play-again');

let player1 = '';
let player2 = '';
let currentPlayerName = '';
let currentSymbol = 'x';
let gameActive = false;

const WIN_COMBOS = [
  [1,2,3],[4,5,6],[7,8,9],
  [1,4,7],[2,5,8],[3,6,9],
  [1,5,9],[3,5,7]
];

function setMessage(text) {
  messageDiv.textContent = text;
}

function startGame() {
  player1 = (player1Input.value || '').trim() || 'Player1';
  player2 = (player2Input.value || '').trim() || 'Player2';

  document.getElementById('player-setup').style.display = 'none';

  board.style.display = 'grid';
  board.style.visibility = 'visible';
  board.style.height = '300px';
  board.style.minHeight = '300px'; // ✅ ensures nonzero height for Cypress

  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
    c.style.height = '100px';
  });

  currentPlayerName = player1;
  currentSymbol = 'x';
  gameActive = true;
  playAgainBtn.style.display = 'none';

  Promise.resolve().then(() => setMessage(`${player1}, you're up`));
  void board.offsetHeight; // force reflow
}

function handleCellClick(e) {
  if (!gameActive) return;
  const cell = e.currentTarget;
  if (cell.textContent !== '') return;

  cell.textContent = currentSymbol;
  cell.classList.add(currentSymbol === 'x' ? 'x-mark' : 'o-mark');

  if (checkWin()) {
    setMessage(`${currentPlayerName} congratulations you won!`);
    gameActive = false;
    highlightWin();
    playAgainBtn.style.display = 'inline-block';
    return;
  }

  if (cells.every(c => c.textContent !== '')) {
    setMessage("It's a Draw!");
    gameActive = false;
    playAgainBtn.style.display = 'inline-block';
    return;
  }

  if (currentPlayerName === player1) {
    currentPlayerName = player2;
    currentSymbol = 'o';
  } else {
    currentPlayerName = player1;
    currentSymbol = 'x';
  }

  setMessage(`${currentPlayerName}, you're up`);
}

function checkWin() {
  return WIN_COMBOS.some(([a,b,c]) => {
    const aVal = document.getElementById(String(a)).textContent;
    const bVal = document.getElementById(String(b)).textContent;
    const cVal = document.getElementById(String(c)).textContent;
    return aVal && aVal === bVal && bVal === cVal && aVal === currentSymbol;
  });
}

function highlightWin() {
  WIN_COMBOS.forEach(([a,b,c]) => {
    const aVal = document.getElementById(String(a)).textContent;
    const bVal = document.getElementById(String(b)).textContent;
    const cVal = document.getElementById(String(c)).textContent;
    if (aVal && aVal === bVal && bVal === cVal) {
      [a,b,c].forEach(id => document.getElementById(String(id)).classList.add('winner'));
    }
  });
}

function resetGame() {
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
  });
  currentPlayerName = player1;
  currentSymbol = 'x';
  gameActive = true;
  setMessage(`${player1}, you're up`);
  playAgainBtn.style.display = 'none';
}

submitBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
cells.forEach(cell => {
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cell.click();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  board.style.display = 'grid';
  board.style.visibility = 'hidden';
  cells.forEach(c => (c.style.height = '100px'));
});
