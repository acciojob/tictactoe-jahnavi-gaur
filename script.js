const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const board = document.getElementById('game-board');
const cells = Array.from(document.querySelectorAll('.cell'));

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
  board.style.visibility = 'visible';
  board.style.display = 'grid';

  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
  });

  currentPlayerName = player1;
  currentSymbol = 'x';
  gameActive = true;
  setMessage(`${player1}, you're up`);
}

function handleCellClick(e) {
  if (!gameActive) return;
  const el = e.currentTarget;
  if (el.textContent !== '') return;

  el.textContent = currentSymbol;
  el.classList.add(currentSymbol === 'x' ? 'x-mark' : 'o-mark');

  if (checkWin()) {
    setMessage(`${currentPlayerName} congratulations you won!`);
    gameActive = false;
    return;
  }

  if (cells.every(c => c.textContent !== '')) {
    setMessage("It's a Draw!");
    gameActive = false;
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

submitBtn.addEventListener('click', startGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Optional keyboard control for accessibility
cells.forEach(cell => {
  cell.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cell.click();
    }
  });
});
