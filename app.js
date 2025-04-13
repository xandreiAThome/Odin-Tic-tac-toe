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
    if (board[row][col].getValue() === "0") {
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
  let value = "0";
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
  };
}

function ScreenController() {}

const b = GameController();
b.playRound(0, 0);
b.playRound(1, 0);
b.playRound(2, 0);
b.playRound(0, 2);
b.playRound(1, 2);
b.playRound(2, 2);
b.playRound(0, 1);
b.playRound(1, 1);
b.playRound(2, 1);
