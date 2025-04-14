function GameBoard() {
  const row = 3;
  const col = 3;
  const board = [];
  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < col; j++) {
      board[i].push(Cell());
    }
  }

  /**
   *
   * @param {string} playerVal X or O
   * @param {int} row 0th indexing
   * @param {int} col 0th indexing
   * @returns
   */
  const markBoard = (playerVal, row, col) => {
    if (!board[row][col].getValue()) {
      //change
      board[row][col].markCell(playerVal);
      return true;
    }
    return false;
  };

  const printBoard = () => {
    const printedBoard = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(printedBoard);
  };

  const getBoard = () => board;

  const getRow = () => row;
  const getCol = () => col;

  return {
    getBoard,
    printBoard,
    markBoard,
    getCol,
    getRow,
  };
}

function Cell() {
  let value = "";
  const markCell = (playerVal) => {
    value = playerVal;
  };

  const getValue = () => value;

  return {
    getValue,
    markCell,
  };
}

function GameController(player1 = "Player 1", player2 = "Player 2") {
  const players = [
    { name: player1, value: "X" },
    { name: player2, value: "O" },
  ];
  const board = GameBoard();

  let currPlayer = players[0];
  let moves = 0;
  let winner = null;

  const nextPlayer = () => {
    currPlayer = currPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrPlayer = () => currPlayer;

  const getWinner = () => winner;

  const checkWinner = (row, col) => {
    const boardArr = board.getBoard();
    // check col
    for (let i = 0; i < board.getRow(); i++) {
      if (boardArr[i][col].getValue() !== currPlayer.value) {
        break;
      }
      if (i === board.getRow() - 1) {
        return currPlayer.name;
      }
    }

    //check row
    for (let i = 0; i < board.getRow(); i++) {
      if (boardArr[row][i].getValue() !== currPlayer.value) {
        break;
      }
      if (i === board.getCol() - 1) {
        return currPlayer.name;
      }
    }

    // check diagonal
    if (row === col) {
      console.log();
      for (let i = 0; i < board.getRow(); i++) {
        if (boardArr[i][i].getValue() !== currPlayer.value) {
          break;
        }
        if (i === board.getRow() - 1) {
          return currPlayer.name;
        }
      }
    }

    // check anti-diagonal
    if (row + col === board.getRow() - 1) {
      for (let i = 0; i < board.getRow(); i++) {
        if (
          boardArr[i][board.getRow() - 1 - i].getValue() !== currPlayer.value
        ) {
          break;
        }

        if (i === board.getRow() - 1) {
          return currPlayer.name;
        }
      }
    }

    // draw
    if (moves === board.getRow() * board.getRow()) return "draw";

    return null;
  };

  const printRound = () => {
    console.log(currPlayer.name + "'s turn");
    board.printBoard();
  };

  const playRound = (row, col) => {
    if (!winner) {
      const succcess = board.markBoard(currPlayer.value, row, col);
      if (!succcess) {
        console.log("cell already marked");
        printRound();
        return;
      }
      moves++;

      winner = checkWinner(row, col);
      if (winner === "draw") {
        console.log("Game END, Players Drawed");
        board.printBoard();
      } else if (winner) {
        console.log("Game END, " + winner + " wins");
        board.printBoard();
      }

      if (!winner) {
        nextPlayer();
        printRound();
      }
    }
  };

  printRound();

  return {
    playRound,
    getBoard: board.getBoard,
    getCurrPlayer,
    getWinner,
  };
}

/*
  make gui board [X]
  make event listener [X]

  todo
  - new game [X]
  - allow custom player name [X]
  - start/restart button [X]
  - 
*/
function ScreenController() {
  let game = GameController();
  const playerTurnDiv = document.getElementById("player-turn");
  const boardDiv = document.getElementById("board-container");
  const gameBtn = document.getElementById("game-btn");
  const player1NameDiv = document.getElementById("player-1");
  const player2NameDiv = document.getElementById("player-2");
  let start = false;

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const currPlayer = game.getCurrPlayer();
    const winner = game.getWinner();

    if (!start) {
      gameBtn.textContent = "Start Game";
    } else {
      gameBtn.textContent = "New Game";
    }

    if (!start) {
      playerTurnDiv.textContent = "Optional: Input Player Name";
    } else if (winner === "draw") {
      playerTurnDiv.textContent = "Game Tied";
    } else if (winner) {
      playerTurnDiv.textContent = `${winner} won`;
    } else {
      playerTurnDiv.textContent = `${currPlayer.name}'s turn`;
    }

    if (winner) {
      start = false;
    }

    if (game)
      board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellBtn = document.createElement("button");
          if (rowIndex === 0) cellBtn.classList.add("cell-border-top");
          if (colIndex === 0) cellBtn.classList.add("cell-border-left");
          cellBtn.classList.add("cell-border");
          cellBtn.classList.add("cell");
          cellBtn.dataset.col = colIndex;
          cellBtn.dataset.row = rowIndex;
          cellBtn.textContent = cell.getValue();
          boardDiv.appendChild(cellBtn);
        })
      );
  };

  function handleClick(e) {
    if (start) {
      const data = e.target.dataset;
      game.playRound(data.row, data.col);
      updateScreen();
    }
  }

  boardDiv.addEventListener("click", handleClick);

  gameBtn.addEventListener("click", (e) => {
    start = true;
    game = GameController(
      player1NameDiv.value ? player1NameDiv.value : "Player 1",
      player2NameDiv.value ? player2NameDiv.value : "Player 2"
    );
    updateScreen();
  });

  // init render
  updateScreen();
}

ScreenController();
