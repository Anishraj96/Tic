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
  statusElement.textContent = "AI's turn...";
  setTimeout(aiMove, 500);
}

function aiMove() {
  let available = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  if (available.length === 0) return;
  let move = available[Math.floor(Math.random() * available.length)];
  board[move] = "O";
  renderBoard();
  if (checkWinner("O")) {
    statusElement.textContent = "AI wins!";
    gameOver = true;
    return;
  }
  if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
    return;
  }
  statusElement.textContent = "Your turn (X)";
}

function checkWinner(player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  return wins.some(combo => combo.every(i => board[i] === player));
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusElement.textContent = "Your turn (X)";
  renderBoard();
}

renderBoard();
