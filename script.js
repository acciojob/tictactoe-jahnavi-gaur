// Strict, deterministic behavior expected by Cypress tests

const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const board = document.getElementById('game-board');
const cells = Array.from(document.querySelectorAll('.cell'));

let player1 = '';
let player2 = '';
let currentPlayerName = '';
let currentSymbol = 'x'; // lowercase as tests expect
let gameActive = false;

const WIN_COMBOS = [
  [1,2,3],[4,5,6],[7,8,9],
  [1,4,7],[2,5,8],[3,6,9],
  [1,5,9],[3,5,7]
];

function setMessage(text) {
  messageDiv.textContent = text;
}

/**
 * Start the game: collect names, show board, initialize state.
 * NOTE: we set inline sizes and force reflow to guarantee Cypress can click.
 */
function startGame() {
  player1 = (player1Input.value || '').trim() || 'Player1';
  player2 = (player2Input.value || '').trim() || 'Player2';

  // hide setup form
  const setupDiv = document.getElementById('player-setup');
  setupDiv.style.display = 'none';

  // Make board visible in a robust way:
  // - ensure display grid (in case CSS is overridden)
  // - ensure container height is set (already set in CSS), set again inline to override any reset
  board.style.display = 'grid';
  board.style.visibility = 'visible';
  board.style.height = '300px';

  // Force definitive cell heights inline (override external CSS if needed)
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';            // remove marks/winner classes
    c.style.height = '100px';        // explicit inline height for test reliability
  });

  // Initialize state
  currentPlayerName = player1;
  currentSymbol = 'x';
  gameActive = true;

  // FIX: Use a microtask to update the message, ensuring it runs after all
  // synchronous DOM manipulations are complete, which is safer for Cypress.
  Promise.resolve().then(() => {
    setMessage(`${player1}, you're up`);
  });


  // Force reflow so the browser has painted before Cypress continues
  // This helps the test runner see the computed sizes immediately.
  void board.offsetHeight;
}

// cell click handler
function handleCellClick(e) {
  if (!gameActive) return;
  const el = e.currentTarget;   // event listener attached on element
  if (el.textContent !== '') return; // already played

  // Put symbol (lowercase)
  el.textContent = currentSymbol;
  el.classList.add(currentSymbol === 'x' ? 'x-mark' : 'o-mark');

  // Check for win
  if (checkWin()) {
    setMessage(`${currentPlayerName} congratulations you won!`);
    gameActive = false;
    return;
  }

  // Check draw
  if (cells.every(c => c.textContent !== '')) {
    setMessage("It's a Draw!");
    gameActive = false;
    return;
  }

  // Switch player
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

// Attach listeners
submitBtn.addEventListener('click', startGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Safety: allow keyboard to play for accessibility (optional)
cells.forEach(cell => {
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cell.click();
    }
  });
});

// Ensure initial board hidden but layout still calculable if needed
document.addEventListener('DOMContentLoaded', () => {
  board.style.display = 'grid';      // grid exists
  board.style.visibility = 'hidden'; // initially hidden
  // make sure cells have default explicit height in case inline is missing
  cells.forEach(c => {
    c.style.height = '100px';
  });
});