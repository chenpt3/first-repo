const Player = (name) => {
    let score = 0;
    let active = false;

    const setName = (newName) => name = newName;
    const getName = () => name;
    const getScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;
    const setActive = (newActive) => active = newActive;
    const getActive = () => active;

    return { setName, getName, getScore, incrementScore, resetScore, setActive, getActive};
}; 

const BoardControls = (() => {
    let gameBoard = {
        board: [],
        rows: null,
        columns: null
    };

    const Cell = () => { // Define Cell object
        let cellNum = null;
        let cellOwner = null;
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
        const setCellClaimed = (newSetCellClaimed) => newSetCellClaimed = cellClaimed; 

        return { setCellNum, getCellNum, setCellOwner, getCellOwner, setCellRow, getCellRow, setCellCol, getCellCol, setIsRowFull, getIsRowFull, setIsColFull, getIsColFull, setIsTopLeftDiagFull, getIsTopLeftDiagFull, setIsTopRightDiagFull, getIsTopRightDiagFull, setIsCellWinning, getIsCellWinning, setIsBoardFull, getIsBoardFull, getCellClaimed, setCellClaimed };
    };

    const initBoard = (rows = 6, columns = 7) => { // Initialize the game board, returns a game board object
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

    const resetBoard = () => gameBoard = {
        board: [],
        rows: null,
        columns: null
    };

    const checkIfRowIsFull = (row) => {
        for (let i = 0; i < gameBoard.columns; i++) {
            if (gameBoard.board[row][i].getCellOwner() === null) {
                return false;
            };
        };
        for (let i = 0; i < gameBoard.columns; i++) {
            gameBoard.board[row][i].setIsRowFull(true);
        };
        return true;
    };

    const checkIfColIsFull = (col) => {
        for (let i = 0; i < gameBoard.rows; i++) {
            if (gameBoard.board[i][col].getCellOwner() === null) {
                return false;
            };
        };
        for (let i = 0; i < gameBoard.rows; i++) {
            gameBoard.board[i][col].setIsColFull(true);
        };
        return true;
    };

    const checkIfTopLeftDiagIsFull = (row, col) => {
        let i = row;
        let j = col;
        while (i >= 0 && j >= 0) {
            if (gameBoard.board[i][j].getCellOwner() === null) {
                return false;
            };
            i--;
            j--;
        };
        i = row;
        j = col;
        while (i < gameBoard.rows && j < gameBoard.columns) {
            gameBoard.board[i][j].setIsTopLeftDiagFull(true);
            i++;
            j++;
        };
        return true;
    };

    const checkIfTopRightDiagIsFull = (row, col) => {
        let i = row;
        let j = col;
        while (i >= 0 && j < gameBoard.columns) {
            if (gameBoard.board[i][j].getCellOwner() === null) {
                return false;
            };
            i--;
            j++;
            console.log(i, j)
        };
        i = row;
        j = col;
        while (i < gameBoard.rows && j >= 0) {
            gameBoard.board[i][j].setIsTopRightDiagFull(true);
            i++;
            j--;
        };
        return true;
    };

    const insertToken = (column, player) => {
        let rows = gameBoard.rows;
        let row = rows - 1;
        while (row >= 0) {
            if (gameBoard.board[row][column].getCellOwner() === null) {
                gameBoard.board[row][column].setCellOwner(player.getName());
                gameBoard.board[row][column].setCellClaimed(true);
                checkIfRowIsFull(row);
                checkIfColIsFull(column);
                checkIfTopLeftDiagIsFull(row, column);
                checkIfTopRightDiagIsFull(row, column);
                return;
            };
            row--;
        };
    }

    return { initBoard, getBoard, resetBoard, insertToken };
})();

const GameControls = (() => {
    let player1 = Player("Player 1");
    let player2 = Player("Player 2");
    let currentPlayer = player1;
    let roundWinner = null;
    let gameWinner = null;
    let lastRoundWinner = null;

    const isEmpty = () => {
        for (let i = 0; i < getGameBoard().rows; i++) {
            for (let j = 0; j < getGameBoard().columns; j++) {
                if (getGameBoard().board[i][j].getCellOwner() !== null) {
                    return false;
                };
            };
        };
        return true;
    };

    const gameSettings = (rows = null, cols = null) => { 
        if (player1.getActive() === false && player2.getActive() === false) {
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        };
        if (player1.getScore() === 0 && player2.getScore() === 0 && isEmpty()) {
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        };
        roundWinner = null;
        gameWinner = null;
        gameDraw = false;
    };

    const initGame = (rows, cols) => {
        BoardControls.initBoard(rows, cols);
        gameSettings();
    };

    const resetGame = () => {
        BoardControls.resetBoard();
        gameSettings();
    };

    const checkIfValidMove = (column) => {
        if (column < 0 || column >= getGameBoard().board.columns || getGameBoard().board[0][column].getCellOwner() !== null) {
            return false;
        };
        return true;
    };

    const checkIfWin = () => {
        if (checkIfRowWin() || checkIfColWin() || checkIfDiagWin()) {
            roundWinner = currentPlayer.getName();
            currentPlayer.incrementScore();
            return true;
        };
        return false;
    };

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

    const checkIfDiagWin = () => {
        if (checkIfTopLeftDiagWin() || checkIfTopRightDiagWin()) {
            return true;
        }
        return false;
    };

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

    const checkIfDraw = () => {
        const board = getGameBoard().board;
        for (let i = 0; i < getGameBoard().rows; i++) {
            for (let j = 0; j < getGameBoard().columns; j++) {
                if (board[i][j].getCellOwner() === null) {
                    return false;
                };
            };
        };
        roundWinner = null;
        return true;
    };

    const switchPlayer = () => {
        if (player1.getActive()) {
            player1.setActive(false);
            player2.setActive(true);
            currentPlayer = player2;
        } else if (player2.getActive()){
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        } else {
            player1.setActive(true);
            player2.setActive(false);
            currentPlayer = player1;
        }
    }

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
    const getCurrentPlayer = () => {
        if (player1.getActive()) {
            return player1;
        } else if (player2.getActive()) {
            return player2;
        } else {
            return player1;
        }
    }
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;

    return { initGame, resetGame, checkIfValidMove, checkIfWin, checkIfDraw, switchPlayer, getRoundWinner, getGameWinner, getCurrentPlayer, getPlayer1, getPlayer2, getGameBoard, resetPlayersScore, setRoundWinner, getLastRoundWinner, setLastRoundWinner };
})();

const DOMControls = (() => {
    const START_SCREEN = document.querySelector('#start-screen');
    const SETTINGS_SCREEN = document.querySelector('#settings-screen');
    const GAME_SCREEN = document.querySelector('#game-screen');
    const END_SCREEN = document.querySelector('#end-screen');
    const startBtn = document.querySelector('#start-btn');
    const player1NameInput = document.querySelector('#player1');
    const player2NameInput = document.querySelector('#player2');
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
    const endMessage = document.querySelector('#end-message');
    const restartBtn = document.querySelector('#restart-btn');
    const exitBtn = document.querySelector('#exit-btn');
    const player1EndName = document.querySelector('#player1-end-name');
    const player2EndName = document.querySelector('#player2-end-name');
    const player1EndScore = document.querySelector('#player1-end-score');
    const player2EndScore = document.querySelector('#player2-end-score');

    const clearBoard = () => {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        };
    };

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

    const getTopCell = (column) => {
        let tempRows = document.querySelectorAll(`[data-cell-col="${column}"]`);
        let tempCell = null;
    
        for (let i = 0; i < tempRows.length; i++) {
            if (tempRows[i].dataset.cellOwner !== "null") {
                tempCell = tempRows[i];
                break;
            };
        };

        return tempCell;
    };

    const addListener = (element, handler, event = "click") => {
        element.addEventListener(event, handler);
    };

    const removeListener = (element, handler, event = "click") => {
        element.removeEventListener(event, handler);
    };

    const clearCellListeners = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', cellHandler);
        });
    };

    const getSettings = () => {
        let rows = parseInt(rowsInput.value);
        let columns = parseInt(columnsInput.value);
        let player1Name = player1NameInput.value;
        let player2Name = player2NameInput.value;

        if (rows < 4 || rows > 9 || isNaN(rows)) {
            rows = 6;
        };
        if (columns < 4 || columns > 9 || isNaN(columns)) {
            columns = 7;
        };
        if (player1Name === "") {
            player1Name = "Player 1";
        };
        if (player2Name === "") {
            player2Name = "Player 2";
        };

        GameControls.getPlayer1().setName(player1Name);
        GameControls.getPlayer2().setName(player2Name);
        return [rows, columns];
    };

    const startBtnHandler = async () => {
        removeListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "Exit";
        rowsInput.value = 6;
        columnsInput.value = 7;
        player1NameInput.value = "Player 1";
        player2NameInput.value = "Player 2";
        await startScreenTransitionAnimation();
        addListener(startGameBtn, startGameBtnHandlerHome);
        addListener(settingsBackBtn, backBtnHandlerHome);
        changeScreen(SETTINGS_SCREEN);
    };

    const backBtnHandlerHome = async () => {
        await settingsExitAnimation();
        changeScreen(START_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        addListener(startBtn, startBtnHandler);
        settingsBackBtn.innerHTML = "";
    };

    const startGameBtnHandlerHome = async () => {
        GameControls.setRoundWinner(null);
        GameControls.setLastRoundWinner(null);
        removeListener(startGameBtn, startGameBtnHandlerHome);
        removeListener(settingsBackBtn, backBtnHandlerHome);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        getSettings();
        handleGame();
        await gameStartAnimation();
        changeScreen(GAME_SCREEN);
        settingsBackBtn.innerHTML = "";
    };

    const backBtnHandlerGame = async () => {
        await gameBackAnimation();
        changeScreen(GAME_SCREEN);
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);  
    };

    const backBtnHandler = () => {
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startBtn, startBtnHandler);
        exitBtnHandler();
    };

    const startGameBtnHandlerGame = () => {
        GameControls.setRoundWinner(null);
        GameControls.setLastRoundWinner(null);
        removeListener(settingsBackBtn, backBtnHandlerGame);
        removeListener(startGameBtn, startGameBtnHandlerGame);
        GameControls.getPlayer1().resetScore();
        GameControls.getPlayer2().resetScore();
        getSettings();
        restartBtnHandler();
    };

    const settingsBtnHandler = async () => {
        settingsBackBtn.innerHTML = "Back";
        await gameSettingsAnimation();
        changeScreen(SETTINGS_SCREEN);
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        addListener(startGameBtn, startGameBtnHandlerGame);
        addListener(settingsBackBtn, backBtnHandlerGame);
    };

    const restartBtnHandler = async () => {
        clearCellListeners();
        addListener(backBtn, backBtnHandler);
        addListener(settingsBtn, settingsBtnHandler);
        clearBoard();
        GameControls.resetGame();
        handleGame();
        if (END_SCREEN.classList.contains("display-on")) {
            await endRestartAnimation();
        } else {
            await gameStartAnimation();
        };
        changeScreen(GAME_SCREEN);
    };

    const exitBtnHandler = async () => {
        if (END_SCREEN.classList.contains("display-on")) {
            removeListener(restartBtn, restartBtnHandler);
            removeListener(exitBtn, exitBtnHandler);
            await endExitAnimation();
        } else {
            await gameExitAnimation();
        };

        clearCellListeners();
        clearBoard();
        GameControls.resetGame();
        GameControls.resetPlayersScore();

        addListener(startBtn, startBtnHandler);
        changeScreen(START_SCREEN);
    };

    const handleGame = () => {
        renderBoard();
        renderGamePlayer();
    };

    const cellHandler = async (e) => {
        let cell = e.target;
        let column = parseInt(cell.dataset.cellCol)

        if (GameControls.checkIfValidMove(column) === false) return;
        BoardControls.insertToken(column, GameControls.getCurrentPlayer());

        if (GameControls.checkIfWin()) {
            gameEndHandler("win");
            GameControls.switchPlayer()
        } else if (GameControls.checkIfDraw()) {
            gameEndHandler("draw");
        };

        renderBoard();
;       insertTokenAnimation(cell);
        GameControls.switchPlayer();
    };

    const gameEndHandler = (state) => {
        if (state === "win") {
            endMessage.textContent = `${GameControls.getCurrentPlayer().getName()} wins!`;
        } else if (state === "draw") {
            endMessage.textContent = "It's a draw!";
        };
        changeScreen(END_SCREEN);
        addListener(restartBtn, restartBtnHandler);
        addListener(exitBtn, exitBtnHandler);
        removeListener(backBtn, backBtnHandler);
        removeListener(settingsBtn, settingsBtnHandler);
        renderEndPlayer();
    };

    const renderGamePlayer = () => {
        player1NameOutput.textContent = GameControls.getPlayer1().getName();
        player2NameOutput.textContent = GameControls.getPlayer2().getName();
        player1ScoreOutput.textContent = GameControls.getPlayer1().getScore();
        player2ScoreOutput.textContent = GameControls.getPlayer2().getScore();
    };

    const renderEndPlayer = () => {
        player1EndName.textContent = GameControls.getPlayer1().getName();
        player2EndName.textContent = GameControls.getPlayer2().getName();
        player1EndScore.textContent = GameControls.getPlayer1().getScore();
        player2EndScore.textContent = GameControls.getPlayer2().getScore();
    };

    const renderBoard = () => {
        clearBoard();
        let tempArr = getSettings();
        GameControls.initGame(tempArr[0], tempArr[1]);
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
                } else if (boardArr[i][j].getCellOwner() === GameControls.getPlayer2().getName()) {
                    cell.classList.add('cell-player2');
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

                cell.addEventListener('click', cellHandler);
                row.appendChild(cell);
            };
        };
    };

    const startScreenTransitionAnimation = async () => {
        START_SCREEN.classList.add("start-screen-start-animation");
        SETTINGS_SCREEN.classList.add("settings-screen-start-animation");
        SETTINGS_SCREEN.classList.add("display-on");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-start-animation");
        START_SCREEN.classList.remove("start-screen-start-animation");
        START_SCREEN.classList.remove("display-on");
    };

    const settingsExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        SETTINGS_SCREEN.classList.add("settings-screen-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        SETTINGS_SCREEN.classList.remove("settings-screen-exit-animation");
        SETTINGS_SCREEN.classList.remove("display-on");
    };

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

    const gameExitAnimation = async () => {
        START_SCREEN.classList.remove("display-off");
        START_SCREEN.classList.add("display-on");
        GAME_SCREEN.classList.add("game-screen-game-exit-animation");
        await new Promise(r => setTimeout(r, 500));
        GAME_SCREEN.classList.remove("game-screen-game-exit-animation");

        GAME_SCREEN.classList.remove("display-on");
    };

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
    
    const gameStartDecorativeAnimation = async () => {};

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

    const insertTokenAnimation = async (token) => {
        let tempCol = parseInt(token.dataset.cellCol);
        let topCell = getTopCell(tempCol);
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

    const winningCellsAnimation = async () => {};

    const drawCellsAnimation = async () => {};

    const winAnimation = async () => {};

    const drawAnimation = async () => {};

    const init = () => {
        addListener(startBtn, startBtnHandler);
    };

    return { init };

})();

DOMControls.init();