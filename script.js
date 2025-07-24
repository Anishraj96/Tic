const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => playerMove(i));
    boardElement.appendChild(cellElement);
  });
}

function playerMove(index) {
  if (board[index] || gameOver) return;
  board[index] = "X";
  renderBoard();
  if (checkWinner("X")) {
    statusElement.textContent = "You win!";
    gameOver = true;
    return;
  }
  if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
    return;
  }
  statusElement.textContent = "AI is thinking...";
  setTimeout(() => {
    let move = getMediumAIMove(board);
    board[move] = "O";
    renderBoard();
    if (checkWinner("O")) {
      statusElement.textContent = "AI wins!";
      gameOver = true;
    } else if (board.every(cell => cell !== "")) {
      statusElement.textContent = "It's a draw!";
      gameOver = true;
    } else {
      statusElement.textContent = "Your turn (X)";
    }
  }, 400);
}

function getMediumAIMove(boardState) {
  const emptyCells = boardState.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  const useSmartMove = Math.random() < 0.7; // 70% chance to play smart

  if (useSmartMove) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, 0, false);
        boardState[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  } else {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinnerFor(newBoard, "O")) return 10 - depth;
  if (checkWinnerFor(newBoard, "X")) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function checkWinner(player) {
  return checkWinnerFor(board, player);
}

function checkWinnerFor(b, player) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo => combo.every(i => b[i] === player));
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusElement.textContent = "Your turn (X)";
  renderBoard();
}

renderBoard();
