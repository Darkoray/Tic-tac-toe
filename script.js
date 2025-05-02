('use strict');

//# Game Setup
// DOM Elements
const winnerBar = document.querySelector('.winner-bar');
const cells = document.querySelectorAll('.cell');
const btn = document.querySelector('.btn');
const instruction = document.querySelector('.instructions');

// Players
const playerO = {
  moves: [],
  shape: 'circle',
  name: 'Player O',
};

const playerX = {
  moves: [],
  shape: 'close',
  name: 'Player X',
};

// Winning combinations
const combos = [
  //Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [6, 4, 2],
];

let currentPlayer, gameOver;

//# Functions
// Displays instructions
function displayInstruction(msg) {
  instruction.textContent = msg;
}

// Selects a specific Cell
function cellNumber(number) {
  return document.querySelector(`.cell--${number}`);
}

// Selects a specific Move
function moveNumber(number) {
  return document.querySelector(`.move--${number}`);
}

// switches player
function switchPlayer() {
  if (currentPlayer === playerO) currentPlayer = playerX;
  else if (currentPlayer === playerX) currentPlayer = playerO;
}

// Checks if the cell is legal
function legalCell(cell) {
  if (cellNumber(cell).classList.contains('cell-legal')) return true;
  else return false;
}

function endGame() {
  gameOver = true;
  btn.classList.add('btn--style');

  instruction.classList.add(`winner--${checkWinner().winningShape}`);
}

//* Checks winner
function checkWinner() {
  for (let i = 0; i < combos.length; i++) {
    const [a, b, c] = combos[i];

    // Checks all 3 winning spots in the combos
    if (
      currentPlayer.moves.includes(a) &&
      currentPlayer.moves.includes(b) &&
      currentPlayer.moves.includes(c)
    ) {
      gameOver = true;
      return {
        winnerPlayer: currentPlayer.name,
        winningShape: currentPlayer.shape,
        winningCombo: combos[i],
      };
    }
  }

  return (gameOver = false);
}

//* Checks for draw
function checkDraw() {
  if (playerO.moves.length + playerX.moves.length === 9) {
    return true;
  } else return false;
}

// Finds the winning combo and displays
function displayWinningBar(combo) {
  let rotateValue, insetValue;

  combo = String(combo);
  switch (combo) {
    //Rows
    case '0,1,2':
      rotateValue = '90deg';
      insetValue = {
        bottom: '34%',
      };
      break;
    case '3,4,5':
      rotateValue = '90deg';
      insetValue = {};
      break;
    case '6,7,8':
      rotateValue = '90deg';
      insetValue = {
        top: '34%',
      };
      break;

    // Columns
    case '0,3,6':
      rotateValue = '0deg';
      insetValue = {
        left: '14%',
      };
      break;
    case '1,4,7':
      rotateValue = '0deg';
      insetValue = {};
      break;
    case '2,5,8':
      rotateValue = '0deg';
      insetValue = {
        right: '14%',
      };
      break;

    // Diagonals
    case '0,4,8':
      rotateValue = '-45deg';
      insetValue = {};
      break;
    case '6,4,2':
      rotateValue = '45deg';
      insetValue = {};
      break;
  }

  if (checkWinner().winnerPlayer === playerO.name)
    winnerBar.classList.add(`winner-bar--${playerO.shape}`);
  else if (checkWinner().winnerPlayer === playerX.name)
    winnerBar.classList.add(`winner-bar--${playerX.shape}`);

  winnerBar.classList.remove('hidden');

  winnerBar.style.transform = `rotate(${rotateValue})`;
  winnerBar.style.top = insetValue.top ?? 'auto';
  winnerBar.style.right = insetValue.right ?? 'auto';
  winnerBar.style.bottom = insetValue.bottom ?? 'auto';
  winnerBar.style.left = insetValue.left ?? 'auto';
}

//* Initiates the game
function init() {
  gameOver = false;

  // Setting up the scores
  currentPlayer = playerO;
  playerO.moves = [];
  playerX.moves = [];

  // Setting up the UI
  displayInstruction(`${currentPlayer.name}'s turn. Make your move!`);
  btn.classList.remove('btn--style');
  instruction.classList.remove(
    `winner--${playerO.shape}`,
    `winner--${playerX.shape}`
  );
  winnerBar.classList.remove(
    `winner-bar--${playerO.shape}`,
    `winner-bar--${playerX.shape}`
  );
  winnerBar.classList.add('hidden');

  for (let i = 0; i < cells.length; i++) {
    // Adding legal cells to all to all cells
    cells[i].classList.add('cell-legal');

    // Removing all previous moves
    moveNumber(i).textContent = '';
    moveNumber(i).classList.remove(playerO.shape, playerX.shape);
  }
}

init();

//# Previewing the moves
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener('mouseover', function () {
    if (legalCell(i) && !gameOver) {
      moveNumber(i).textContent = currentPlayer.shape;
      moveNumber(i).classList.add(currentPlayer.shape);
    }
  });

  cells[i].addEventListener('mouseout', function () {
    if (legalCell(i) && !gameOver) {
      moveNumber(i).textContent = '';
      moveNumber(i).classList.remove(currentPlayer.shape);
    }
  });
}

//# Handling player moves
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', function () {
    // Checks if the cell is legal and if the game is still running
    if (legalCell(i) && !gameOver) {
      // Adds up the player's current move to the total moves
      currentPlayer.moves.push(i);

      // Updates the UI
      moveNumber(i).textContent = currentPlayer.shape;
      moveNumber(i).classList.add(currentPlayer.shape);
      cellNumber(i).classList.remove('cell-legal');

      // Checks for winner
      if (checkWinner()) {
        displayInstruction(`${checkWinner().winnerPlayer} won the game`);
        displayWinningBar(checkWinner().winningCombo);
        endGame();
      } else if (checkDraw()) {
        displayInstruction("It's a Draw!");
        endGame();
      } else {
        // Switches to the other player
        switchPlayer();
        displayInstruction(`${currentPlayer.name}'s turn`);
      }
    }
  });
}

//* Starting a new game
btn.addEventListener('click', init);
