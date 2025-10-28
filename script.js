const submitBtn = document.getElementById("submit");
      const player1Input = document.getElementById("player1");
      const player2Input = document.getElementById("player2");
      const playerForm = document.getElementById("player-form");
      const gameArea = document.getElementById("game-area");
      const messageDiv = document.querySelector(".message");
      const cells = document.querySelectorAll(".cell");

      let player1 = "";
      let player2 = "";
      let currentPlayer = "";
      let board = Array(9).fill("");
      let gameOver = false;

      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      submitBtn.addEventListener("click", () => {
        player1 = player1Input.value.trim();
        player2 = player2Input.value.trim();

        if (!player1 || !player2) {
          alert("Please enter names for both players!");
          return;
        }

        currentPlayer = player1;
        playerForm.style.display = "none";
        gameArea.style.display = "block";
        messageDiv.textContent = ${currentPlayer}, you're up;
      });

      cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
          if (gameOver || board[index] !== "") return;

          // Set move
          board[index] = currentPlayer === player1 ? "x" : "o";
          cell.textContent = board[index];

          if (checkWin()) {
            messageDiv.textContent = ${currentPlayer} congratulations you won!;
            gameOver = true;
            return;
          }

          if (!board.includes("")) {
            messageDiv.textContent = "It's a draw!";
            gameOver = true;
            return;
          }

          currentPlayer = currentPlayer === player1 ? player2 : player1;
          messageDiv.textContent = ${currentPlayer}, you're up;
        });
      });

      function checkWin() {
        return winningCombinations.some((combo) => {
          const [a, b, c] = combo;
          return board[a] && board[a] === board[b] && board[b] === board[c];
        });
      }