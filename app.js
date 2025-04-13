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

function GameController() {
  const players = [
    { name: "Player 1", value: "X" },
    { name: "Player 2", value: "O" },
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
  - new game
  - allow custom player name
  - start/restart button
  - 
*/
function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.getElementById("player-turn");
  const boardDiv = document.getElementById("board-container");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const currPlayer = game.getCurrPlayer();
    const winner = game.getWinner();

    if (winner === "draw") {
      playerTurnDiv.textContent = "Game Tied";
    } else if (winner) {
      playerTurnDiv.textContent = `${winner} won`;
    } else {
      playerTurnDiv.textContent = `${currPlayer.name}'s turn`;
    }

    if (game)
      board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellBtn = document.createElement("button");
          cellBtn.classList.add("cell");
          cellBtn.dataset.col = colIndex;
          cellBtn.dataset.row = rowIndex;
          cellBtn.textContent = cell.getValue();
          boardDiv.appendChild(cellBtn);
        })
      );
  };

  function handleClick(e) {
    const data = e.target.dataset;
    game.playRound(data.row, data.col);
    updateScreen();
  }

  boardDiv.addEventListener("click", handleClick);

  // init render
  updateScreen();
}

ScreenController();
