const playerInput = document.querySelector(".player-input");
const gameBoard = document.querySelector(".game-board");
const message = document.querySelector(".message");
const cells = document.querySelectorAll(".cell");
const submitBtn = document.getElementById("submit");

let player1 = "";
let player2 = "";
let currentPlayer = "";
let currentSymbol = "X";
let board = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

submitBtn.addEventListener("click", () => {
  const p1 = document.getElementById("player-1").value.trim();
  const p2 = document.getElementById("player-2").value.trim();

  if (p1 === "" || p2 === "") {
    alert("Please enter names for both players!");
    return;
  }

  player1 = p1;
  player2 = p2;
  currentPlayer = player1;

  playerInput.style.display = "none";
  gameBoard.style.display = "block";
  message.textContent = `${currentPlayer}, you're up`;
});

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (cell.textContent !== "" || checkWinner()) return;

    cell.textContent = currentSymbol;
    board[index] = currentSymbol;

    if (checkWinner()) {
      message.textContent = `${currentPlayer}, congratulations you won!`;
      highlightWinningCells();
      return;
    }

    currentSymbol = currentSymbol === "X" ? "O" : "X";
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    message.textContent = `${currentPlayer}, you're up`;
  });
});

function checkWinner() {
  return winningCombinations.some(comb => {
    const [a,b,c] = comb;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function highlightWinningCells() {
  winningCombinations.forEach(comb => {
    const [a,b,c] = comb;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.getElementById(a+1).classList.add("winner");
      document.getElementById(b+1).classList.add("winner");
      document.getElementById(c+1).classList.add("winner");
    }
  });
}
