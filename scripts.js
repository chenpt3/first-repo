// Define Player object
const Player = (name = "Player") => {
    let score = 0;
    let active = false;
    let isBot = false;

    const setName = (newName) => name = newName;
    const getName = () => name;
    const getScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;
    const setActive = (newActive) => active = newActive;
    const getActive = () => active;
    const getIsBot = () => isBot;
    const setIsBot = (newIsBot) => isBot = newIsBot;

    return { setName, getName, getScore, incrementScore, resetScore, setActive, getActive, getIsBot, setIsBot };
};

// Define bot module
const BotLogic = (() => {
    const isValidMove = (column, board) => {
        if (column < 0 || column >= board[0].length || board[0][column].getCellOwner() !== false) {
            return false;
        }
        return true;
    };
    const getBotChoice = (difficulty = "4") => {
        let choice;
        if (difficulty === "1") {
            choice = easyChoice();
        } else if (difficulty === "2") {
            choice = mediumChoice();
        } else if (difficulty === "3") {
            choice = hardChoice();
        } else if (difficulty === "4") {
            choice = impossibleChoice();
        };
        return choice;
    };
    const transformBoard = (board) => {
        let newBoard = [];
        for (let i = 0; i < board.length; i++) {
            let row = [];
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].getCellOwner() === "Bot" || board[i][j].getCellOwner() === false) {
                    row.push(board[i][j].getCellOwner());
                } else {
                    row.push("Player");
                };
            };
            newBoard.push(row);
        };
        return getNewBoardCopy(newBoard);
    };
    const getNewBoardCopy = (board) => {
        let newBoard = [];
        for (let i = 0; i < board.length; i++) {
            let row = [];
            for (let j = 0; j < board[i].length; j++) {
                row.push(board[i][j]);
            };
            newBoard.push(row);
        };
        return newBoard;
    };
    let winCon = [
        [[false, false, false, "Bot"], [1]],
        [[false, false, "Bot", false], [1]],
        [[false, "Bot", false, false], [1]],
        [["Bot", false, false, false], [1]],
        [[false, false, false, "Player"], [-1]],
        [[false, false, "Player", false], [-1]],
        [[false, "Player", false, false], [-1]],
        [["Player", false, false, false], [-1]],
        [[false, false, "Bot", "Bot"], [15]],
        [[false, "Bot", false, "Bot"], [12]],
        [["Bot", false, false, "Bot"], [10]],
        [[false, "Bot", "Bot", false], [15]],
        [["Bot", false, "Bot", false], [12]],
        [["Bot", "Bot", false, false], [15]],
        [[false, false, "Player", "Player"], [-15]],
        [[false, "Player", false, "Player"], [-12]],
        [["Player", false, false, "Player"], [-10]],
        [[false, "Player", "Player", false], [-15]],
        [["Player", false, "Player", false], [-12]],
        [["Player", "Player", false, false], [-15]],
        [[false, "Bot", "Bot", "Bot"], [150]],
        [["Bot", false, "Bot", "Bot"], [100]],
        [["Bot", "Bot", false, "Bot"], [100]],
        [["Bot", "Bot", "Bot", false], [100]],
        [[false, "Player", "Player", "Player"], [-150]],
        [["Player", false, "Player", "Player"], [-100]],
        [["Player", "Player", false, "Player"], [-100]],
        [["Player", "Player", "Player", false], [-100]],
        [["Bot", "Bot", "Bot", "Bot"], [1000000000]],
        [["Player", "Player", "Player", "Player"], [-1000000000]]
    ];
    const evaluateBoard = (board) => {
        let tempBoard = getNewBoardCopy(board);
        const rows = tempBoard.length;
        const cols = tempBoard[0].length;
        let score = 0;
        for (let i = 0; i < cols - 3; i++) {
            for (let j = rows - 1; j >= 0; j--) {
                let window = [board[j][i], board[j][i + 1], board[j][i + 2], board[j][i + 3]];
                if (window[0] !== false && window[1] !== false && window[2] !== false && window[3] !== false) {
                    if (j === rows - 1) {
                        score += evaluateWindow(window);
                    } else if (j < rows - 1) {
                        if (board[j + 1][i] !== false && board[j + 1][i + 1] !== false && board[j + 1][i + 2] !== false && board[j + 1][i + 3] !== false) {
                            score += evaluateWindow(window);
                        };
                    };
                };
            };
        };
        for (let i = rows - 1; i >= 3; i--) {
            for (let j = 0; j < cols; j++) {
                let window = [tempBoard[i][j], tempBoard[i - 1][j], tempBoard[i - 2][j], tempBoard[i - 3][j]];
                score += evaluateWindow(window);
            };
        };
        for (let i = rows - 1; i >= 3; i--) {
            for (let j = 0; j < cols - 3; j++) {
                let window1 = [tempBoard[i][j], tempBoard[i - 1][j + 1], tempBoard[i - 2][j + 2], tempBoard[i - 3][j + 3]];
                let window2 = [tempBoard[i - 3][j], tempBoard[i - 2][j + 1], tempBoard[i - 1][j + 2], tempBoard[i][j + 3]];
                score += evaluateWindow(window1);
                score += evaluateWindow(window2);
            };
        };
        return score;
    };
    const evaluateWindow = (window) => {
        let score = 0;
        let windowStr = window.join(",").toString();
        for (let i = 0; i < winCon.length; i++) {
            let con = winCon[i][0].toString();
            let scoreChange = parseInt(winCon[i][1]);
            if (windowStr === con && con !== "false,false,false,false") {
                score += scoreChange;
            };
        };
        return score;
    };
    const insertToken = (column, player, board) => {
        let newBoard = getNewBoardCopy(board);
        for (let i = newBoard.length - 1; i >= 0; i--) {
            if (newBoard[i][column] === false) {
                newBoard[i][column] = player;
                break;
            };
        };
        return newBoard;
    };
    const minimax = (depth, maximizingPlayer, alpha, beta, board, player1Name, player2Name) => {
        let validColumns = getValidColumns(board);
        let terminal = isTerminal(board, player1Name, player2Name);;
        if (depth === 0 || terminal) {
            if (terminal) {
                if (checkIfWin(board, player1Name, player2Name) === 1) {
                    return 1000000000000;
                } else if (checkIfWin(board, player1Name, player2Name) === -1) {
                    return -1000000000000;
                } else {
                    return 0;
                };
            } else {
                return evaluateBoard(board);
            };
        };
        if (maximizingPlayer) {
            let value = -Infinity;
            for (let i = 0; i < validColumns.length; i++) {
                let newBoard = insertToken(validColumns[i], player1Name, board);
                value = Math.max(value, minimax(depth - 1, false, alpha, beta, newBoard, player1Name, player2Name));
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                };
            };
            return value / depth ;
        } else {
            let value = Infinity;
            for (let i = 0; i < validColumns.length; i++) {
                let newBoard = insertToken(validColumns[i], player2Name, board);
                value = Math.min(value, minimax(depth - 1, true, alpha, beta, newBoard, player1Name, player2Name));
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                };
            };
            return value / depth;
        };
    };
    const impossibleChoice = () => {
        let depth = 3;
        let player1Name;
        let player2Name;
        if (GameControls.getCurrentPlayer().getName() === "Bot") {
            player1Name = "Bot";
            player2Name = "Player";
        } else if (GameControls.getCurrentPlayer().getName() === "Player") {
            player1Name = "Player";
            player2Name = "Bot";
        } else {
            return;
        };
        let board = transformBoard(GameControls.getGameBoard().board);
        let validColumns = getValidColumns(board);
        let bestColumn = validColumns[0];
        let bestValue = -Infinity;
        for (let i = 0; i < validColumns.length; i++) {
            let newBoard = insertToken(validColumns[i], player1Name, board);
            let value = minimax(depth, false, -Infinity, Infinity, newBoard, player1Name, player2Name);
            if (value > bestValue) {
                bestValue = value;
                bestColumn = validColumns[i];
            };
        };
        return bestColumn;
    };
    const getValidColumns = (board) => {
        const cols = board[0].length;
        const validColumns = [];
        for (let i = 0; i < cols; i++) {
            if (board[0][i] === false) {
                validColumns.push(i);
            };
        };
        return validColumns;
    };
    const checkIfWin = (board, player1Name, player2Name) => {
        const rows = board.length;
        const cols = board[0].length;
        for (let i = rows - 1; i >= 0; i--) {
            for (let j = 0; j < cols - 3; j++) {
                if (board[i][j] === player1Name && board[i][j + 1] === player1Name && board[i][j + 2] === player1Name && board[i][j + 3] === player1Name) {
                    return 1;
                } else if (board[i][j] === player2Name && board[i][j + 1] === player2Name && board[i][j + 2] === player2Name && board[i][j + 3] === player2Name) {
                    return -1;
                };
            };
        };
        for (let i = rows - 1; i >= 3; i--) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === player1Name && board[i - 1][j] === player1Name && board[i - 2][j] === player1Name && board[i - 3][j] === player1Name) {
                    return 1;
                } else if (board[i][j] === player2Name && board[i - 1][j] === player2Name && board[i - 2][j] === player2Name && board[i - 3][j] === player2Name) {
                    return -1;
                };
            };
        };
        for (let i = rows - 1; i >= 3; i--) {
            for (let j = 0; j < cols - 3; j++) {
                if (board[i][j] === player1Name && board[i - 1][j + 1] === player1Name && board[i - 2][j + 2] === player1Name && board[i - 3][j + 3] === player1Name) {
                    return 1;
                } else if (board[i][j] === player2Name && board[i - 1][j + 1] === player2Name && board[i - 2][j + 2] === player2Name && board[i - 3][j + 3] === player2Name) {
                    return -1;
                } else if (board[i - 3][j] === player1Name && board[i - 2][j + 1] === player1Name && board[i - 1][j + 2] === player1Name && board[i][j + 3] === player1Name) {
                    return 1;
                } else if (board[i - 3][j] === player2Name && board[i - 2][j + 1] === player2Name && board[i - 1][j + 2] === player2Name && board[i][j + 3] === player2Name) {
                    return -1;
                };
            };
        };
        return 0;
    };
    const isTerminal = (board, player1Name, player2Name) => {
        return checkIfWin(board, player1Name, player2Name) !== 0 || getValidColumns(board).length === 0;
    };
    const getEmptyColumns = () => {
        const boardObj = GameControls.getGameBoard();
        const board = boardObj.board;
        const columns = boardObj.columns;
        const emptyColumns = [];
        for (let i = 0; i < columns; i++) {
            if (board[0][i].getCellOwner() === false) {
                emptyColumns.push(i);
            } else {
                continue;
            };
        };
        return emptyColumns;
    };
    const easyChoice = () => {
        const emptyColumns = getEmptyColumns();
        return emptyColumns[Math.floor(Math.random() * emptyColumns.length)];
    }; 
    const mediumChoice = () => {
        let canWin = checkIfThisMoveWins();
        if (canWin !== null && getEmptyColumns().includes(canWin)) {
            return canWin;
        } else {
            return easyChoice();
        };
    };
    const hardChoice = () => {
        let canWin = checkIfThisMoveWins();
        let canBlock = checkIfCanBlockWin();
        if (canWin !== null && getEmptyColumns().includes(canWin)) {
            return canWin;
        } else if (canBlock !== null && getEmptyColumns().includes(canBlock)) {
            // Only block if the bot cannot win in the next move
            if (checkIfThisMoveWins() === null) {
                return canBlock;
            }
        }
        // If neither a winning move nor a blocking move is available, make a random move
        return easyChoice();
    };
    const canWinInDirection = (board, x, y, dx, dy) => {
        let cells = [];
        for (let i = 0; i < 4; i++) {
            if (board[y + i * dy] && board[y + i * dy][x + i * dx]) {
                cells.push(board[y + i * dy][x + i * dx].getCellOwner());
            } else {
                cells.push(null);
            };
        };
        let botCells = cells.filter(owner => owner === "Bot");
        let emptyCells = cells.filter(owner => owner === false);
        if (botCells.length === 3 && emptyCells.length === 1) {
            const potentialWinningMove = x + cells.indexOf(false) * dx;
            // Check if the potential winning move is in a column that is not already filled
            if (isValidMove(potentialWinningMove, board)) {
                return potentialWinningMove;
            }
        };
        return null;
    };
    const checkIfThisMoveWins = () => {
        const boardObj = GameControls.getGameBoard();
        const board = boardObj.board;
        const rows = boardObj.rows;
        const cols = boardObj.columns;
    
        const directions = [
            { dx: 0, dy: 1 }, // vertical
            { dx: 1, dy: 0 }, // horizontal
            { dx: 1, dy: 1 }, // diagonal to the right
            { dx: 1, dy: -1 } // diagonal to the left
        ];
    
        for (let i = rows - 1; i >= 0; i--) {
            for (let j = cols - 1; j >= 0; j--) {
                for (let direction of directions) {
                    const winMove = canWinInDirection(board, j, i, direction.dx, direction.dy);
                    if (winMove !== null) {
                        return winMove;
                    };
                };
            };
        };
    
        return null;
    };
    const canBlockInDirection = (board, x, y, dx, dy) => {
        let cells = [];
        for (let i = 0; i < 4; i++) {
            if (board[y + i * dy] && board[y + i * dy][x + i * dx]) {
                cells.push(board[y + i * dy][x + i * dx].getCellOwner());
            } else {
                cells.push(null);
            };
        };
        let playerCells = cells.filter(owner => owner !== "Bot" && owner !== null && owner !== false);
        let emptyCells = cells.filter(owner => owner === false);
        if (playerCells.length === 3 && emptyCells.length === 1) {
            const potentialBlockingMove = x + cells.indexOf(false) * dx;
            const potentialBlockingMoveHeight = y + cells.indexOf(false) * dy;
            // Check if the potential blocking move is at a valid height in the column
            if (isValidMove(potentialBlockingMove, board) && potentialBlockingMoveHeight === getTopEmptyRowInColumn(potentialBlockingMove)) {
                return potentialBlockingMove;
            }
        };
        return null;
    };
    const getTopEmptyRowInColumn = (column) => {
        const boardObj = GameControls.getGameBoard();
        const board = boardObj.board;
        const rows = boardObj.rows;
        for (let i = rows - 1; i >= 0; i--) {
            if (!board[i][column].getCellOwner()) {
                return i;
            }
        }
        return -1;
    };
    const checkIfCanBlockWin = () => {
        const boardObj = GameControls.getGameBoard();
        const board = boardObj.board;
        const rows = boardObj.rows;
        const cols = boardObj.columns;
    
        const directions = [
            { dx: 0, dy: 1 }, // vertical
            { dx: 1, dy: 0 }, // horizontal
            { dx: 1, dy: 1 }, // diagonal to the right
            { dx: 1, dy: -1 } // diagonal to the left
        ];
    
        for (let i = rows - 1; i >= 0; i--) {
            for (let j = cols - 1; j >= 0; j--) {
                for (let direction of directions) {
                    const blockMove = canBlockInDirection(board, j, i, direction.dx, direction.dy);
                    if (blockMove !== null) {
                        return blockMove;
                    };
                };
            };
        };
    
        return null;
    };

    return { getBotChoice };
})();

