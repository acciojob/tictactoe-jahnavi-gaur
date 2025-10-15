const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');

let player1 = '';
let player2 = '';
let currentPlayer = '';
let currentSymbol = 'x';
let gameActive = false;

submitBtn.addEventListener('click', () => {
  player1 = player1Input.value.trim();
  player2 = player2Input.value.trim();

  if (player1 === '' || player2 === '') {
    alert('Please enter both player names');
    return;
  }

  document.querySelector('.form').style.display = 'none';
  board.style.display = 'grid';  // ✅ ensures board visible for Cypress
  currentPlayer = player1;
  messageDiv.textContent = `${currentPlayer}, you're up`;
  gameActive = true;
});

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (!gameActive || cell.textContent !== '') return;

    cell.textContent = currentSymbol;

    if (checkWin()) {
      messageDiv.textContent = `${currentPlayer} congratulations you won!`;
      gameActive = false;
      return;
    }

    if (isDraw()) {
      messageDiv.textContent = `It's a draw!`;
      gameActive = false;
      return;
    }

    if (currentPlayer === player1) {
      currentPlayer = player2;
      currentSymbol = 'o';
    } else {
      currentPlayer = player1;
      currentSymbol = 'x';
    }

    messageDiv.textContent = `${currentPlayer}, you're up`;
  });
});

function checkWin() {
  const winPatterns = [
    [1,2,3],[4,5,6],[7,8,9],
    [1,4,7],[2,5,8],[3,6,9],
    [1,5,9],[3,5,7]
  ];

  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return (
      document.getElementById(a).textContent === currentSymbol &&
      document.getElementById(b).textContent === currentSymbol &&
      document.getElementById(c).textContent === currentSymbol
    );
  });
}

function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}
