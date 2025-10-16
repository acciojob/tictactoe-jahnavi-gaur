const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const board = document.getElementById('game-board');
const cells = Array.from(document.querySelectorAll('.cell'));
const playAgainBtn = document.getElementById('play-again');

let player1 = '';
let player2 = '';
let currentPlayer = '';
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
  player1 = player1Input.value.trim() || 'Player1';
  player2 = player2Input.value.trim() || 'Player2';
  currentPlayer = player1;
  currentSymbol = 'x';
  gameActive = true;

  document.getElementById('player-setup').style.display = 'none';
  board.style.visibility = 'visible';
  playAgainBtn.style.display = 'none';

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });

  // ✅ update synchronously so Cypress sees message instantly
  setMessage(`${currentPlayer}, you're up`);
}

function handleCellClick(e) {
  if (!gameActive) return;
  const cell = e.currentTarget;
  if (cell.textContent !== '') return;

  cell.textContent = currentSymbol;

  if (checkWin()) {
    setMessage(`${currentPlayer} congratulations you won!`);
    highlightWin();
    gameActive = false;
    playAgainBtn.style.display = 'inline-block';
    return;
  }

  if (cells.every(c => c.textContent !== '')) {
    setMessage("It's a Draw!");
    gameActive = false;
    playAgainBtn.style.display = 'inline-block';
    return;
  }

  if (currentPlayer === player1) {
    currentPlayer = player2;
    currentSymbol = 'o';
  } else {
    currentPlayer = player1;
    currentSymbol = 'x';
  }

  setMessage(`${currentPlayer}, you're up`);
}

function checkWin() {
  return WIN_COMBOS.some(([a, b, c]) => {
    const valA = document.getElementById(a).textContent;
    const valB = document.getElementById(b).textContent;
    const valC = document.getElementById(c).textContent;
    return valA && valA === valB && valB === valC;
  });
}

function highlightWin() {
  WIN_COMBOS.forEach(([a, b, c]) => {
    const valA = document.getElementById(a).textContent;
    const valB = document.getElementById(b).textContent;
    const valC = document.getElementById(c).textContent;
    if (valA && valA === valB && valB === valC) {
      [a, b, c].forEach(id =>
        document.getElementById(id).classList.add('winner')
      );
    }
  });
}

function resetGame() {
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
  });
  currentPlayer = player1;
  currentSymbol = 'x';
  gameActive = true;
  setMessage(`${player1}, you're up`);
  playAgainBtn.style.display = 'none';
}

submitBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