// Define Board module
const BoardControls = (() => {
    let gameBoard = {
        board: [],
        rows: 6,
        columns: 7
    };

    // Define Cell object
    const Cell = () => {
        let cellNum = null;
        let cellOwner = false;
        let cellClaimed = false;
        let cellRow = null;
        let cellCol = null;
        let isRowFull = false;
        let isColFull = false;
        let isTopLeftDiagFull = false;
        let isTopRightDiagFull = false;
        let isCellWinning = false;
        let isBoardFull = false;

        const setCellNum = (newCellNum) => cellNum = newCellNum;
        const getCellNum = () => cellNum;
        const setCellOwner = (newCellOwner) => cellOwner = newCellOwner;
        const getCellOwner = () => cellOwner;
        const setCellRow = (newCellRow) => cellRow = newCellRow;
        const getCellRow = () => cellRow;
        const setCellCol = (newCellCol) => cellCol = newCellCol;
        const getCellCol = () => cellCol;
        const setIsRowFull = (newIsRowFull) => isRowFull = newIsRowFull;
        const getIsRowFull = () => isRowFull;
        const setIsColFull = (newIsColFull) => isColFull = newIsColFull;
        const getIsColFull = () => isColFull;
        const setIsTopLeftDiagFull = (newIsTopLeftDiagFull) => isTopLeftDiagFull = newIsTopLeftDiagFull;
        const getIsTopLeftDiagFull = () => isTopLeftDiagFull;
        const setIsTopRightDiagFull = (newIsTopRightDiagFull) => isTopRightDiagFull = newIsTopRightDiagFull;
        const getIsTopRightDiagFull = () => isTopRightDiagFull;
        const setIsCellWinning = (newIsCellWinning) => isCellWinning = newIsCellWinning;
        const getIsCellWinning = () => isCellWinning;
        const setIsBoardFull = (newIsBoardFull) => isBoardFull = newIsBoardFull;
        const getIsBoardFull = () => isBoardFull;
        const getCellClaimed = () => cellClaimed;
        const setCellClaimed = (newSetCellClaimed) => cellClaimed = newSetCellClaimed;
        return { setCellNum, getCellNum, setCellOwner, getCellOwner, setCellRow, getCellRow, setCellCol, getCellCol, setIsRowFull, getIsRowFull, setIsColFull, getIsColFull, setIsTopLeftDiagFull, getIsTopLeftDiagFull, setIsTopRightDiagFull, getIsTopRightDiagFull, setIsCellWinning, getIsCellWinning, setIsBoardFull, getIsBoardFull, getCellClaimed, setCellClaimed };
    };

    // Initialize the game board
    const initBoard = (rows = 6, columns = 7) => {
        let count = 0;
        gameBoard.rows = rows;
        gameBoard.columns = columns;
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                let cell = Cell();
                cell.setCellNum(count);
                cell.setCellRow(i);
                cell.setCellCol(j);
                row.push(cell);
                count++;
            };
            gameBoard.board.push(row);
        };
    };

    const getBoard = () => gameBoard;

    // Function to reset the game board
    const resetBoard = () => gameBoard = {
        board: [],
        rows: 6,
        columns: 7
    };

    // Function to check if a row is full
    const checkIfRowIsFull = (row) => {
        // Check if any cell in the row is empty
        for (let i = 0; i < gameBoard.columns; i++) {
            if (gameBoard.board[row][i].getCellOwner() === false) {
                return false;
            };
        };

        // Mark the entire row as full
        for (let i = 0; i < gameBoard.columns; i++) {
            gameBoard.board[row][i].setIsRowFull(true);
        };

        return true;
    };

    const checkIfColIsFull = (col) => {
        // Check if any cell in the column is empty
        for (let i = 0; i < gameBoard.rows; i++) {
            if (gameBoard.board[i][col].getCellOwner() === false) {
            return false;
            };
        };

        // Mark the entire column as full
        for (let i = 0; i < gameBoard.rows; i++) {
            gameBoard.board[i][col].setIsColFull(true);
        };

        return true;
    };

    // Function to check if the top-left diagonal is full
    const checkIfTopLeftDiagIsFull = (row, col) => {
        let i = row;
        let j = col;
        while (i >= 0 && j >= 0) {
            // Check if the cell owner is false
            if (gameBoard.board[i][j].getCellOwner() === false) {
                return false;
            };
            i--;
            j--;
        };
        i = row;
        j = col;
        while (i < gameBoard.rows && j < gameBoard.columns) {
            // Set the top-left diagonal as full
            gameBoard.board[i][j].setIsTopLeftDiagFull(true);
            i++;
            j++;
        };
        return true;
    };

    // Function to check if the top-right diagonal is full
    const checkIfTopRightDiagIsFull = (row, col) => {
        let i = row;
        let j = col;
        while (i >= 0 && j < gameBoard.columns) {
            // Check if the cell owner is false
            if (gameBoard.board[i][j].getCellOwner() === false) {
                return false;
            };
            i--;
            j++;
        };
        i = row;
        j = col;
        while (i < gameBoard.rows && j >= 0) {
            // Set the top-right diagonal as full
            gameBoard.board[i][j].setIsTopRightDiagFull(true);
            i++;
            j--;
        };
        return true;
    };

    // Function to insert a token into the specified column for the given player
    const insertToken = (column, player) => {
        let rows = gameBoard.rows;
        let row = rows - 1;
        while (row >= 0) {
            // Check if the cell is empty
            if (gameBoard.board[row][column].getCellOwner() === false) {
                // Set the cell owner to the player's name
                gameBoard.board[row][column].setCellOwner(player.getName());
                // Mark the cell as claimed
                gameBoard.board[row][column].setCellClaimed(true);
                // Check if the row is full
                checkIfRowIsFull(row);
                // Check if the column is full
                checkIfColIsFull(column);
                // Check if the top-left diagonal is full
                checkIfTopLeftDiagIsFull(row, column);
                // Check if the top-right diagonal is full
                checkIfTopRightDiagIsFull(row, column);
                return;
            };
            row--;
        };
    };

    // Function the get winning cells
    const getWinningCells = () => {
        let winningCells = [];
        for (let i = 0; i < gameBoard.rows; i++) {
            for (let j = 0; j < gameBoard.columns; j++) {
                if (gameBoard.board[i][j].getIsCellWinning()) {
                    winningCells.push(gameBoard.board[i][j]);
                };
            };
        };
        return winningCells;
    }

    return { initBoard, getBoard, resetBoard, insertToken, getWinningCells };
})();

