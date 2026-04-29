const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusText = document.getElementById('status');
const scoreXText = document.getElementById('scoreX');
const scoreOText = document.getElementById('scoreO');
const drawsText = document.getElementById('draws');
const restartRoundBtn = document.getElementById('restartRound');
const resetScoreBtn = document.getElementById('resetScore');

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let gameState = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
const score = { X: 0, O: 0, draws: 0 };

function updateStatus(message) {
  statusText.textContent = message;
}

function updateScores() {
  scoreXText.textContent = `X: ${score.X}`;
  scoreOText.textContent = `O: ${score.O}`;
  drawsText.textContent = `Draws: ${score.draws}`;
}

function checkWinner() {
  for (const [a, b, c] of winningCombos) {
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return { winner: gameState[a], combo: [a, b, c] };
    }
  }

  if (gameState.every(cell => cell !== '')) {
    return { winner: 'draw', combo: [] };
  }

  return null;
}

function endRound(result) {
  gameActive = false;

  if (result.winner === 'draw') {
    score.draws += 1;
    updateStatus("It's a draw!");
  } else {
    score[result.winner] += 1;
    updateStatus(`Player ${result.winner} wins!`);
    result.combo.forEach(index => cells[index].classList.add('winner'));
  }

  updateScores();
}

function handleCellClick(event) {
  const button = event.target;
  const index = Number(button.dataset.index);

  if (!gameActive || gameState[index]) {
    return;
  }

  gameState[index] = currentPlayer;
  button.textContent = currentPlayer;
  button.classList.add('filled');

  const result = checkWinner();
  if (result) {
    endRound(result);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function restartRound() {
  gameState = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('filled', 'winner');
  });

  updateStatus("Player X's turn");
}

function resetScore() {
  score.X = 0;
  score.O = 0;
  score.draws = 0;
  updateScores();
  restartRound();
}

board.addEventListener('click', handleCellClick);
restartRoundBtn.addEventListener('click', restartRound);
resetScoreBtn.addEventListener('click', resetScore);

updateScores();