// Define Game module
const GameControls = (() => {
    let player1 = Player();
    let player2 = Player();
    let currentPlayer = player1;
    let roundWinner = null;
    let gameWinner = null;
    let lastRoundWinner = null;

    // Function to check if the game board is empty
    const isEmpty = () => {
        for (let i = 0; i < getGameBoard().rows; i++) {
            for (let j = 0; j < getGameBoard().columns; j++) {
                if (getGameBoard().board.length === 0) {
                    return false;
                };
            };
        };
        return true;
    };

    // Function to initialize game settings
    const gameSettings = (rows = null, cols = null) => { 
        // Check if both players are inactive
        if (player1.getActive() === false && player2.getActive() === false) {
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        };
        // Check if both players have a score of 0 and the game board is empty
        if (player1.getScore() === 0 && player2.getScore() === 0 && isEmpty()) {
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        };
        roundWinner = null;
        gameWinner = null;
        gameDraw = false;
    };

    // Function to initialize the game
    const initGame = (rows, cols) => {
        BoardControls.initBoard(rows, cols);
        gameSettings();
    };

    // Function to reset the game
    const resetGame = () => {
        BoardControls.resetBoard();
        gameSettings();
    };

    // Function to check if a move is valid
    const checkIfValidMove = (column) => {
        if (column < 0 || column >= getGameBoard().board.columns || getGameBoard().board[0][column].getCellOwner() !== false) {
            return false;
        };
        return true;
    };

    // Function to check if a player has won the game
    const checkIfWin = () => {
        if (checkIfRowWin() || checkIfColWin() || checkIfDiagWin()) {
            roundWinner = currentPlayer.getName();
            currentPlayer.incrementScore();
            return true;
        };
        return false;
    };

    // Function to check if a player has won in a row
    const checkIfRowWin = () => {
        const board = getGameBoard().board;
        for (let i = 0; i < getGameBoard().rows; i++) {
            for (let j = 0; j < getGameBoard().columns - 3; j++) {
                if (board[i][j].getCellOwner() === currentPlayer.getName() && board[i][j + 1].getCellOwner() === currentPlayer.getName() && board[i][j + 2].getCellOwner() === currentPlayer.getName() && board[i][j + 3].getCellOwner() === currentPlayer.getName()) {
                    board[i][j].setIsCellWinning(true);
                    board[i][j + 1].setIsCellWinning(true); 
                    board[i][j + 2].setIsCellWinning(true);
                    board[i][j + 3].setIsCellWinning(true);
                    return true;
                };
            };
        }
        return false;
    };

    // Function to check if a player has won in a column
    const checkIfColWin = () => {
        const board = getGameBoard().board;
        for (let i = 0; i < getGameBoard().rows - 3; i++) {
            for (let j = 0; j < getGameBoard().columns; j++) {
                if (board[i][j].getCellOwner() === getCurrentPlayer().getName() && board[i + 1][j].getCellOwner() === getCurrentPlayer().getName() && board[i + 2][j].getCellOwner() === getCurrentPlayer().getName() && board[i + 3][j].getCellOwner() === getCurrentPlayer().getName()) {
                    board[i][j].setIsCellWinning(true);
                    board[i + 1][j].setIsCellWinning(true);
                    board[i + 2][j].setIsCellWinning(true);
                    board[i + 3][j].setIsCellWinning(true);
                    return true;
                }
            }
        }
        return false;
    };

    // Function to check if a player has won in a diagonal (top-left to bottom-right)
    const checkIfDiagWin = () => {
        if (checkIfTopLeftDiagWin() || checkIfTopRightDiagWin()) {
            return true;
        }
        return false;
    };

    // Function to check if a player has won in a top-left diagonal
    const checkIfTopLeftDiagWin = () => {
        const board = getGameBoard().board;
        for (let i = 0; i < getGameBoard().rows - 3; i++) {
            for (let j = 0; j < getGameBoard().columns - 3; j++) {
                if (board[i][j].getCellOwner() === getCurrentPlayer().getName() && board[i + 1][j + 1].getCellOwner() === getCurrentPlayer().getName() && board[i + 2][j + 2].getCellOwner() === getCurrentPlayer().getName() && board[i + 3][j + 3].getCellOwner() === getCurrentPlayer().getName()) {
                    board[i][j].setIsCellWinning(true);
                    board[i + 1][j + 1].setIsCellWinning(true);
                    board[i + 2][j + 2].setIsCellWinning(true);
                    board[i + 3][j + 3].setIsCellWinning(true);
                    return true;
                }
            }
        }
        return false;
    };

    // Function to check if a player has won in a top-right diagonal
    const checkIfTopRightDiagWin = () => {
        const board = getGameBoard().board;
        for (let i = 0; i < getGameBoard().rows - 3; i++) {
            for (let j = 3; j < getGameBoard().columns; j++) {
                if (board[i][j].getCellOwner() === getCurrentPlayer().getName() && board[i + 1][j - 1].getCellOwner() === getCurrentPlayer().getName() && board[i + 2][j - 2].getCellOwner() === getCurrentPlayer().getName() && board[i + 3][j - 3].getCellOwner() === getCurrentPlayer().getName()) {
                    board[i][j].setIsCellWinning(true);
                    board[i + 1][j - 1].setIsCellWinning(true);
                    board[i + 2][j - 2].setIsCellWinning(true);
                    board[i + 3][j - 3].setIsCellWinning(true);
                    return true;
                }
            }
        }
        return false;
    };

    // Function to check if the game is a draw
    const checkIfDraw = () => {
        const board = getGameBoard().board;
        for (let i = 0; i < getGameBoard().rows; i++) {
            for (let j = 0; j < getGameBoard().columns; j++) {
                if (board[i][j].getCellOwner() === false) {
                    return false;
                };
            };
        };
        roundWinner = null;
        return true;
    };

    // Function to switch the current player
    const switchPlayer = () => {
        if (player1.getActive()) {
            player1.setActive(false);
            player2.setActive(true);
            currentPlayer = player2;
        } else if (player2.getActive()) {
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        }
    }

    // Function to reset players' scores
    const resetPlayersScore = () => {
        player1.resetScore();
        player2.resetScore();
    };

    const getLastRoundWinner = () => lastRoundWinner;
    const setLastRoundWinner = (newLastRoundWinner) => lastRoundWinner = newLastRoundWinner;
    const getGameBoard = () => BoardControls.getBoard();
    const setRoundWinner = (newRoundWinner) => roundWinner = newRoundWinner;
    const getRoundWinner = () => roundWinner;
    const getGameWinner = () => gameWinner;
    const getCurrentPlayer = () => currentPlayer;
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    const setPlayer1 = (newPlayer1) => player1 = newPlayer1;
    const setPlayer2 = (newPlayer2) => player2 = newPlayer2;

    return { initGame, resetGame, checkIfValidMove, checkIfWin, checkIfDraw, switchPlayer, getRoundWinner, getGameWinner, getCurrentPlayer, getPlayer1, getPlayer2, getGameBoard, resetPlayersScore, setRoundWinner, getLastRoundWinner, setLastRoundWinner, setPlayer1, setPlayer2 };
})();

// Define DOM general module
const DOMControls = (() => {
    // Define constants for different screens and elements
    const START_SCREEN = document.querySelector('#start-screen');
    const SETTINGS_SCREEN = document.querySelector('#settings-screen');
    const GAME_SCREEN = document.querySelector('#game-screen');
    const END_SCREEN = document.querySelector('#end-screen');
    const startBtn = document.querySelector('#start-btn');
    const player1NameInput = document.querySelector('#player1');
    const player1ColorInput = document.querySelector('#player1-color');
    const player1BotInput = document.querySelector('#player1-bot');
    const player1BotDiffInput = document.querySelector('#player1-bot-diff');
    const player2NameInput = document.querySelector('#player2');
    const player2ColorInput = document.querySelector('#player2-color');
    const player2BotInput = document.querySelector('#player2-bot');
    const player2BotDiffInput = document.querySelector('#player2-bot-diff');
    const rowsInput = document.querySelector('#rows');
    const columnsInput = document.querySelector('#columns');
    const startGameBtn = document.querySelector('#start-game-btn');
    const board = document.querySelector('#board');
    const player1NameOutput = document.querySelector('#player1-name');
    const player2NameOutput = document.querySelector('#player2-name');
    const player1ScoreOutput = document.querySelector('#player1-score');
    const player2ScoreOutput = document.querySelector('#player2-score');
    const backBtn = document.querySelector('#back-btn');
    const settingsBackBtn = document.querySelector('#settings-back');
    const settingsBtn = document.querySelector('#settings-btn');
    const continueBtn = document.querySelector('#continue-btn');
    const endMessage = document.querySelector('#end-message');
    const restartBtn = document.querySelector('#restart-btn');
    const exitBtn = document.querySelector('#exit-btn');
    const player1EndName = document.querySelector('#player1-end-name');
    const player2EndName = document.querySelector('#player2-end-name');
    const player1EndScore = document.querySelector('#player1-end-score');
    const player2EndScore = document.querySelector('#player2-end-score');


    // Handler for the start button on the home screen
    const startBtnHandler = async () => {
        removeListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "Exit";
        rowsInput.value = 6;
        columnsInput.value = 7;
        player1NameInput.value = "";
        player2NameInput.value = "";
        player1ColorInput.value = "#DD0A1E";
        player2ColorInput.value = "#4470AD";
        player1BotInput.checked = false;
        player2BotInput.checked = false;
        addListener(startGameBtn, startGameBtnHandlerHome);
        addListener(settingsBackBtn, backBtnHandlerHome);
        await AnimationsModule.startScreenTransitionAnimation();
        changeScreen(SETTINGS_SCREEN);
        InputsControl.init();
    };

    // Handler for the back button on the home settings screen
    const backBtnHandlerHome = async () => {
        InputsControl.resetInputsHandler();
        await AnimationsModule.settingsExitAnimation();
        changeScreen(START_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        addListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "";
    };

    // Handler for the start game button on the home settings screen
    const startGameBtnHandlerHome = async () => {
        GameControls.initGame(rowsInput.value, columnsInput.value);
        getSettings();
        GameControls.setRoundWinner(null);
        GameControls.setLastRoundWinner(null);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);

        handleGame();
        await AnimationsModule.gameStartAnimation();
        changeScreen(GAME_SCREEN);
        settingsBackBtn.innerHTML = "Back";
    };

    // Handler for the back button on the game settings screen
    const backBtnHandlerGame = async () => {
        await AnimationsModule.gameBackAnimation();
        changeScreen(GAME_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler); 
    };

    // Handler for the exit button on the game screen
    const backBtnHandler = () => {
        InputsControl.resetInputsHandler();
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startBtn, startBtnHandler);
        exitBtnHandler();
    };

    // Handler for the start game button on the game settings screen
    const startGameBtnHandlerGame = () => {
        GameControls.setRoundWinner(null);
        GameControls.setLastRoundWinner(null);
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        GameControls.getPlayer1().resetScore();
        GameControls.getPlayer2().resetScore();
        restartBtnHandler();
    };

    // Handler for the settings button on the game screen
    const settingsBtnHandler = async () => {
        await AnimationsModule.gameSettingsAnimation();
        changeScreen(SETTINGS_SCREEN);
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startGameBtn, startGameBtnHandlerGame);
        addListener(settingsBackBtn, backBtnHandlerGame);
    };

    // Handler for the restart button on the end screen
    const restartBtnHandler = async () => {
        GameControls.resetGame();
        GameControls.initGame(rowsInput.value, columnsInput.value);
        getSettings();
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        clearBoard();
        handleGame();
        if (END_SCREEN.classList.contains("display-on")) {
            await AnimationsModule.endRestartAnimation();
        } else {
            await AnimationsModule.gameStartAnimation();
        };
        changeScreen(GAME_SCREEN);
    };

    // Handler for the exit button on the end screen
    const exitBtnHandler = async () => {
        InputsControl.resetInputsHandler();
        if (END_SCREEN.classList.contains("display-on")) {
            removeListener(restartBtn, restartBtnHandler);
            removeListener(exitBtn, exitBtnHandler);
            await AnimationsModule.endExitAnimation();
        } else {
            await AnimationsModule.gameExitAnimation();
        };

        clearBoard();
        GameControls.resetGame();
        GameControls.resetPlayersScore();

        addListener(startBtn, startBtnHandler);
        changeScreen(START_SCREEN);
    };

    // Add event listener to an element
    const addListener = (element, handler, event = "click") => {
        element.addEventListener(event, handler);
    };

    // Remove event listener from an element
    const removeListener = (element, handler, event = "click") => {
        element.removeEventListener(event, handler);
    };

    // Clear event listeners from all cells
    const clearCellListeners = () => {
        const cells = getAllCellDivs();
        cells.forEach(cell => {
            cell.getEv
            cell.removeEventListener('click', cellHandler);
        });
    };

    const getAllCellDivs = () => {
        let cells = [];
        for (let i = 0; i < board.childNodes.length; i++) {
            for (let j = 0; j < board.childNodes[i].childNodes.length; j++) {
                cells.push(board.childNodes[i].childNodes[j]);
            };
        };
        return cells;
    };


    // Change the active screen
    const changeScreen = (screen) => {
        START_SCREEN.classList.add("display-off");
        START_SCREEN.classList.remove("display-on");
        SETTINGS_SCREEN.classList.add("display-off");
        SETTINGS_SCREEN.classList.remove("display-on");
        GAME_SCREEN.classList.add("display-off");
        GAME_SCREEN.classList.remove("display-on");
        END_SCREEN.classList.add("display-off");
        END_SCREEN.classList.remove("display-on");

        screen.classList.remove("display-off");
        screen.classList.add("display-on");
    };

    // Clear the game board
    const clearBoard = () => {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        };
    };

    // Get the game settings from the input fields
    const getSettings = () => {
        let rows = parseInt(rowsInput.value);
        let columns = parseInt(columnsInput.value);
        let player1Name = player1NameInput.value;
        let player1Bot = player1BotInput.checked;
        let player2Name = player2NameInput.value;
        let player2Bot = player2BotInput.checked;

        if (player1Bot === true && player2Bot === true) {
            return;
        };

        if (player1Bot === true) {
            player1Name = "Bot";
            if (player2Name === "") {
                player2Name = "Player 2";
            };
            
            GameControls.getPlayer1().setName(player1Name);
            GameControls.getPlayer2().setName(player2Name);
            GameControls.getPlayer1().setIsBot(true);
            GameControls.getPlayer2().setIsBot(false)
            return [rows, columns];
        };

        if (player2Bot === true) {
            player2Name = "Bot";
            if (player1Name === "") {
                player1Name = "Player 1";
            };
            
            GameControls.getPlayer1().setName(player1Name);
            GameControls.getPlayer2().setName(player2Name);
            GameControls.getPlayer1().setIsBot(false);
            GameControls.getPlayer2().setIsBot(true)
            return [rows, columns];
        };

        if (player1Bot === false && player2Bot === false) {

            if (player1Name === "") {
                player1Name = "Player 1";
            };
            if (player2Name === "") {
                player2Name = "Player 2";
            };

            GameControls.getPlayer1().setName(player1Name);
            GameControls.getPlayer2().setName(player2Name);
            GameControls.getPlayer1().setIsBot(false);
            GameControls.getPlayer2().setIsBot(false)

            return [rows, columns];
        };
    };

    // Function to handle the game logic
    const handleGame = () => {
        renderBoard();
        renderGamePlayer();
    };

    // Handler for the cell click event
    const cellHandler = async (e) => {
        let difficulty = getBotDifficulty();
        let cell = e.target;
        let column = parseInt(cell.dataset.cellCol)
        if (GameControls.getCurrentPlayer().getIsBot() === false && GameControls.checkIfValidMove(column) === true) {
            BoardControls.insertToken(column, GameControls.getCurrentPlayer());
        } else if (GameControls.getCurrentPlayer().getIsBot() === true) {
            column = BotLogic.getBotChoice(difficulty);
            BoardControls.insertToken(column, GameControls.getCurrentPlayer());
        } else {return};

        if (GameControls.checkIfWin()) {
            gameEndHandler("win");
            GameControls.switchPlayer()
        } else if (GameControls.checkIfDraw()) {
            gameEndHandler("draw");
        };
        renderBoard();
        GameControls.switchPlayer();
        await AnimationsModule.insertTokenAnimation(column);
    };

    // Function to convert a cell object to it's relative cell div
    const convertCellToDiv = (cell) => {
        let cellDiv = document.querySelector(`[data-cell-num="${cell.getCellNum()}"]`);
        return cellDiv;
    };

    // Handler for the game end event
    const gameEndHandler = (state) => {
        if (state === "win") {
            endMessage.textContent = `${GameControls.getCurrentPlayer().getName()} wins!`;
            let roundWinner = GameControls.getRoundWinner();
        } else if (state === "draw") {
            endMessage.textContent = "It's a draw!";
        };
        let winningCells = BoardControls.getWinningCells();
        let winningCellDivs = [];
        winningCells.forEach(cell => {
            let cellDiv = convertCellToDiv(cell);
            winningCellDivs.push(cellDiv);
        });
        winningCellDivs.forEach(cell => {
            cell.classList.add('winning-cell');
        });
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        continueBtn.style.display = "inline-block";
        backBtn.style.display = "none";
        settingsBtn.style.display = "none";
        continueBtn.addEventListener('click', endScreenHandler);
        clearCellListeners();
    };

    const endScreenHandler = () => {
        changeScreen(END_SCREEN);
        addListener(restartBtn, restartBtnHandler);
        renderEndPlayer();
        continueBtn.style.display = "none";
        backBtn.style.display = "inline-block";
        settingsBtn.style.display = "inline-block";
        continueBtn.removeEventListener('click', endScreenHandler);
    };

    // Function to render the game board
    const renderBoard = () => {
        clearBoard();
        let sheet = document.styleSheets[0];
        const boardArr = GameControls.getGameBoard().board;
        for (let i = 0; i < GameControls.getGameBoard().rows; i++) {
            let row = document.createElement('div');
            row.classList.add('cell-row');
            board.appendChild(row);
            for (let j = 0; j < GameControls.getGameBoard().columns; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.cellNum = GameControls.getGameBoard().board[i][j].getCellNum();
                cell.dataset.cellRow = GameControls.getGameBoard().board[i][j].getCellRow();
                cell.dataset.cellCol = boardArr[i][j].getCellCol();
                cell.dataset.cellOwner = boardArr[i][j].getCellOwner();
                cell.dataset.cellClaimed = boardArr[i][j].getCellClaimed();
                cell.dataset.isRowFull = boardArr[i][j].getIsRowFull();
                cell.dataset.isColFull = boardArr[i][j].getIsColFull();
                cell.dataset.isTopLeftDiagFull = boardArr[i][j].getIsTopLeftDiagFull();
                cell.dataset.isTopRightDiagFull = boardArr[i][j].getIsTopRightDiagFull();
                cell.dataset.isCellWinning = boardArr[i][j].getIsCellWinning();
                cell.dataset.isBoardFull = boardArr[i][j].getIsBoardFull();

                if (boardArr[i][j].getCellOwner() === GameControls.getPlayer1().getName()) {
                    cell.classList.add('cell-player1');
                    sheet.insertRule(`.cell-player1 { background-color: ${player1ColorInput.value}; }`, 0);

                } else if (boardArr[i][j].getCellOwner() === GameControls.getPlayer2().getName()) {
                    cell.classList.add('cell-player2');
                    sheet.insertRule(`.cell-player2 { background-color: ${player2ColorInput.value}; }`, 0);
                } else {
                    cell.classList.add('cell-empty');
                };

                if (boardArr[i][j].getIsCellWinning()) {
                    cell.classList.add('winning-cell');
                } else if (boardArr[i][j].getIsBoardFull()) {
                    cell.classList.add('board-full');
                };

                if (cell.dataset.isRowFull === "true") {
                    cell.classList.add('row-full');
                };
                if (cell.dataset.isColFull === "true") {
                    cell.classList.add('col-full');
                };
                if (cell.dataset.isTopLeftDiagFull === "true") {
                    cell.classList.add('top-left-diag-full');
                };
                if (cell.dataset.isTopRightDiagFull === true) {
                    cell.classList.add('top-right-diag-full');
                };

                if (j === 0) {
                    cell.classList.add('cell-left');
                };
                if (j === GameControls.getGameBoard.columns - 1) {
                    cell.classList.add('cell-right');
                };
                if (i === GameControls.getGameBoard.rows - 1) {
                    cell.classList.add('cell-bottom');
                };
                if (i === 0) {
                    cell.classList.add('cell-top');
                };;

                let isGameOver = GameControls.getRoundWinner() !== null || GameControls.getGameWinner() !== null;

                if (isGameOver) {
                    cell.removeEventListener('click', cellHandler);
                    row.appendChild(cell);
                } else {
                    if (GameControls.getCurrentPlayer().getIsBot() === false) {
                        cell.addEventListener('click', cellHandler);
                        row.appendChild(cell);
                    } else {
                        cell.addEventListener('click', cellHandler);
                        row.appendChild(cell);
                    };
                };
            };
        };
    };

    // Function to render the game player information
    const renderGamePlayer = () => {
        player1NameOutput.textContent = GameControls.getPlayer1().getName();
        player2NameOutput.textContent = GameControls.getPlayer2().getName();
        player1ScoreOutput.textContent = GameControls.getPlayer1().getScore();
        player2ScoreOutput.textContent = GameControls.getPlayer2().getScore();
    };

    // Function to render the end player information
    const renderEndPlayer = () => {
        player1EndName.textContent = GameControls.getPlayer1().getName();
        player2EndName.textContent = GameControls.getPlayer2().getName();
        player1EndScore.textContent = GameControls.getPlayer1().getScore();
        player2EndScore.textContent = GameControls.getPlayer2().getScore();
    };

    const getBotDifficulty = () => {
        let difficulty;
        if (player1BotInput.checked === true) {
            difficulty = player1BotDiffInput.value;
        } else if (player2BotInput.checked === true) {
            difficulty = player2BotDiffInput.value;
        };
        return difficulty;
    };

    // Initialization function
    const init = () => {
        addListener(startBtn, startBtnHandler);
    };

    
    return { init };
})();

// Define Bot logic module
const AnimationsModule = (() => {
    // Define constants for different screens
    const START_SCREEN = document.querySelector('#start-screen');
    const SETTINGS_SCREEN = document.querySelector('#settings-screen');
    const GAME_SCREEN = document.querySelector('#game-screen');
    const END_SCREEN = document.querySelector('#end-screen');


    // Function to start the screen transition animation
    const startScreenTransitionAnimation = async () => {
        START_SCREEN.classList.add("start-screen-start-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-start-animation");
        SETTINGS_SCREEN.classList.add("display-on");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-start-animation");
        START_SCREEN.classList.remove("start-screen-start-animation");
        START_SCREEN.classList.remove("display-on");
    };

    // Function to animate the exit of the settings screen
    const settingsExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        SETTINGS_SCREEN.classList.add("settings-screen-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-exit-animation");
        SETTINGS_SCREEN.classList.remove("display-on");
    };

    // Function to animate the start of the game
    const gameStartAnimation = async () => {
        GAME_SCREEN.classList.remove("display-off");
        GAME_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-start-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-game-start-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-game-start-animation");
        GAME_SCREEN.classList.remove("game-screen-game-start-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    // Function to animate the exit of the game
    const gameExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        GAME_SCREEN.classList.remove("game-screen-game-exit-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    // Function to animate the game settings
    const gameSettingsAnimation = async () => {
        SETTINGS_SCREEN.classList.remove("display-off");
        SETTINGS_SCREEN.classList.add("display-on");
        SETTINGS_SCREEN.classList.add("settings-screen-game-settings-animation");
        GAME_SCREEN.classList.add("game-screen-game-settings-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-game-settings-animation");
        GAME_SCREEN.classList.remove("game-screen-game-settings-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    // Function to animate the game back
    const gameBackAnimation = async () => {
        GAME_SCREEN.classList.remove("display-off");
        GAME_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-back-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-game-back-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("display-on");
        SETTINGS_SCREEN.classList.remove("settings-screen-game-back-animation");
        GAME_SCREEN.classList.remove("game-screen-game-back-animation");
    };

    // Function for the game start decorative animation
    const gameStartDecorativeAnimation = async () => {};

    // Function for the end restart animation
    const endRestartAnimation = async () => {
        GAME_SCREEN.classList.remove("display-off");
        GAME_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-end-restart-animation");
        END_SCREEN.classList.add("end-screen-end-restart-animation");
        await new Promise(r => setTimeout(r, 500));
        END_SCREEN.classList.remove("end-screen-end-restart-animation");
        GAME_SCREEN.classList.remove("game-screen-end-restart-animation");
        GAME_SCREEN.classList.remove("display-on");
    };

    // Function for the end exit animation
    const endExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        START_SCREEN.classList.add("start-screen-end-exit-animation");
        END_SCREEN.classList.add("end-screen-end-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        END_SCREEN.classList.remove("end-screen-end-exit-animation");
        START_SCREEN.classList.remove("start-screen-end-exit-animation");
        END_SCREEN.classList.remove("display-on");
    };

    // Function to animate the insertion of a token
    const insertTokenAnimation = async (column) => {
        let topCell = getTopCell(column);
        let rowOfTopCell = parseInt(topCell.dataset.cellRow);
        switch (rowOfTopCell) {
            case 0:
                topCell.classList.add('insert-token-row-0');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-0');
                break;
            case 1:
                topCell.classList.add('insert-token-row-1');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-1');
                break;
            case 2:
                topCell.classList.add('insert-token-row-2');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-2');
                break;
            case 3:
                topCell.classList.add('insert-token-row-3');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-3');
                break;
            case 4:
                topCell.classList.add('insert-token-row-4');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-4');
                break;
            case 5:
                topCell.classList.add('insert-token-row-5');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-5');
                break;
            case 6: 
                topCell.classList.add('insert-token-row-6');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-6');
                break;
            case 7:
                topCell.classList.add('insert-token-row-7');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-7');
                break;
            case 8:
                topCell.classList.add('insert-token-row-8');
                await new Promise(r => setTimeout(r, 500));
                topCell.classList.remove('insert-token-row-8');
                break;
        };
    };

    // Function to animate the platform filled state
    const platformFilledAnimation = async () => {
        const board = GameControls.getGameBoard().board;
        for (let i = 0; i < GameControls.getGameBoard().rows; i++) {
            for (let j = 0; j < GameControls.getGameBoard().columns; j++) {
                if (board[i][j].getIsRowFull()) {
                    let tempRow = document.querySelectorAll(`[data-cell-row="${i}"]`);
                    tempRow.forEach(cell => {
                        cell.classList.add('row-full-animation');
                    });
                    await new Promise(r => setTimeout(r, 500));
                    tempRow.forEach(cell => {
                        cell.classList.remove('row-full-animation');
                    });
                };
                if (board[i][j].getIsColFull()) {
                    let tempCol = document.querySelectorAll(`[data-cell-col="${j}"]`);
                    tempCol.forEach(cell => {
                        cell.classList.add('col-full-animation');
                    });
                    await new Promise(r => setTimeout(r, 500));
                    tempCol.forEach(cell => {
                        cell.classList.remove('col-full-animation');
                    });
                };
                if (board[i][j].getIsTopLeftDiagFull()) {
                    let tempTopLeftDiag = [];
                    let tempI = i;
                    let tempJ = j;
                    while (tempI >= 0 && tempJ >= 0) {
                        tempTopLeftDiag.push(document.querySelector(`[data-cell-row="${tempI}"][data-cell-col="${tempJ}"]`));
                        tempI--;
                        tempJ--;
                    };
                    tempTopLeftDiag.forEach(cell => {
                        cell.classList.add('top-left-diag-full-animation');
                    });
                    await new Promise(r => setTimeout(r, 500));
                    tempTopLeftDiag.forEach(cell => {
                        cell.classList.remove('top-left-diag-full-animation');
                    });
                };
                if (board[i][j].getIsTopRightDiagFull()) {
                    let tempTopRightDiag = [];
                    let tempI = i;
                    let tempJ = j;
                    while (tempI >= 0 && tempJ < GameControls.getGameBoard().columns) {
                        tempTopRightDiag.push(document.querySelector(`[data-cell-row="${tempI}"][data-cell-col="${tempJ}"]`));
                        tempI--;
                        tempJ++;
                    };
                    tempTopRightDiag.forEach(cell => {
                        cell.classList.add('top-right-diag-full-animation');
                    });
                    await new Promise(r => setTimeout(r, 500));
                    tempTopRightDiag.forEach(cell => {
                        cell.classList.remove('top-right-diag-full-animation');
                    });
                };
            };
        };
    };

    // Function for the winning cells animation
    const winningCellsAnimation = async () => {};

    // Function for the draw cells animation
    const drawCellsAnimation = async () => {};

    // Function for the win animation
    const winAnimation = async () => {};

    // Function for the draw animation
    const drawAnimation = async () => {};

    // Get the top claimed cell in a column, and return the bottom cell if none
    const getTopCell = (column) => {
        let cells = document.querySelectorAll(`[data-cell-col="${column}"]`);
        let topCell = cells[0];
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].dataset.cellClaimed === "true") {
                topCell = cells[i];
                break;
            };
        };
        return topCell;
    };

    return { startScreenTransitionAnimation, settingsExitAnimation, gameStartAnimation, gameExitAnimation, gameSettingsAnimation, gameBackAnimation, gameStartDecorativeAnimation, endRestartAnimation, endExitAnimation, insertTokenAnimation, platformFilledAnimation, winningCellsAnimation, drawCellsAnimation, winAnimation, drawAnimation };

})();

// Define the board module
const InputsControl = (() => {
    const player1NameInput = document.querySelector('#player1');
    const player1ColorInput = document.querySelector('#player1-color');
    const player1BotInput = document.querySelector('#player1-bot');
    const player1BotDiffInput = document.querySelector('#player1-bot-diff');
    const player1BotDiffLabel = document.querySelector('#bot-diff-1');
    const player2NameInput = document.querySelector('#player2');
    const player2ColorInput = document.querySelector('#player2-color');
    const player2BotInput = document.querySelector('#player2-bot');
    const player2BotDiffInput = document.querySelector('#player2-bot-diff');
    const player2BotDiffLabel = document.querySelector('#bot-diff-2');
    const rowsInput = document.querySelector('#rows');
    const columnsInput = document.querySelector('#columns');

    const namesInputHandler = () => {
        const hebEnReg = /^[a-z0-9\u0590-\u05fe\s]*$/i;;
        player1NameInput.addEventListener('click', () => {
            player1NameInput.value = "";
        });
        player2NameInput.addEventListener('click', () => {
            player2NameInput.value = "";
        });
        player1NameInput.addEventListener('input', () => {
            if (player1NameInput.value.length > 10) {
                player1NameInput.value = player1NameInput.value.slice(0, 10);
            };
            if (!hebEnReg.test(player1NameInput.value)) {
                alert("Please enter a valid name");
            };
            if (player1NameInput.value === "null" || player1NameInput.value === "Bot" || player1NameInput.value === "undefined") {
                alert("Invalid name")
            }
        });
        player2NameInput.addEventListener('input', () => {
            if (player2NameInput.value.length > 10) {
                player2NameInput.value = player2NameInput.value.slice(0, 10);
            };
            if (!hebEnReg.test(player2NameInput.value)) {
                alert("Please enter a valid name");
            };
            if (player2NameInput.value === "null" || player2NameInput.value === "Bot" || player2NameInput.value === "undefined") {
                alert("Invalid name")
            }
        });
    };

    const botCheckboxHandler = () => {
        player1BotInput.addEventListener('change', () => {
            if (player1BotInput.checked === true) {
                player1NameInput.value = "Bot";
                player1NameInput.disabled = true;
                player1BotDiffInput.disabled = false;
                player2BotDiffInput.disabled = true;
                player2BotInput.checked = false;
                player2NameInput.disabled = false;
                player2BotDiffLabel.classList.add('disabled-diff');
                player1BotDiffLabel.classList.remove('disabled-diff');
                player2BotDiffInput.value = 1;
                player1NameInput.classList.add("disabled-name");
                player2NameInput.classList.remove("disabled-name");
                if (player2NameInput.value === "Bot") {
                    player2NameInput.value = "";
                };
            } else {
                player1NameInput.value = "";
                player1NameInput.disabled = false;
                player1BotDiffInput.disabled = true;
                player1BotDiffLabel.classList.add('disabled-diff');
                player1NameInput.classList.remove("disabled-name");
            };
        });
        player2BotInput.addEventListener('change', () => {
            if (player2BotInput.checked === true) {
                player2NameInput.value = "Bot";
                player2NameInput.disabled = true;
                player2BotDiffInput.disabled = false;
                player1BotDiffInput.disabled = true;
                player1BotInput.checked = false;
                player1NameInput.disabled = false;
                player1BotDiffLabel.classList.add('disabled-diff');
                player2BotDiffLabel.classList.remove('disabled-diff');
                player1BotDiffInput.value = 1;
                player2NameInput.classList.add("disabled-name");
                player1NameInput.classList.remove("disabled-name");
                if (player1NameInput.value === "Bot") {
                    player1NameInput.value = "";
                };
            } else {
                player2NameInput.value = "";
                player2NameInput.disabled = false;
                player2BotDiffInput.disabled = true;
                player2BotDiffLabel.classList.add('disabled-diff');
                player2NameInput.classList.remove("disabled-name");

            };
        });
    };

    const rowsAndColumnsInputHandler = () => {
        rowsInput.addEventListener('input', () => {
            if (rowsInput.value > 10) {
                rowsInput.value = 10;
            };
            if (rowsInput.value < 4) {
                rowsInput.value = 4;
            };
        });
        columnsInput.addEventListener('input', () => {
            if (columnsInput.value > 10) {
                columnsInput.value = 10;
            };
            if (columnsInput.value < 4) {
                columnsInput.value = 4;
            };
        });
    };

    const removeInputsListeners = () => {
        player1NameInput.removeEventListener('click', () => {});
        player2NameInput.removeEventListener('click', () => {});
        player1NameInput.removeEventListener('input', () => {});
        player2NameInput.removeEventListener('input', () => {});
        player1BotInput.removeEventListener('change', () => {});
        player2BotInput.removeEventListener('change', () => {});
    };

    const resetInputsHandler = () => {
        removeInputsListeners();
        player1NameInput.value = "";
        player1ColorInput.value = "#FF0000";
        player1BotInput.checked = false;
        player1BotDiffInput.value = 1;
        player1BotDiffInput.disabled = true;
        player1BotDiffLabel.classList.add('disabled-diff');
        player1NameInput.classList.remove("disabled-name");

        player2NameInput.value = "";
        player2ColorInput.value = "#0000FF";
        player2BotInput.checked = false;
        player2BotDiffInput.value = 1;
        player2BotDiffInput.disabled = true;
        rowsInput.value = 6;
        columnsInput.value = 7;
        player2BotDiffLabel.classList.add('disabled-diff');
        player2NameInput.classList.remove("disabled-name");
    };

    const init = () => {
        namesInputHandler();
        botCheckboxHandler();
        rowsAndColumnsInputHandler();
    };

    return { init, resetInputsHandler };
})();

// Initialize the DOM controls
DOMControls.init();

